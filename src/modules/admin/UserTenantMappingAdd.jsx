import React from 'react';
import TssSelectBox from '@app/modules/common/default/components/TssSelectBox';
import TssMultiSelectBox from '@app/modules/common/default/components/TssMultiSelectBox';
import TssButton from '@app/modules/common/default/components/TssButton';
import { useTranslation } from 'react-i18next';

const statusOptions = [
  { label: 'Active',   value: 1 },
  { label: 'Inactive', value: 0 },
];

const UserTenantMappingAdd = ({
  isModify,
  userOptions,
  tenantOptions,
  userDefaultValue,
  tenantDefaultValue,
  statusDefaultValue,
  userValidationTheme,
  tenantValidationTheme,
  onUserChange,
  onTenantChange,
  onStatusChange,
  handleSubmit,
  closeAddPage,
}) => {
  const [t] = useTranslation();

  return (
    <section className="content">
      <div className="container-fluid">
        <div className="card">
          <div className="card-body">

            <div className="row">
              <div align="left" className="form-group col-md-4">
                <TssSelectBox
                  label="Account"
                  mandatory={true}
                  options={userOptions}
                  defaultValue={userDefaultValue}
                  validationTheme={userValidationTheme}
                  onChange={onUserChange}
                  disabled={isModify}
                />
              </div>
              <div align="left" className="form-group col-md-4">
                <TssMultiSelectBox
                  label="Tenant"
                  mandatory={true}
                  options={tenantOptions}
                  defaultValue={tenantDefaultValue}
                  validationTheme={tenantValidationTheme}
                  onSelect={onTenantChange}
                  isSeachable={true}
                  selectAllOption={true}
                  disabled={isModify}
                />
              </div>
              <div align="left" className="form-group col-md-4">
                <TssSelectBox
                  label="Status"
                  mandatory={true}
                  options={statusOptions}
                  defaultValue={statusDefaultValue}
                  onChange={onStatusChange}
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
    </section>
  );
};

export default UserTenantMappingAdd;
