import React, { useState } from 'react';
import TssTextBox from '@app/modules/common/default/components/TssTextBox';
import TssSelectBox from '@app/modules/common/default/components/TssSelectBox';
import TssButton from '@app/modules/common/default/components/TssButton';
import TssInputGroup from '@app/modules/common/default/components/TssInputGroup';
import TssIcon from '@app/modules/common/default/components/TssIcon';
import TssTextArea from '@app/modules/common/default/components/TssTextArea';
import TssModal from '@app/modules/common/default/components/TssModal';
import { useTranslation } from 'react-i18next';

const statusOptions = [
  { label: 'Active',   value: 1 },
  { label: 'Inactive', value: 0 },
];

const initialDomainOptions = [
  { label: 'tayana.in',   value: 'tayana.in' },
  { label: 'airtel.in',   value: 'airtel.in' },
  { label: 'jio.com',     value: 'jio.com' },
  { label: 'bsnl.in',     value: 'bsnl.in' },
  { label: 'idea.in',     value: 'idea.in' },
  { label: 'vodafone.in', value: 'vodafone.in' },
];

const domainDefaultValue = { label: 'tayana.in', value: 'tayana.in' };

const initialSubDomainOptions = [
  { label: 'Select Sub Domain', value: '' },
  { label: 'portal', value: 'portal' },
  { label: 'www',    value: 'www' },
  { label: 'mail',   value: 'mail' },
  { label: 'api',    value: 'api' },
  { label: 'dev',    value: 'dev' },
  { label: 'stage',  value: 'stage' },
];

const subDomainDefaultValue = { label: 'Select Sub Domain', value: '' };

