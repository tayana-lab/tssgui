import {React} from 'react';
import TssTextBox from '@app/modules/common/default/components/TssTextBox';
import TssSelectBox from '@app/modules/common/default/components/TssSelectBox';
import TssButton from '@app/modules/common/default/components/TssButton';
import conf from '@modules/conf/TssGui.json'
import { useTranslation } from 'react-i18next';

const maxPwd= conf.MAX_PWD_LENGTH
const ResetPasswordView = ({  ShowResetPasswordDiv, ShowConfirmDiv, ShowConfirmPassword,
                              NewLoginId, LoginIdValidationTheme, LoginIdErrMsg,
                              NewPassword, NewPasswordValidationTheme, NewPasswordErrMsg,
                              NewConfirmPassword, ConfirmPasswordValidationTheme, ConfirmPasswordErrMsg,
                              NewAcctPassword, AcctPasswordValidationTheme, AcctPasswordErrMsg,
                              AccountList,ResetPassword,ModPermission
                           }) => {
   const [t]= useTranslation();
   const Accounts = AccountList.map(account => ({
      value: account.accountId,            
      label: account.accountName,
   }));    

   const newPasswordProp = {
      type : "password",
      maxLength : maxPwd,
      onChange : NewPassword
   }

   const confirmPasswordProp = {
      type : "password",
      maxLength : maxPwd,
      onChange : NewConfirmPassword
   }

   const acctPasswordProp = {
      type : "password",
      maxLength : maxPwd,
      onChange : NewAcctPassword
   }

   return(
   <>
	{ShowResetPasswordDiv &&( 
	   <div className="card">
         <div className="card-body align-items-center py-8"> 
	  	      <div className='row'>
	            <div className='form-group col-md-4'>
	  	            <TssSelectBox label={t('modules.ResetPassword.label.loginId')} onChange={NewLoginId} options={Accounts} validationTheme={LoginIdValidationTheme} tooltipMessage={LoginIdErrMsg} placeholder={t('modules.ResetPassword.placeholder.loginId')} mandatory={true}/>
	            </div>
               <div className='form-group col-md-4'>
                  <TssTextBox label={t('modules.ResetPassword.label.newPassword')} properties={newPasswordProp} validation={NewPasswordValidationTheme} tooltipMessage={NewPasswordErrMsg} placeholderName={t('modules.ResetPassword.placeholder.newPassword')} mandatory={true}/>                   
	            </div>
               <div className='form-group col-md-4'>
                  <TssTextBox label={t('modules.ResetPassword.label.confirmPassword')} properties={confirmPasswordProp} validation={ConfirmPasswordValidationTheme} tooltipMessage={ConfirmPasswordErrMsg} placeholderName={t('modules.ResetPassword.placeholder.confirmPassword')} mandatory={true}/>                   
	            </div>
	         </div>
	  	      <div className='row'>
         	  <div className='form-group col-md-12 d-flex justify-content-end tss-pull-right'>
                  <TssButton id="modifyButton" type="button" label={t('modules.Generic.buttons.label.modify')} onClick={ShowConfirmPassword}  isDisabled={!ModPermission}/>
               </div>
	        </div>
	    </div>
	 </div> 
	)}
   {ShowConfirmDiv && (
      <div className="card">
         <div className="card-body align-items-center py-8">
	  	      <div className='row'>
               <div className='form-group col-md-3'></div>
               <div className='form-group col-md-4'>
                  <TssTextBox label={t('modules.ResetPassword.label.acctPassword')} properties={acctPasswordProp} validation={AcctPasswordValidationTheme} tooltipMessage={AcctPasswordErrMsg} placeholderName={t('modules.ResetPassword.placeholder.acctPassword')} mandatory={true}/>
               </div>
               <div className="form-group col-md-2 pt-2">
                  <TssButton id="confirmButton" type="button" label={t('modules.Generic.buttons.label.confirm')} onClick={ResetPassword}/>
               </div>
            </div>
         </div>
      </div> 
   )}
   </>
)}
export default ResetPasswordView;
