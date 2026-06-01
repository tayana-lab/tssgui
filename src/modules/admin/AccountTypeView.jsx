import React,{useState,useEffect} from 'react';
import TssDataTable from '@app/modules/common/default/components/TssDataTable';
import TssModal from '@app/modules/common/default/components/TssModal';
import TssIcon from '@app/modules/common/default/components/TssIcon';
import TssTextBox from '@app/modules/common/default/components/TssTextBox';
import TssButton from '@app/modules/common/default/components/TssButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { faPlus, faSync } from '@fortawesome/free-solid-svg-icons';
const AccountTypeView = ({ LoadAddPage ,deleteRow, AccountTypes, GetAccountTypeDetails,
			   ShowAccountTypeModifyPage, ShowDeleteAccountTypeModal, AccountTypeToBeDeleted,AccountTypePdtToBeDeleted,
			   AccountTypeIdToBeDeleted, Cancel, DeleteValidationTheme, DeleteTooltipMessage, 
			   DeletePassword, ResetDeletePassword, DeleteAccountType, ModulePermission}) => {


  const [data, setData] = useState([]);
  const [t] = useTranslation();

  const passwordProp = {
        type : "password",
        onChange : DeletePassword,
        maxLength : 20,
	value: ResetDeletePassword
  }
   const deleteProp =
    {
        "data-target": "#accountTypeDeleteModal",
        "data-toggle": "modal"
    }

  const cancelProp = {
        "data-target": "#accountTypeDeleteModal",
        "data-dismiss": "modal"
  };

  const buttons = (rowData) => {
    const disableButton = rowData.disableButton || (parseInt(rowData.modulePerm) & 8) != 8; 
    return (
      <div>
      
        <TssIcon iconKey="tss_edit" onClick={() => (parseInt(rowData.modulePerm) & 1) == 1 || (parseInt(rowData.modulePerm) & 2) == 2?ShowAccountTypeModifyPage(rowData):""} title={t("modules.Generic.TssDataTable.button.title.edit")} />
        <span className="button-gap" style={{ marginLeft: '10px' }}></span>
        <TssIcon iconKey="tss_delete" onClick={() => {ShowDeleteAccountTypeModal(rowData);}}  iconProps={!disableButton && (parseInt(rowData.modulePerm) & 8) == 8?deleteProp:""} isDisabled={disableButton} title={t('modules.Generic.TssDataTable.button.title.delete')} />
      </div>
    );
  };
  
  const customButtons  = () => {
    return (
         <>
	  <TssIcon iconKey="tss_add" onClick={LoadAddPage} isDisabled={(parseInt(ModulePermission) & 4) != 4} title={t('modules.Generic.buttons.title.add')}/>
              <span className="button-gap" style={{ marginLeft: '10px' }}></span>
	  <TssIcon iconKey="tss_refresh" onClick={GetAccountTypeDetails} title={t('modules.Generic.buttons.title.refresh')}/>
         </>
    );
  };
  
  const tableHeadings = [
    { field: 'accountType', header: t('modules.AccountType.viewPage.TssDataTable.header.accountType'),fixed:true },
    { field: 'product', header: t('modules.AccountType.viewPage.TssDataTable.header.product') },
    { field: 'accountGroup', header: t('modules.AccountType.viewPage.TssDataTable.header.accountGroup')},
    { field: 'numberOfAccounts', header: t('modules.AccountType.viewPage.TssDataTable.header.noOfAccounts')},
    { field: 'disableButton', header: '', sortable:false, filter:false, body: buttons },
  ];

/*const tableContent = AccountTypes.flatMap(product => 
  product.accessTypeDetails.map(accessType => ({
    accountTypeId: accessType.accessTypeId,
    accountType: accessType.accessTypeName,
    productId: product.productId,
    product: product.productName,
    accountGroupId: accessType.acctGroupId,
    accountGroup: accessType.acctGroupName, 
    numberOfAccounts: accessType.attachedAccountCount,
    landingPage: accessType.landingPage,
    landingPageId: accessType.landingPage,
    disableButton: accessType.attachedAccountCount != 0,
     modulePerm: ModulePermission
  }))
);	*/

const tableContent = AccountTypes.flatMap(product =>
  product.accessTypeDetails
    .filter(accessType => accessType.accessTypeId == 100001)
    .map(accessType => ({
      accountTypeId: accessType.accessTypeId,
      accountType: accessType.accessTypeName,
      productId: product.productId,
      product: product.productName,
      accountGroupId: accessType.acctGroupId,
      accountGroup: accessType.acctGroupName,
      numberOfAccounts: accessType.attachedAccountCount,
      landingPage: accessType.landingPage,
      landingPageId: accessType.landingPage,
      disableButton: accessType.attachedAccountCount != 0,
      modulePerm: ModulePermission
    }))
);				   

  return (
   <>
    <section className="content">
     <div className="container-fluid">
      <div className="card">
       <div className="card-body d-flex align-items-center py-8"> 
        <div style={{width:'100%'}} >
         <TssDataTable moduleName={t('modules.AccountType.viewPage.label')} columnsDisplay={false} columns={tableHeadings} data={tableContent} buttons={customButtons}  fileName={"AccountTypeView"} />
        </div>
       </div>
      </div>
     </div>
    </section>

    <TssModal modalId="accountTypeDeleteModal" modalBodyId="deleteAcntTypeBody" className="modal-md" header={`${t("modules.Accounts.confirmPassword.label.delete")} ${AccountTypeToBeDeleted}`}>
     <div className='row'>
      <div className='form-group col-md-12'>
       <TssTextBox  placeholderName={t("modules.Accounts.confirmPassword.placeholder.password")} validation={DeleteValidationTheme} label={t("modules.Accounts.confirmPassword.label.password")} tooltipMessage={DeleteTooltipMessage} mandatory={true} properties={passwordProp} max={20}/>
      </div>
     </div>
     <div className='row mt-3'>
      <div className='form-group col-md-12 d-flex justify-content-end tss-pull-right'>
       
       <TssButton  id="confirmButton" type="button" label={t("modules.Generic.buttons.label.confirm")} onClick={() => DeleteAccountType(AccountTypeIdToBeDeleted,AccountTypePdtToBeDeleted,AccountTypeToBeDeleted)}  />
       <TssButton  id="cancelButton" type="button" label={t("modules.Generic.buttons.label.close")}  btnProps={cancelProp} onClick={Cancel}/>
      </div>
     </div>
    </TssModal>

   </>
    
  )
}

export default AccountTypeView;

