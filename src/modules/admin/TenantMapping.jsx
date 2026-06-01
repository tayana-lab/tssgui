import React, { useState, useEffect } from 'react';
import TssSpinner from '@app/modules/common/default/components/TssSpinner';
import { showToast } from '@app/modules/common/default/components/TssFunction';
import { useTranslation } from 'react-i18next';
import tssguiConf from '@app/modules/conf/TssGui.json';
import TenantMappingView from '@app/modules/admin/TenantMappingView';
import TenantMappingAdd from '@app/modules/admin/TenantMappingAdd';

const url = tssguiConf.SERVER_JS_API_URI;

const emptyForm = { tenantId: '', productId: '', mappingId: '' };

const TenantMapping = () => {
  const [t] = useTranslation();
  const [loading, setLoading]                       = useState(false);
  const [mappingList, setMappingList]               = useState([]);
  const [displayAddPage, setDisplayAddPage]         = useState(false);
  const [displayModifyPage, setDisplayModifyPage]   = useState(false);
  const [form, setForm]                             = useState(emptyForm);
  const [mappingToDelete, setMappingToDelete]       = useState(null);

  const [tenantOptions, setTenantOptions]           = useState([]);
  const [productOptions, setProductOptions]         = useState([]);
  const [tenantDefaultValue, setTenantDefaultValue]   = useState({});
  const [productDefaultValue, setProductDefaultValue] = useState({});
  const [tenantValidationTheme, setTenantValidationTheme]   = useState('selectForm');
  const [productValidationTheme, setProductValidationTheme] = useState('selectForm');

  const sessionId = localStorage.getItem('sessionID');
  const serverIp  = localStorage.getItem('serverIP');
  const clientIp  = localStorage.getItem('clientIP');
  const clientId  = localStorage.getItem('acctID');
  const productId = tssguiConf.PRODUCT_ID;

  // ── API ──────────────────────────────────────────────────────────────
  const getMappingList = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${url}/tenant/mapping/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          i_session_id: sessionId, i_server_ip: serverIp,
          i_client_ip: clientIp,   i_client_id: clientId,
          i_product_id: productId,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setMappingList(Array.isArray(data) ? data : data.data || []);
      }
    } catch (err) {
      // API not yet connected
    } finally {
      setLoading(false);
    }
  };

  const fetchTenants = async () => {
    try {
      const response = await fetch(`${url}/tenant/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          i_session_id: sessionId, i_server_ip: serverIp,
          i_client_ip: clientIp,   i_client_id: clientId,
          i_product_id: productId,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const list = Array.isArray(data) ? data : data.data || [];
        setTenantOptions(list.map((item) => ({
          label: item.TENANT_NAME || item.tenantName,
          value: item.TENANT_ID   || item.tenantId,
        })));
      }
    } catch (err) { /* silently fail */ }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${url}/product/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          i_session_id: sessionId, i_server_ip: serverIp,
          i_client_ip: clientIp,   i_client_id: clientId,
          i_product_id: productId,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const list = Array.isArray(data) ? data : data.data || [];
        setProductOptions(list.map((item) => ({
          label: item.PRODUCT_NAME || item.productName,
          value: item.PRODUCT_ID   || item.productId,
        })));
      }
    } catch (err) { /* silently fail */ }
  };

  useEffect(() => {
    getMappingList();
    fetchTenants();
    fetchProducts();
  }, []);

  // ── Validation ───────────────────────────────────────────────────────
  const isFormValid = () => {
    let valid = true;
    if (!form.tenantId)  { setTenantValidationTheme('selectFormError');  valid = false; }
    if (!form.productId) { setProductValidationTheme('selectFormError'); valid = false; }
    return valid;
  };

  // ── Submit ───────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!isFormValid()) return;
    setLoading(true);
    try {
      const isModify = displayModifyPage;
      const endpoint = isModify ? `${url}/tenant/mapping/modify` : `${url}/tenant/mapping/add`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          i_session_id:        sessionId,
          i_server_ip:         serverIp,
          i_client_ip:         clientIp,
          i_client_id:         clientId,
          i_product_id:        productId,
          i_mapping_id:        form.mappingId || undefined,
          i_tenant_id:         form.tenantId,
          i_mapped_product_id: form.productId,
        }),
      });
      if (response.ok) {
        showToast(isModify ? 'Mapping updated successfully' : 'Mapping created successfully', 'success');
        handleClose();
        getMappingList();
      } else {
        showToast('Operation failed. Please try again.', 'error');
      }
    } catch (err) {
      showToast('Unable to connect to server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────
  const confirmDelete = async (mappingRow) => {
    setLoading(true);
    try {
      const response = await fetch(`${url}/tenant/mapping/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          i_session_id: sessionId, i_server_ip: serverIp,
          i_client_ip: clientIp,   i_client_id: clientId,
          i_product_id: productId,
          i_mapping_id: mappingRow.mappingId || mappingRow.MAPPING_ID,
        }),
      });
      if (response.ok) {
        showToast('Mapping deleted successfully', 'success');
        getMappingList();
      } else {
        showToast('Delete failed. Please try again.', 'error');
      }
    } catch (err) {
      showToast('Unable to connect to server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Page navigation ──────────────────────────────────────────────────
  const handleAddClick = () => {
    resetForm();
    setDisplayAddPage(true);
    setDisplayModifyPage(false);
  };

  const handleModifyClick = (rowData) => {
    const raw = rowData._raw || rowData;
    const tid = raw.TENANT_ID          || raw.tenantId;
    const pid = raw.MAPPED_PRODUCT_ID  || raw.mappedProductId || raw.PRODUCT_ID || raw.productId;
    const mid = raw.MAPPING_ID         || raw.mappingId || '';

    setForm({ tenantId: tid, productId: pid, mappingId: mid });

    const tOpt = tenantOptions.find((o) => o.value === tid);
    const pOpt = productOptions.find((o) => o.value === pid);
    setTenantDefaultValue(tOpt || {});
    setProductDefaultValue(pOpt || {});

    setDisplayModifyPage(true);
    setDisplayAddPage(false);
  };

  const handleClose = () => {
    resetForm();
    setDisplayAddPage(false);
    setDisplayModifyPage(false);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setTenantDefaultValue({});
    setProductDefaultValue({});
    setTenantValidationTheme('selectForm');
    setProductValidationTheme('selectForm');
  };

  const onTenantChange = (option) => {
    setForm((prev) => ({ ...prev, tenantId: option.value }));
    setTenantDefaultValue(option);
    setTenantValidationTheme('selectForm');
  };

  const onProductChange = (option) => {
    setForm((prev) => ({ ...prev, productId: option.value }));
    setProductDefaultValue(option);
    setProductValidationTheme('selectForm');
  };

  const isModify = displayModifyPage;

  return (
    <>
      {loading && (<TssSpinner isLoading={loading} />)}
      {(displayAddPage || displayModifyPage) && (
        <TenantMappingAdd
          isModify={isModify}
          tenantOptions={tenantOptions}
          productOptions={productOptions}
          tenantDefaultValue={tenantDefaultValue}
          productDefaultValue={productDefaultValue}
          tenantValidationTheme={tenantValidationTheme}
          productValidationTheme={productValidationTheme}
          onTenantChange={onTenantChange}
          onProductChange={onProductChange}
          handleSubmit={handleSubmit}
          closeAddPage={handleClose}
        />
      )}
      <TenantMappingView
        mappingList={mappingList}
        LoadAddPage={handleAddClick}
        ShowModifyPage={handleModifyClick}
        GetMappingList={getMappingList}
        ShowDeleteModal={(row) => setMappingToDelete(row)}
        mappingToDelete={mappingToDelete}
        cancelDelete={() => setMappingToDelete(null)}
        confirmDelete={confirmDelete}
      />
    </>
  );
};

export default TenantMapping;
