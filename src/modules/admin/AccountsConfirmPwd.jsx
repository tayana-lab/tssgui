import React, {useState} from 'react'
import TssTextBox from '@app/modules/common/default/components/TssTextBox';
import TssButton from '@app/modules/common/default/components/TssButton';
import TssIcon from '@app/modules/common/default/components/TssIcon';
import { useTranslation } from 'react-i18next';


const AccountsConfirmPwd = ({ CreateAccount , ValidatePassword , validationTheme, tooltipMessage, ExitAdd }) => {

    const [t]= useTranslation();

    const passwordProp = {
        type : "password",
        onChange : ValidatePassword,
        maxLength : 20,
    }

    return (
    <>
        <section className="content">
            <div className="container-fluid">
                <div className="card">
                    <div className="card-body align-items-center py-8"> 
                        <div className='col-md-12 d-flex justify-content-end tss-pull-right'>
                            <TssIcon iconKey="tss_close" onClick={ExitAdd} title={t("modules.Generic.buttons.title.close")}/>
                        </div>                           
                        <div className='row'>
                            <div className='form-group col-md-3'></div>
                            <div className='form-group col-md-4'>
                                <TssTextBox  placeholderName={t("modules.Accounts.confirmPassword.placeholder.password")} validation={validationTheme} label={t("modules.Accounts.confirmPassword.label.password")} tooltipMessage={tooltipMessage} mandatory={true} properties={passwordProp} max={20}/>
                            </div>
                            <div className="form-group col-md-2 pt-2">
                                <TssButton  id="confirmButton" type="button" label={t("modules.Generic.buttons.label.confirm")}  onClick={CreateAccount}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default AccountsConfirmPwd
