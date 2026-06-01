import React, { useEffect } from 'react'
import TssDataTable from '@modules/common/default/components/TssDataTable';
import TssButton from '@app/modules/common/default/components/TssButton';
import TssModal from '@app/modules/common/default/components/TssModal';
import TssTextBox from '@app/modules/common/default/components/TssTextBox';
import TssSelectBox from '@app/modules/common/default/components/TssSelectBox';
import TssInputGroup from '@app/modules/common/default/components/TssInputGroup';
import TssDatePicker from '@modules/common/default/components/TssDatePicker';
import TssTable from '@app/modules/common/default/components/TssTableComponent'
import conf from '@app/modules/conf/TssGui.json';
import { useTranslation } from 'react-i18next';


const ldapSupport = conf.LDAP_SUPPORT        
const cc= conf.COUNTRY_CODE                       
const msidnLen= conf.MSISDN_LEN                   
const dateFormat = conf.DATE_FORMAT
const minActNameLen= conf.MIN_ACNT_NAME_LENGTH

const AccountsModify = ({EmployeeId, EmployeeIdErrMsg, EmployeeIdValidationTheme ,
                        NewExpiryDate,
                        AccountStatusObject, NewStatus,
                        Name, NameErrMsg, NameValidationTheme,
                        Designation, DesignationErrMsg, DesignationValidationTheme,
                        Department, DepartmentErrMsg, DepartmentValidationTheme,
                        MailId,MailIdErrMsg, MailIdValidationTheme,
                        Mobile,MobileErrMsg, MobileValidationTheme,
                        Language, NewLanguage,
                        LdapUser,NoAccessOption,Level,LevelOfLoggedInUser,
                        AccountTypeChange,ProductAccountTypes,
                        AccountDetails,ProductsList, AccountTypesList,ShowPreviewModal,OpenModal,LanguagesList,
                        ModifyAccount, CloseModifyPage,ResetAccountDetails,OK,Permission
                    }) => {
    const [t]= useTranslation();
    const {
        mAccountId,
        mLoginId,
        mEmployeeId,
        mAccountExpiry,
        mAccountStatus,
        mName,
        mDesignation,
        mDepartment,
        mMailId,
        mMobile,
        mLanguageVal,
        mLDAPUser,
        
    } = AccountDetails;


    const accStatusConf = conf.ACCOUNT_STATUS; 
    const options = Object.entries(accStatusConf).map(([value, label]) => ({
        value,
        label
    }));
    AccountStatusObject = options.find(option => option.value === String(mAccountStatus));
    
    
   /*onst accountTypes = AccountTypesList.flatMap(product =>
        product.accessTypeDetails.map(accountType => ({
            value: accountType.accessTypeId,
            label: accountType.accessTypeName,
            productId: product.productId
        }))
    );*/
   


   const accountTypes = AccountTypesList.flatMap( product =>
	   product.accessTypeDetails
    .filter(accessType => accessType.accessTypeId == 100001)
    .map(accessType => ({
            value: accessType.accessTypeId,
            label: accessType.accessTypeName,
            productId: product.productId
        }))
    );
    const languages = LanguagesList.map(language => ({
        value: language.languageId,            
        label: language.languageName
    }));
    Language = languages.find(language => language.value === parseInt(mLanguageVal,10));

    const previewDisable = ((Permission & 2) !=2 ) || (mAccountId == localStorage.getItem("acctID")) || (Level <= LevelOfLoggedInUser)
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const employeeIdProp = {
        type :'text',
        maxLength : 50,
        onChange : EmployeeId  ,
        value : mEmployeeId
    }
    const nameProp = {
        type :'text',
        maxLength : 50,
        onChange : Name ,
        value : mName     
    }
    const designationProp = {
        type :'text',
        maxLength : 50,
        onChange : Designation ,  
        value : mDesignation  
    }
    const departmentProp = {
        type :'text',
        maxLength : 50,
        onChange : Department,
        value : mDepartment   
    }
    const mailIdProp = {
        type :'text',
        maxLength : 100,
        onChange : MailId,
        value : mMailId      
    }
    const mobileProp = {
        maxLength : msidnLen,
        onChange : Mobile,
        value : mMobile
    }

     /////////////////////////////////////////////////////////////   
     const tableContent = ProductsList.map(product => ({
        product: product.productName,
        accountType: (
            <TssSelectBox 
                label={t("modules.Accounts.accountAddAndModify.label.accountType")}
                mandatory={true}  
                defaultValue={ProductAccountTypes[product.productId]} 
                options={accountTypes.filter(accountType => accountType.productId == product.productId)} 
                onChange={event => AccountTypeChange(product.productId, event)}
            />
        )
    }));

    const tableContentInModal = ProductsList.map(product => ({
        product: product.productName,
        accountType: ProductAccountTypes[product.productId]?.label ? ProductAccountTypes[product.productId]?.label : t("modules.Accounts.accountAddAndModify.label.noAccessOption")
    }));
        
    const tableHeadings =  [
        { field: 'product', header: t("modules.Accounts.accountAddAndModify.tssDataTable.header.product") , fixed:true , sortable:false, filter:false},
        { field: 'accountType', header: t("modules.Accounts.accountAddAndModify.tssDataTable.header.accountType"), sortable:false, filter:false},   
    ];

    //////////////////////////////////////////////////////////////

    const previewProp = OpenModal 
    ? {
        "data-target": "#accountModifyPreviewModal",
        "data-toggle": "modal"
    }: {};

     /////////////////////////////////////////////////////////////
    const closeProp = {
        "data-target": "#accountModifyPreviewModal",
        "data-dismiss": "modal",
    };

    //////////////////////////////////////////////////////////////
  
    const checkBox =[
        <input type="checkbox" onChange={LdapUser} checked={mLDAPUser}/>
    ]
    const button = [
       <button id="previewButton" className="tss-inputGroupButton mt-2 tss-ldap-button" type="button" label="LDAP USER"  >{t("modules.Accounts.accountAddAndModify.label.ldapUser")}</button>
    ] 
    
    const countryCode =[
        <input type="text" value={`+${cc}`}/>
    ]
    const mobileInput = [
        <TssTextBox  placeholderName={t("modules.Accounts.accountAddAndModify.placeholder.mobile")} validation={MobileValidationTheme}  tooltipMessage={MobileErrMsg} label={t("modules.Accounts.accountAddAndModify.label.mobile")} mandatory={true} properties={mobileProp} />
    ]


  return (
    <>
    
        <section className="content">
            <div className="container-fluid">

                <div className="card">
                    <div className="card-body align-items-center py-8">

                        <div className='row'>
                            <div className='form-group col-md-4' >
                                <TssTextBox  placeholderName={t("modules.Accounts.accountAddAndModify.placeholder.employeeId")} validation={EmployeeIdValidationTheme} tooltipMessage={EmployeeIdErrMsg} label={t("modules.Accounts.accountAddAndModify.label.employeeId")}  mandatory={true} properties={employeeIdProp} />
                            </div>
                            <div className='form-group col-md-4' >
                                <TssDatePicker label={t("modules.Accounts.accountAddAndModify.label.accountExpiry")} defaultValue={mAccountExpiry} dateFormat={dateFormat} onChange={NewExpiryDate}  minDaysFromToday={0}/> 
                            </div>     
                            <div className='form-group col-md-4'>
                                <TssSelectBox label={t("modules.Accounts.accountAddAndModify.label.accountStatus")} mandatory={false} options={options}  defaultValue={AccountStatusObject}  onChange={NewStatus}/> 
                            </div>
                        </div>

                        <div className='row'>
                            <div className='form-group col-md-4'>
                                <TssTextBox  placeholderName={t("modules.Accounts.accountAddAndModify.placeholder.name")} validation={NameValidationTheme}  tooltipMessage={NameErrMsg} label={t("modules.Accounts.accountAddAndModify.label.name")} mandatory={false} properties={nameProp} inputInfo={t("modules.Accounts.accountAddAndModify.inputInfo.name",{minChar: minActNameLen})}/>
                            </div>
                            <div className='form-group col-md-4'>
                                <TssTextBox  placeholderName={t("modules.Accounts.accountAddAndModify.placeholder.designation")} validation={DesignationValidationTheme}  tooltipMessage={DesignationErrMsg} label={t("modules.Accounts.accountAddAndModify.label.designation")} mandatory={false} properties={designationProp} />
                            </div>
                            <div className='form-group col-md-4'>
                                <TssTextBox  placeholderName={t("modules.Accounts.accountAddAndModify.placeholder.department")} validation={DepartmentValidationTheme} tooltipMessage={DepartmentErrMsg} label={t("modules.Accounts.accountAddAndModify.label.department")} mandatory={false} properties={departmentProp}  />
                            </div>
                        </div>

                        <div className='row'>
                            <div className='form-group col-md-4'>
                                <TssTextBox  placeholderName={t("modules.Accounts.accountAddAndModify.placeholder.mailId")} validation={MailIdValidationTheme} tooltipMessage={MailIdErrMsg}  label={t("modules.Accounts.accountAddAndModify.label.mailId")} mandatory={true} properties={mailIdProp} />
                            </div>
                            <div className='form-group col-md-4' style={{marginLeft:"-3px"}}>
                                <TssInputGroup  mandatory={false} prependElements={countryCode} inputElement={mobileInput}/>     
                            </div>
                            <div className='form-group col-md-4'>
                                <TssSelectBox label={t("modules.Accounts.accountAddAndModify.label.preferredLanguage")} mandatory={false} options={languages} defaultValue={Language} onChange={NewLanguage}/>
                            </div>
                        </div>
                        {ldapSupport == 1 && (
                        <div className='row'>    
                            <div className='form-group col-md-4'>
                                <TssInputGroup  mandatory={false} prependElements={checkBox} inputElement={button}/>
                            </div>    
                        </div>
                        )}


                        <p className="p-datatable-modulename mt-3" >{t("modules.Accounts.accountAddAndModify.tssDataTable.label")}</p>
                        <div className='row'>
                            <TssTable           
                                headers={[
                                    [
                                    { label: t("modules.Accounts.accountAddAndModify.tssDataTable.header.product") },
                                    { label: t("modules.Accounts.accountAddAndModify.tssDataTable.header.accountType") }
                                    ]
                                ]}
                                rows={ProductsList.map(product => ([
                                    { content: product.productName }, 
                                    {
                                    content: <TssSelectBox 
                                                label={t("modules.Accounts.accountAddAndModify.label.accountType")}
                                                mandatory={false}  
                                                defaultValue={ProductAccountTypes[product.productId]} 
                                                options={[NoAccessOption, ...accountTypes.filter(accountType => accountType.productId == product.productId)]}
                                                onChange={event => AccountTypeChange(product.productId, event)}
                                            />
                                    }
                                ]))}
                            />
                        </div>

                        <div className='row mt-3'>
                            <div className='form-group col-md-12 d-flex justify-content-end tss-pull-right'>
                                <TssButton id="previewButton" type="button" label={t("modules.Generic.buttons.label.preview")} btnProps={previewProp} onClick={ShowPreviewModal} isDisabled={previewDisable}/>  
                                <TssButton id="resetButton" type="button" label={t("modules.Generic.buttons.label.reset")} onClick={() =>ResetAccountDetails(mAccountId)}/>  
                                <TssButton  id="closeButton" type="button" label={t("modules.Generic.buttons.label.close")}  onClick={CloseModifyPage} />                          
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>

        <TssModal modalId="accountModifyPreviewModal" modalBodyId="myModalBody" className="modal-lg" header={t("modules.Accounts.accountAddAndModify.modalHeader")}>
            <div className='row'>
                <div className='form-group col-md-3'>{t("modules.Accounts.accountAddAndModify.label.loginId")}</div>
                <div className='form-group col-md-3'>: {mLoginId}</div>
                <div className='form-group col-md-3'>{t("modules.Accounts.accountAddAndModify.label.name")}</div>
                <div className='form-group col-md-3'>: {mName}</div>
            </div>
            <div className='row'>
                <div className='form-group col-md-3'>{t("modules.Accounts.accountAddAndModify.label.employeeId")}</div>
                <div className='form-group col-md-3'>: {mEmployeeId}</div>
                <div className='form-group col-md-3'>{t("modules.Accounts.accountAddAndModify.label.designation")}</div>
                <div className='form-group col-md-3'>: {mDesignation}</div>
            </div>
            <div className='row'>
                <div className='form-group col-md-3'>{t("modules.Accounts.accountAddAndModify.label.department")}</div>
                <div className='form-group col-md-3'>: {mDepartment}</div>
                <div className='form-group col-md-3'>{t("modules.Accounts.accountAddAndModify.label.mailId")}</div>
                <div className='form-group col-md-3' style={{minWidth: 0, wordBreak: "break-all", overflowWrap: "anywhere",textIndent: "-8px"}}>: {mMailId}</div>
            </div>
            <div className='row'>
                <div className='form-group col-md-3'>{t("modules.Accounts.accountAddAndModify.label.mobile")}</div>
                <div className='form-group col-md-3'>: {mMobile === "" ? "" : `${cc} ${mMobile}`}</div>
                <div className='form-group col-md-3'>{t("modules.Accounts.accountAddAndModify.label.accountExpiry")}</div>
                <div className='form-group col-md-3'>: {mAccountExpiry.split(' ')[0]}</div>
            </div>
            <div className='row'>
                <div className='form-group col-md-3'>{t("modules.Accounts.accountAddAndModify.label.accountStatus")}</div>
                <div className='form-group col-md-3'>: {mAccountStatus == '0' ?"Active" :"Disable"}</div>
                <div className='form-group col-md-3'>{t("modules.Accounts.accountAddAndModify.label.preferredLanguage")}</div>
                <div className='form-group col-md-3'>: {Language?.label}</div>
            </div>
                {ldapSupport == 1 && (
                <div className='row'>
                    <div className='form-group col-md-3'>{t("modules.Accounts.accountAddAndModify.label.ldapUser")}</div>
                    <div className='form-group col-md-3'>: {mLDAPUser ? "Enable" : "Disable"}</div>
                </div>
                )}
            
            <div className='row mt-3'>
                <div className='form-group col-md-12'>
                    <TssDataTable moduleName={t("modules.Accounts.accountAddAndModify.tssDataTable.label")} columns={tableHeadings} data={tableContentInModal} columnsDisplay={false} paginatorDisplay={false} pagination={false} globalFilterDisplay={false} downloadButtonDisplay={false}/>
                </div>
            </div>
            <div className='row mt-3'>
                <div className='form-group col-md-12 d-flex justify-content-end tss-pull-right'>
                    <TssButton  id="confirmButton" type="button" label={t("modules.Generic.buttons.label.confirm")} onClick={ModifyAccount}/>
                    <TssButton  id="closeButton" type="button" label={t("modules.Generic.buttons.label.close")}  btnProps={closeProp} />   
                </div>
            </div>
        </TssModal>
        
    </>
  )
}

 export default AccountsModify
