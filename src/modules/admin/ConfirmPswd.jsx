import React, { useState } from 'react'
import TssTextBox from '@modules/common/default/components/TssTextBox';
import TssButton from '@modules/common/default/components/TssButton';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const ConfirmPswd = ({ LoadCreateAccountType, SetPswdInputVal, validationTheme, tooltipMessage }) => {

  const [t] = useTranslation();

  const passwordProp = {
    type : "password",
    onChange : SetPswdInputVal,
    maxLength : 20,
  };

  return (
    <section className="content">
      <div className="container-fluid">
        <div className="card">
          <div className="card-body align-items-center py-8">
            <div className='row'>
              <div className='form-group col-md-3'></div>
              <div className='form-group col-md-4'>
                <TssTextBox  placeholderName={t("modules.AccountType.cfrmPswdPage.placeholder.password")} label={t("modules.AccountType.cfrmPswdPage.label.password")}  mandatory="true" validation={validationTheme} properties={passwordProp} tooltipMessage={tooltipMessage}/>
              </div>
              <div className="form-group col-md-2 pt-2">
                <TssButton  id="confirmButton" type="button" label={t("modules.Generic.buttons.label.confirm")}  onClick={LoadCreateAccountType}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ConfirmPswd
