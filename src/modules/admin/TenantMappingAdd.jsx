import React from 'react';
import TssSelectBox from '@app/modules/common/default/components/TssSelectBox';
import TssButton from '@app/modules/common/default/components/TssButton';
import { useTranslation } from 'react-i18next';

const TenantMappingAdd = ({
  isModify,
  tenantOptions,
  productOptions,
  tenantDefaultValue,
  productDefaultValue,
  tenantValidationTheme,
  productValidationTheme,
  onTenantChange,
  onProductChange,
  handleSubmit,
  closeAddPage,
}) => {
  const [t] = useTranslation();

  return (
    <section className="content">
      <div className="container-fluid">
        <div className="card">
          <div className="card-header tss-panel-header">
            {isModify ? 'Modify Mapping' : 'Create Mapping'}
          </div>
          <div className="card-body">

            <div className="row">
              <div align="left" className="form-group col-md-4">
                <TssSelectBox
                  label="Tenant"
                  mandatory={true}
                  options={tenantOptions}
                  defaultValue={tenantDefaultValue}
                  validationTheme={tenantValidationTheme}
                  onChange={onTenantChange}
                  disabled={isModify}
                />
              </div>
              <div align="left" className="form-group col-md-4">
                <TssSelectBox
                  label="Product"
                  mandatory={true}
                  options={productOptions}
                  defaultValue={productDefaultValue}
                  validationTheme={productValidationTheme}
                  onChange={onProductChange}
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

export default TenantMappingAdd;
