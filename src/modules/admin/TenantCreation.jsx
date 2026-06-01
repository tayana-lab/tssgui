import React, { useState, useEffect } from 'react';
import TssSpinner from '@app/modules/common/default/components/TssSpinner';
import { showToast } from '@app/modules/common/default/components/TssFunction';
import { useTranslation } from 'react-i18next';
import tssguiConf from '@app/modules/conf/TssGui.json';
import TenantCreationView from '@app/modules/admin/TenantCreationView';
import TenantCreationAdd from '@app/modules/admin/TenantCreationAdd';

const url = tssguiConf.SERVER_JS_API_URI;

const emptyForm = {
  tenantId: '',
  tenantName: '',
  tenantCode: '',
  description: '',
  domainName: '',
  subDomain: '',
  defaultCc: '',
  status: 1,
};

const TenantCreation = () => {
  const [t] = useTranslation();
  const [loading, setLoading]                         = useState(false);
  const [tenantList, setTenantList]                   = useState([]);
  const [displayAddPage, setDisplayAddPage]           = useState(false);
  const [displayModifyPage, setDisplayModifyPage]     = useState(false);
  const [form, setForm]                               = useState(emptyForm);
  const [statusDefaultValue, setStatusDefaultValue]   = useState({ label: 'Active', value: 1 });
  const [tenantToDelete, setTenantToDelete]           = useState(null);

  // ── Validation states ────────────────────────────────────────────────
  const [tenantNameErr,   setTenantNameErr]   = useState('');
  const [tenantNameTheme, setTenantNameTheme] = useState('form');
  const [tenantCodeErr,   setTenantCodeErr]   = useState('');
  const [tenantCodeTheme, setTenantCodeTheme] = useState('form');
  const [defaultCcErr,    setDefaultCcErr]    = useState('');
  const [defaultCcTheme,  setDefaultCcTheme]  = useState('form');
  const [domainNameErr,   setDomainNameErr]   = useState('');
  const [domainNameTheme, setDomainNameTheme] = useState('form');
  const [subDomainErr,    setSubDomainErr]    = useState('');
  const [subDomainTheme,  setSubDomainTheme]  = useState('form');

  const sessionId = localStorage.getItem('sessionID');
  const serverIp  = localStorage.getItem('serverIP');
  const clientIp  = localStorage.getItem('clientIP');
  const clientId  = localStorage.getItem('acctID');
  const productId = tssguiConf.PRODUCT_ID;

  const dummyTenantList = [
    { TENANT_ID: 100, TENANT_NAME: 'Airtel India',  TENANT_CODE: 'airtel_in', DOMAIN_NAME: 'airtel.in',  SUB_DOMAIN: 'iot',     DEFAULT_CC: 'IN', STATUS: 1 },
    { TENANT_ID: 200, TENANT_NAME: 'Jio',           TENANT_CODE: 'jio_in',    DOMAIN_NAME: 'jio.com',    SUB_DOMAIN: 'portal',  DEFAULT_CC: 'IN', STATUS: 1 },
    { TENANT_ID: 300, TENANT_NAME: 'Vodafone Idea', TENANT_CODE: 'vi_in',     DOMAIN_NAME: 'myvi.in',                           DEFAULT_CC: 'IN', STATUS: 1 },
    { TENANT_ID: 400, TENANT_NAME: 'BSNL',          TENANT_CODE: 'bsnl_in',   DOMAIN_NAME: 'bsnl.co.in',                        DEFAULT_CC: 'IN', STATUS: 1 },
    { TENANT_ID: 500, TENANT_NAME: 'Test Operator', TENANT_CODE: 'test01',    DOMAIN_NAME: 'test.local', SUB_DOMAIN: 'dev',     DEFAULT_CC: 'IN', STATUS: 1 },
    { TENANT_ID: 600, TENANT_NAME: 'Demo Tenant',   TENANT_CODE: 'demo',      DOMAIN_NAME: 'demo.local',                        DEFAULT_CC: 'IN', STATUS: 1 },
  ];

  const getTenantList = () => {
    setTenantList(dummyTenantList);
  };

  useEffect(() => { getTenantList(); }, []);

  // ── Validation ───────────────────────────────────────────────────────
  const validateTenantName = (e) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, tenantName: val }));
    if (!val.trim()) { setTenantNameErr('Tenant Name is required'); setTenantNameTheme('formError'); }
    else             { setTenantNameErr('');                         setTenantNameTheme('formSuccess'); }
  };

  const validateTenantCode = (e) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, tenantCode: val }));
    if (!val.trim()) { setTenantCodeErr('Tenant Code is required'); setTenantCodeTheme('formError'); }
    else             { setTenantCodeErr('');                        setTenantCodeTheme('formSuccess'); }
  };

  const validateDefaultCc = (e) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, defaultCc: val }));
    if (!val.trim()) { setDefaultCcErr('Default Country Code is required'); setDefaultCcTheme('formError'); }
    else             { setDefaultCcErr('');                                  setDefaultCcTheme('formSuccess'); }
  };

  const validateDomainName = (e) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, domainName: val }));
    if (val && !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val)) {
      setDomainNameErr('Invalid domain name format'); setDomainNameTheme('formError');
    } else {
      setDomainNameErr(''); setDomainNameTheme(val ? 'formSuccess' : 'form');
    }
  };

  const validateSubDomain = (e) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, subDomain: val }));
    if (val && !/^[a-zA-Z0-9-]+$/.test(val)) {
      setSubDomainErr('Invalid sub domain format'); setSubDomainTheme('formError');
    } else {
      setSubDomainErr(''); setSubDomainTheme(val ? 'formSuccess' : 'form');
    }
  };

  const onFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onStatusChange = (option) => {
    setForm((prev) => ({ ...prev, status: option.value }));
    setStatusDefaultValue(option);
  };

  const isFormValid = () => {
    let valid = true;
    if (!form.tenantName.trim()) { setTenantNameErr('Tenant Name is required'); setTenantNameTheme('formError'); valid = false; }
    if (!form.tenantCode.trim()) { setTenantCodeErr('Tenant Code is required'); setTenantCodeTheme('formError'); valid = false; }
    if (!form.defaultCc.trim())  { setDefaultCcErr('Default Country Code is required'); setDefaultCcTheme('formError'); valid = false; }
    return valid;
  };

  // ── Submit ───────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!isFormValid()) return;
    showToast('success', displayModifyPage ? 'Tenant updated successfully' : 'Tenant created successfully');
    handleClose();
  };

  // ── Delete ───────────────────────────────────────────────────────────
  const confirmDelete = () => {
    showToast('success', 'Tenant deleted successfully');
    setTenantToDelete(null);
  };

  // ── Page navigation ──────────────────────────────────────────────────
  const handleAddClick = () => {
    resetForm();
    setDisplayAddPage(true);
    setDisplayModifyPage(false);
  };

  const handleModifyClick = (rowData) => {
    const raw = rowData._raw || rowData;
    setForm({
      tenantId:        raw.TENANT_ID          || raw.tenantId        || '',
      tenantName:      raw.TENANT_NAME        || raw.tenantName      || '',
      tenantCode:      raw.TENANT_CODE        || raw.tenantCode      || '',
      description:     raw.DESCRIPTION        || raw.description     || '',

      domainName:      raw.DOMAIN_NAME        || raw.domainName      || '',
      subDomain:       raw.SUB_DOMAIN         || raw.subDomain       || '',
      defaultCc:       raw.DEFAULT_CC         || raw.defaultCc       || '',

      status:          raw.STATUS             ?? raw.status          ?? 1,
    });
    const statusMap = { 1: 'Active', 0: 'Inactive' };
    const st = raw.STATUS ?? raw.status ?? 1;
    setStatusDefaultValue({ label: statusMap[st] || 'Active', value: st });
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
    setTenantNameErr('');  setTenantNameTheme('form');
    setTenantCodeErr('');  setTenantCodeTheme('form');
    setDefaultCcErr('');   setDefaultCcTheme('form');
    setDomainNameErr('');  setDomainNameTheme('form');
    setSubDomainErr('');   setSubDomainTheme('form');
  };

  const isModify = displayModifyPage;

  const addProps = {
    isModify,
    form,
    statusDefaultValue,
    tenantNameTheme,  tenantNameErr,
    tenantCodeTheme,  tenantCodeErr,
    defaultCcTheme,   defaultCcErr,
    domainNameTheme,  domainNameErr,
    subDomainTheme,   subDomainErr,
    validateTenantName,
    validateTenantCode,
    validateDefaultCc,
    validateDomainName,
    validateSubDomain,
    onFieldChange,
    onStatusChange,
    onDomainChange: (option) => setForm((prev) => ({ ...prev, domainName: option.value })),
    handleSubmit,
    closeAddPage: handleClose,
  };

  return (
    <>
      {loading && (<TssSpinner isLoading={loading} />)}
      {(displayAddPage || displayModifyPage) && (
        <TenantCreationAdd {...addProps} />
      )}
      <TenantCreationView
        tenantList={tenantList}
        LoadAddPage={handleAddClick}
        ShowModifyPage={handleModifyClick}
        GetTenantList={getTenantList}
        ShowDeleteModal={(row) => setTenantToDelete(row)}
        tenantToDelete={tenantToDelete}
        cancelDelete={() => setTenantToDelete(null)}
        confirmDelete={confirmDelete}
      />
    </>
  );
};

export default TenantCreation;
