import React, { useState, useEffect } from 'react';
import TssSpinner from '@app/modules/common/default/components/TssSpinner';
import { showToast } from '@app/modules/common/default/components/TssFunction';
import { useTranslation } from 'react-i18next';
import tssguiConf from '@app/modules/conf/TssGui.json';
import UserTenantMappingView from '@app/modules/admin/UserTenantMappingView';
import UserTenantMappingAdd from '@app/modules/admin/UserTenantMappingAdd';

const url = tssguiConf.SERVER_JS_API_URI;

const emptyForm = { userId: '', tenantIds: [], status: 1 };

const UserTenantMapping = () => {
  const [t] = useTranslation();
  const [loading, setLoading]                         = useState(false);
  const [mappingList, setMappingList]                 = useState([]);
  const [displayAddPage, setDisplayAddPage]           = useState(false);
  const [displayModifyPage, setDisplayModifyPage]     = useState(false);
  const [form, setForm]                               = useState(emptyForm);
  const [mappingToDelete, setMappingToDelete]         = useState(null);

  const [userOptions, setUserOptions]                 = useState([]);
  const [tenantOptions, setTenantOptions]             = useState([]);
  const [statusDefaultValue, setStatusDefaultValue]   = useState({ label: 'Active', value: 1 });
  const [userValidationTheme, setUserValidationTheme]     = useState('selectForm');
  const [tenantValidationTheme, setTenantValidationTheme] = useState('selectForm');
  const [formKey, setFormKey]                             = useState(0);

  const sessionId = localStorage.getItem('sessionID');
  const serverIp  = localStorage.getItem('serverIP');
  const clientIp  = localStorage.getItem('clientIP');
  const clientId  = localStorage.getItem('acctID');
  const productId = tssguiConf.PRODUCT_ID;

  const basePayload = () => ({
    i_session_id: sessionId,
    i_server_ip:  serverIp,
    i_client_ip:  clientIp,
    i_client_id:  clientId,
    i_product_id: productId,
  });

  const dummyMappingList = [
    { USER_ID: 1001, USER_NAME: 'john',  TENANTS: [{ TENANT_ID: 100, TENANT_NAME: 'Airtel India',  TENANT_CODE: 'airtel_in' }, { TENANT_ID: 200, TENANT_NAME: 'Jio', TENANT_CODE: 'jio_in' }], STATUS: 1 },
    { USER_ID: 1002, USER_NAME: 'jane',  TENANTS: [{ TENANT_ID: 200, TENANT_NAME: 'Jio',           TENANT_CODE: 'jio_in'    }, { TENANT_ID: 300, TENANT_NAME: 'Vodafone Idea', TENANT_CODE: 'vi_in' }], STATUS: 1 },
    { USER_ID: 1003, USER_NAME: 'bob',   TENANTS: [{ TENANT_ID: 300, TENANT_NAME: 'Vodafone Idea', TENANT_CODE: 'vi_in'     }], STATUS: 0 },
    { USER_ID: 1004, USER_NAME: 'alice', TENANTS: [{ TENANT_ID: 400, TENANT_NAME: 'BSNL',          TENANT_CODE: 'bsnl_in'   }, { TENANT_ID: 500, TENANT_NAME: 'Test Operator', TENANT_CODE: 'test01' }, { TENANT_ID: 600, TENANT_NAME: 'Demo Tenant', TENANT_CODE: 'demo' }], STATUS: 1 },
    { USER_ID: 1005, USER_NAME: 'raj',   TENANTS: [{ TENANT_ID: 100, TENANT_NAME: 'Airtel India',  TENANT_CODE: 'airtel_in' }], STATUS: 1 },
  ];

  const dummyUserOptions = [
    { label: 'john',  value: 1001 },
    { label: 'jane',  value: 1002 },
    { label: 'bob',   value: 1003 },
    { label: 'alice', value: 1004 },
    { label: 'raj',   value: 1005 },
  ];

  const dummyTenantOptions = [
    { label: 'Airtel India',  value: 100 },
    { label: 'Jio',           value: 200 },
    { label: 'Vodafone Idea', value: 300 },
    { label: 'BSNL',          value: 400 },
    { label: 'Test Operator', value: 500 },
    { label: 'Demo Tenant',   value: 600 },
  ];

  const getMappingList = () => {
    setMappingList(dummyMappingList);
  };

  useEffect(() => {
    getMappingList();
    setUserOptions(dummyUserOptions);
    setTenantOptions(dummyTenantOptions);
  }, []);

  // ── Validation ───────────────────────────────────────────────────────
  const isFormValid = () => {
    let valid = true;
    if (!form.userId)                  { setUserValidationTheme('selectFormError');   valid = false; }
    if (!form.tenantIds || form.tenantIds.length === 0) { setTenantValidationTheme('selectFormError'); valid = false; }
    return valid;
  };

  // ── Submit ───────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!isFormValid()) return;
    showToast('success', displayModifyPage ? 'Mapping updated successfully' : 'Mapping created successfully');
    handleClose();
  };

  // ── Delete ───────────────────────────────────────────────────────────
  const confirmDelete = () => {
    showToast('success', 'Mapping deleted successfully');
    setMappingToDelete(null);
  };

  // ── Page navigation ──────────────────────────────────────────────────
  const handleAddClick = () => {
    resetForm();
    setFormKey((k) => k + 1);
    setDisplayAddPage(true);
    setDisplayModifyPage(false);
  };

  const handleModifyClick = (rowData) => {
    const raw = rowData._raw || rowData;
    const uid     = raw.USER_ID  || raw.userId;
    const tenants = raw.TENANTS  || raw.tenants || [];
    const tids    = tenants.map((t) => t.TENANT_ID || t.tenantId);
    const sts     = raw.STATUS   ?? raw.status ?? 1;

    setForm({ userId: uid, tenantIds: tids, status: sts });
    setStatusDefaultValue(sts === 1 ? { label: 'Active', value: 1 } : { label: 'Inactive', value: 0 });

    setFormKey((k) => k + 1);
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
    setStatusDefaultValue({ label: 'Active', value: 1 });
    setUserValidationTheme('selectForm');
    setTenantValidationTheme('selectForm');
  };

  const onUserChange = (option) => {
    setForm((prev) => ({ ...prev, userId: option.value }));
    setUserValidationTheme('selectForm');
  };

  const onTenantChange = (selectedValues) => {
    // TssMultiSelectBox returns array of selected values
    setForm((prev) => ({ ...prev, tenantIds: selectedValues }));
    if (selectedValues.length > 0) setTenantValidationTheme('selectForm');
  };

  const onStatusChange = (option) => {
    setForm((prev) => ({ ...prev, status: option.value }));
    setStatusDefaultValue(option);
  };

  const userDefaultValue  = userOptions.find((o) => o.value === form.userId) || {};
  const tenantDefaultValue = tenantOptions.filter((o) => form.tenantIds.includes(o.value));

  return (
    <>
      {loading && (<TssSpinner isLoading={loading} />)}
      {(displayAddPage || displayModifyPage) && (
        <UserTenantMappingAdd
          key={formKey}
          isModify={displayModifyPage}
          userOptions={userOptions}
          tenantOptions={tenantOptions}
          userDefaultValue={userDefaultValue}
          tenantDefaultValue={tenantDefaultValue}
          statusDefaultValue={statusDefaultValue}
          userValidationTheme={userValidationTheme}
          tenantValidationTheme={tenantValidationTheme}
          onUserChange={onUserChange}
          onTenantChange={onTenantChange}
          onStatusChange={onStatusChange}
          handleSubmit={handleSubmit}
          closeAddPage={handleClose}
        />
      )}
      <UserTenantMappingView
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

export default UserTenantMapping;