const TenantCreationAdd = ({
  isModify,
  form,
  statusDefaultValue,
  // validation themes & messages
  tenantNameTheme,  tenantNameErr,
  tenantCodeTheme,  tenantCodeErr,
  defaultCcTheme,   defaultCcErr,
  domainNameTheme,  domainNameErr,
  subDomainTheme,    subDomainErr,
  // change handlers
  validateTenantName,
  validateTenantCode,
  validateDefaultCc,
  validateDomainName,
  validateSubDomain,
  onFieldChange,
  onStatusChange,
  onDomainChange,
  onAddDomain,
  // actions
  handleSubmit,
  closeAddPage,
}) => {
  const [t] = useTranslation();
  const [domainOptions, setDomainOptions]   = useState(initialDomainOptions);
  const [newDomain,     setNewDomain]       = useState('');
  const [newDomainErr,  setNewDomainErr]    = useState('');
  const [selectedDomain, setSelectedDomain] = useState(
    isModify ? (initialDomainOptions.find(o => o.value === form.domainName) || domainDefaultValue) : domainDefaultValue
  );
  const [subDomainOptions,  setSubDomainOptions]  = useState(initialSubDomainOptions);
  const [newSubDomain,      setNewSubDomain]      = useState('');
  const [newSubDomainErr,   setNewSubDomainErr]   = useState('');
  const [selectedSubDomain, setSelectedSubDomain] = useState(
    isModify ? (initialSubDomainOptions.find(o => o.value === form.subDomain) || subDomainDefaultValue) : subDomainDefaultValue
  );

  const openAddDomainModal = () => {
    setNewDomain('');
    setNewDomainErr('');
    window.$ && window.$('#addDomainModal').modal('show');
  };

  const handleNewDomainChange = (e) => {
    const val = e.target.value;
    setNewDomain(val);
    if (!val.trim()) {
      setNewDomainErr('Domain name is required');
    } else if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val.trim())) {
      setNewDomainErr('Invalid domain format (e.g. example.com)');
    } else {
      setNewDomainErr('');
    }
  };

  const handleSaveDomain = () => {
    const val = newDomain.trim();
    if (!val) { setNewDomainErr('Domain name is required'); return; }
    if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val)) { setNewDomainErr('Invalid domain format (e.g. example.com)'); return; }
    if (domainOptions.some(o => o.value === val)) { setNewDomainErr('Domain already exists'); return; }

    const newOption = { label: val, value: val };
    setDomainOptions(prev => [...prev, newOption]);
    setSelectedDomain(newOption);
    onDomainChange && onDomainChange(newOption);
    window.$ && window.$('#addDomainModal').modal('hide');
  };

  const openAddSubDomainModal = () => {
    setNewSubDomain('');
    setNewSubDomainErr('');
    window.$ && window.$('#addSubDomainModal').modal('show');
  };

  const handleNewSubDomainChange = (e) => {
    const val = e.target.value;
    setNewSubDomain(val);
    if (!val.trim()) {
      setNewSubDomainErr('Sub-domain is required');
    } else if (!/^[a-zA-Z0-9-]+$/.test(val.trim())) {
      setNewSubDomainErr('Invalid format (e.g. www, mail, api)');
    } else {
      setNewSubDomainErr('');
    }
  };

  const handleSaveSubDomain = () => {
    const val = newSubDomain.trim();
    if (!val) { setNewSubDomainErr('Sub-domain is required'); return; }
    if (!/^[a-zA-Z0-9-]+$/.test(val)) { setNewSubDomainErr('Invalid format (e.g. www, mail, api)'); return; }
    if (subDomainOptions.some(o => o.value === val)) { setNewSubDomainErr('Sub-domain already exists'); return; }

    const newOption = { label: val, value: val };
    setSubDomainOptions(prev => [...prev, newOption]);
    setSelectedSubDomain(newOption);
    onFieldChange && onFieldChange('subDomain', val);
    window.$ && window.$('#addSubDomainModal').modal('hide');
  };

  return (
    <section className="content">
      <div className="container-fluid">
        <div className="card">
          <div className="card-body">

            <div className="row">
              <div align="left" className="form-group col-md-4">
                <TssTextBox
                  label="Tenant Name"
                  placeholderName="Enter Tenant Name"
                  mandatory={true}
                  name="tenantName"
                  properties={{ value: form.tenantName, maxLength: 100, onChange: validateTenantName }}
                  tooltipMessage={tenantNameErr}
                  validation={tenantNameTheme}
                />
              </div>
              <div align="left" className="form-group col-md-4">
                <TssTextBox
                  label="Tenant Code"
                  placeholderName="Enter Tenant Code"
                  mandatory={true}
                  name="tenantCode"
                  properties={{ value: form.tenantCode, maxLength: 100, onChange: validateTenantCode }}
                  tooltipMessage={tenantCodeErr}
                  validation={tenantCodeTheme}
                />
              </div>
              <div align="left" className="form-group col-md-4">
                <TssTextBox
                  label="Country Code"
                  placeholderName="Enter Country Code"
                  mandatory={true}
                  name="defaultCc"
                  properties={{ value: form.defaultCc, maxLength: 5, onChange: validateDefaultCc }}
                  tooltipMessage={defaultCcErr}
                  validation={defaultCcTheme}
                />
              </div>
            </div>

            <div className="row">
              <div align="left" className="form-group col-md-4">
                <TssInputGroup
                  inputElement={[
                    <TssSelectBox
                      label="Predefined Domain"
                      mandatory={true}
                      options={domainOptions}
                      defaultValue={selectedDomain}
                      onChange={(option) => { setSelectedDomain(option); onDomainChange && onDomainChange(option); }}
                    />
                  ]}
                  appendElements={[
                    <TssIcon iconKey="tss_add" className="tss-primary-icon" title="Add Domain" onClick={openAddDomainModal} />
                  ]}
                />
              </div>
              <div align="left" className="form-group col-md-4">
                <TssInputGroup
                  inputElement={[
                    <TssSelectBox
                      label="Sub Domain"
                      options={subDomainOptions}
                      defaultValue={selectedSubDomain}
                      onChange={(option) => { setSelectedSubDomain(option); onFieldChange && onFieldChange('subDomain', option.value); }}
                    />
                  ]}
                  appendElements={[
                    <TssIcon iconKey="tss_add" className="tss-primary-icon" title="Add Sub Domain" onClick={openAddSubDomainModal} />
                  ]}
                />
              </div>
              <div align="left" className="form-group col-md-4">
                <TssSelectBox
                  label="Status"
                  mandatory={true}
                  options={statusOptions}
                  defaultValue={statusDefaultValue}
                  onChange={(option) => onStatusChange(option)}
                />
              </div>
            </div>

            <div className="row">
              <div align="left" className="form-group col-md-12">
                <TssTextArea
                  label="Description"
                  placeholder="Enter Description"
                  value={form.description}
                  onChange={(e) => onFieldChange('description', e.target.value)}
                  rows={3}
                  properties={{ maxLength: 255 }}
                />
              </div>
            </div>

            <div className="row mt-3">
              <div className="form-group col-md-12 d-flex justify-content-end tss-pull-right">
                <TssButton label={isModify ? 'Update' : 'Submit'} onClick={handleSubmit} />
                <TssButton label="Close" onClick={closeAddPage} />
              </div>
            </div>

          </div>
        </div>
      </div>

      <TssModal
        modalId="addDomainModal"
        modalBodyId="addDomainModalBody"
        modalHeaderId="addDomainModalHeader"
        header="Add New Domain"
        className="modal-sm"
        footer={
          <>
            <TssButton label="Save" onClick={handleSaveDomain} />
            <TssButton label="Cancel" onClick={() => window.$ && window.$('#addDomainModal').modal('hide')} />
          </>
        }
      >
        <TssTextBox
          label="Domain Name"
          placeholderName="e.g. example.com"
          mandatory={true}
          name="newDomain"
          properties={{ value: newDomain, maxLength: 100, onChange: handleNewDomainChange }}
          tooltipMessage={newDomainErr}
          validation={newDomainErr ? 'formError' : (newDomain ? 'formSuccess' : 'form')}
        />
      </TssModal>

      <TssModal
        modalId="addSubDomainModal"
        modalBodyId="addSubDomainModalBody"
        modalHeaderId="addSubDomainModalHeader"
        header="Add New Sub Domain"
        className="modal-sm"
        footer={
          <>
            <TssButton label="Save" onClick={handleSaveSubDomain} />
            <TssButton label="Cancel" onClick={() => window.$ && window.$('#addSubDomainModal').modal('hide')} />
          </>
        }
      >
        <TssTextBox
          label="Sub Domain"
          placeholderName="e.g. www, mail, api"
          mandatory={true}
          name="newSubDomain"
          properties={{ value: newSubDomain, maxLength: 100, onChange: handleNewSubDomainChange }}
          tooltipMessage={newSubDomainErr}
          validation={newSubDomainErr ? 'formError' : (newSubDomain ? 'formSuccess' : 'form')}
        />
      </TssModal>

    </section>
  );
};

export default TenantCreationAdd;
