// Common parent component
import React, { useState, useEffect } from 'react';
import ContentHeader from '@app/modules/common/default/components/TssContentHeader';
import TssTextBox from '@modules/common/default/components/TssTextBox';
import TssSelectBox from '@modules/common/default/components/TssSelectBox';
import TssPanel from '@modules/common/default/components/TssPanel';
import TssMultiSelectBox from '@modules/common/default/components/TssMultiSelectBox';
import TssButton from '@modules/common/default/components/TssButton'
import TssModal from '@app/modules/common/default/components/TssModal';
import TssDataTable from '@modules/common/default/components/TssDataTable';
import { useTranslation } from 'react-i18next';
import {infoAlert} from '@app/modules/common/default/components/TssFunction';
import tssguiConf from '@app/modules/conf/TssGui.json';

const tssguiAPIURI        = tssguiConf.TSSGUI_API_URI;
const tssguiAPIUser       = tssguiConf.TSSGUI_API_USER;
const tssguiAPIPswd       = tssguiConf.TSSGUI_API_PSWD;
const minAccountNameLen       = tssguiConf.MIN_ACNT_NAME_LENGTH;
const maxAccountNameLen       = tssguiConf.MAX_ACNT_NAME_LENGTH;

const AccountTypeCreate = ({ closeAddPage, addData,
			     ValidateAccountType, AccountTypeErrMsg, AccountTypeValidationTheme,
			     ProductErrMsg, ProductValidationTheme, AccountGroupErrMsg, AccountGroupValidationTheme, AccountGroupKey,
			     LandingPageErrMsg, LandingPageValidationTheme, LandingPageKey,
			     ChangeProduct,
			     ChangeAccountGroup, isAccountGroupSel,
			     ChangeLandingPage,
			     ProductList, AccountGroupList, LandingPageList, ModuleList, PermissionList,
			     AccountTypeChange, AccountTypeDetails, ShowPreviewModal, OpenModal, ModuleAccessTypes, AddAccountType}) => {

  const [t] 			        = useTranslation();
  const [isChecked, setIsChecked]       = useState(false);
  const [permissionData, setPermissionData]   = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [isCollapsedFlag, setIsCollapsedFlag] = useState(true);

  const {
        accountType,
        product,
        accountGroup,
        landingPage
  } = AccountTypeDetails;
				    
  /////////////////////// Properties /////////////////////////////

  const accountTypeProp = {
       type :'text',
       minLength : minAccountNameLen,
       maxLength : maxAccountNameLen,
       onChange : ValidateAccountType
  };

  
  const previewProps = OpenModal 
    ? {
        "data-target" : "#accountTypePreviewModal" ,
        "data-toggle" : "modal"
      } : {};

  const closePreviewProps = {
    "data-target": "#accountTypePreviewModal",
    "data-dismiss": "modal",
  };

  const tableHeadings =  [
    { field: 'moduleName', header: t("modules.AccountType.previewPage.TssDataTable.header.moduleName") , fixed:true , sortable:false, filter:false},
    { field: 'accessPerm', header: t("modules.AccountType.previewPage.TssDataTable.header.accessPerm"), sortable:false, filter:false},
  ];

  const handleMultiSelect = (options) => {
    setSelectedOptions(options);
  };

  const [checkedItems, setCheckedItems] = useState({});
  const [collapsedItems, setCollapsedItems] = useState({});
 // Function to reset checkedItems and collapsedItems
  const resetPanelStates = () => {
    const newCheckedItems = {};
    const newCollapsedItems = {};
    ModuleList.forEach(element => {
      newCheckedItems[`check_${element.moduleId}`] = false;
      newCollapsedItems[`panel_${element.moduleId}`] = true; // Assuming you want panels collapsed by default
    });
    setCheckedItems(newCheckedItems);
    setCollapsedItems(newCollapsedItems);
  };

  useEffect(() => {
    resetPanelStates();
  }, [ModuleList]);

  const handleCheckboxChange = (event, moduleId) => {
    const { id, checked } = event.target;
     let hasSelectedValues = false;
    // Find the module in ModuleList
    const module = ModuleList.find(mod => mod.moduleId === moduleId);

    // If module is found, iterate through its submodules
    if (module) {
      module.submodules.forEach(submodule => {
        // Check if submodule has selected values in multiselect (example logic)
        if (ModuleAccessTypes[submodule.moduleId] && ModuleAccessTypes[submodule.moduleId].length > 0) {
          hasSelectedValues = true;
          return; // Exit loop if any submodule has selected values
        }
      });
    }
    // Show alert if any submodule has selected values
    if (hasSelectedValues) {
      infoAlert(t("modules.AccountType.addAndModifyPage.validation.moduleCheck"));
    }
    else {
      setCheckedItems({ ...checkedItems, [id]: checked });
    }
 
    if (checked) {
       setCollapsedItems({ ...collapsedItems, [id]: false });	 
    }else {
       setCollapsedItems({ ...collapsedItems, [id]: true });	 
    }
  };


const tableContentInModal = ModuleList.flatMap((module) => {
  const moduleInfo = {
    moduleName: <b>{module.moduleName}</b>,
    accessPerm: '' // You can set the access permission for the module here
  };

  const submoduleInfo = module.submodules.map((submoduleItem) => {
    const accessPerm = ModuleAccessTypes[submoduleItem.moduleId]
     ? PermissionList
                  .filter(permission => ModuleAccessTypes[submoduleItem.moduleId].includes(permission.value))
                  .map(permission => permission.label)
                  .join(',')
      : t("modules.AccountType.previewPage.TssDataTable.body.noAccess");

    return {
      moduleName: submoduleItem.linkPath,
      accessPerm
    };
  });

  return [moduleInfo, ...submoduleInfo];
});



  return (
  <>
   <section className="content">
    <div className="container-fluid">
     <div class="card">
      <div class="card-body align-items-center py-8">
       <div className="row">
	<div align="left" className="form-group col-md-3">
	 <TssTextBox placeholderName={t("modules.AccountType.addAndModifyPage.placeholder.accountType")} validation={AccountTypeValidationTheme} tooltipMessage={AccountTypeErrMsg}  label={t("modules.AccountType.addAndModifyPage.label.accountType")} mandatory="true" inputInfo={t("modules.AccountType.addAndModifyPage.inputInfo.accountTypeInfo",{ minAccountNameLen: minAccountNameLen })}  properties={accountTypeProp} />
	</div>
 	<div align="left" className="form-group col-md-3">
	 <TssSelectBox label={t("modules.AccountType.addAndModifyPage.label.product")} placeholder={t("modules.AccountType.addAndModifyPage.placeholder.product")} options={ProductList} validationTheme={ProductValidationTheme} tooltipMessage={ProductErrMsg} mandatory={true} defaultValue={""} onChange={ChangeProduct}/>
	</div>
	<div align="left" className="form-group col-md-3">
         <TssSelectBox label={t("modules.AccountType.addAndModifyPage.label.accountGroup")} placeholder={t("modules.AccountType.addAndModifyPage.placeholder.accountGroup")} options={AccountGroupList} validationTheme={AccountGroupValidationTheme} tooltipMessage={AccountGroupErrMsg} mandatory={true} key={AccountGroupKey} defaultValue={""} onChange={ChangeAccountGroup}/>
        </div>
        <div align="left" className="form-group col-md-3">
 	 <TssSelectBox label={t("modules.AccountType.addAndModifyPage.label.landPage")} placeholder={t("modules.AccountType.addAndModifyPage.placeholder.landPage")} options={LandingPageList} validationTheme={LandingPageValidationTheme} tooltipMessage={LandingPageErrMsg} mandatory={true} key={LandingPageKey} defaultValue={""} onChange={ChangeLandingPage}/>
	</div>
       </div>
       { isAccountGroupSel &&(
       <div className="row">
 	<div className="form-group col-md-12">
	{ ModuleList.map((element, index) => (
        <TssPanel panelId={`panel_${element.moduleId}`} panelBodyId={`panelBody_${element.moduleId}`} collapseReq={true} isCollapsed={collapsedItems[`panel_${element.moduleId}`] || false} header={
	 <>
	  <label><input id={`check_${element.moduleId}`} type="checkbox" checked={checkedItems[`check_${element.moduleId}`] || false} onChange={(event) => handleCheckboxChange(event,element.moduleId)}/></label> &nbsp; &nbsp; &nbsp;
	  <label>{element.moduleName}</label>
	 </>
	} children={checkedItems[`check_${element.moduleId}`] &&(
	 <div>
	  <table style={{ width:'100%' }}>
	  { element.submodules.map((submoduleItem, index) => (
	   <tr>
	    <td style={{ width:'60%' }}>{submoduleItem.linkPath}</td>
	    <td style={{ width:'40%' }}><TssMultiSelectBox label={t("modules.AccountType.addAndModifyPage.label.accessType")} isSeachable="true" selectAllOption="true"  options={PermissionList.filter(permission => (parseInt(submoduleItem.permission) & parseInt(permission.value)) != 0)} onSelect={options => AccountTypeChange(submoduleItem.moduleId, options)} defaultValue={PermissionList.filter(permission => ModuleAccessTypes[submoduleItem.moduleId]?.includes(permission.value))}/></td>
		  </tr>
 	  ))}
	  </table>
	 </div>
        
	)} className="tss-info-panel">
        </TssPanel>
       ))} 
       </div>
      </div>
	)}
      <div className='row mt-3'>
       <div className='form-group col-md-12 d-flex justify-content-end tss-pull-right'>
      	<TssButton id="previewButton" type="button" label={t('modules.Generic.buttons.label.preview')} btnProps={previewProps} onClick={() => ShowPreviewModal("add")}/>
	<TssButton id="closeButton" type="button" onClick={closeAddPage} label={t('modules.Generic.buttons.label.close')} />
       </div>
      </div>
     </div>
    </div>
   </div>
  </section>

  <TssModal modalId="accountTypePreviewModal" modalBodyId="accountTypePreviewModalBody" className="modal-lg" header="Account Type Preview">
        <div className='row'>
            <div className='form-group col-md-2'>{t("modules.AccountType.addAndModifyPage.label.accountType")}</div>
            <div className='form-group col-md-1'>:</div>
            <div className='form-group col-md-3'>{accountType}</div>
            <div className='form-group col-md-2'>{t("modules.AccountType.addAndModifyPage.label.product")}</div>
            <div className='form-group col-md-1'>:</div>
            <div className='form-group col-md-3'>{product}</div>

            <div className='form-group col-md-2'>{t("modules.AccountType.addAndModifyPage.label.accountGroup")}</div>
            <div className='form-group col-md-1'>:</div>
            <div className='form-group col-md-3'>{accountGroup}</div>
            <div className='form-group col-md-2'>{t("modules.AccountType.addAndModifyPage.label.landPage")}</div>
            <div className='form-group col-md-1'>:</div>
            <div className='form-group col-md-3'>{landingPage}</div>

            <div className='form-group col-md-12'>
                <TssDataTable columns={tableHeadings} data={tableContentInModal} columnsDisplay={false} paginatorDisplay={false} pagination={false} globalFilterDisplay={false} downloadButtonDisplay={false}/>
            </div>
            <div className='form-group col-md-12 d-flex justify-content-end tss-pull-right'>
                <TssButton  id="confirmButton" type="button" label={t("modules.Generic.buttons.label.confirm")} onClick={AddAccountType}/>
                <TssButton  id="cancelButton" type="button" label={t("modules.Generic.buttons.label.close")} btnProps={closePreviewProps}/>
            </div>
          </div>
  </TssModal>
 </>
 )
}

export default AccountTypeCreate;
