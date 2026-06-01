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

const AccountTypeModify = ({  modifyData,
			     ValidateAccountType, AccountTypeErrMsg, AccountTypeValidationTheme,
			     ProductErrMsg, ProductValidationTheme, ProductDefValue,
			     AccountGroupErrMsg, AccountGroupValidationTheme, AccountGroupDefValue,
			     LandingPageErrMsg, LandingPageValidationTheme, LandingPageDefValue,
			     ChangeProduct,
			     ChangeAccountGroup, isAccountGroupSel,
			     ChangeLandingPage,
			     ProductList, AccountGroupList, LandingPageList, ModuleList, PermissionList,
			     AccountTypeChange, AccountTypeDetails, ShowPreviewModal, OpenModal, 
			     ModuleAccessTypes, ModifyAccountType, CloseModifyPage, ModulePermission}) => {

  const [t] 			        = useTranslation();
  const [isChecked, setIsChecked]       = useState(false);
  const [permissionData, setPermissionData]   = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [isCollapsedFlag, setIsCollapsedFlag] = useState(true);

  const {
        accountTypeId,
        accountType,
        productId,
        product,
        accountGroupId,
        accountGroup,
        landingPage,
	accessType
  } = AccountTypeDetails;
				    
  /////////////////////// Properties /////////////////////////////

  const accountTypeProp = {
       type :'text',
       minLength : minAccountNameLen,
       maxLength : maxAccountNameLen,
       onChange : ValidateAccountType,
       defaultValue : accountType
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

  useEffect(() => {
	   const modulePermissions = {};
    ModuleList.forEach((element) => {
    element.submodules.forEach((submoduleItem) => {
        const submodulePermissions = [];

        if (submoduleItem.selPermission !== "null") {

            PermissionList.forEach(permission => {
                if ((parseInt(submoduleItem.selPermission) & parseInt(permission.value)) !== 0) {
                    submodulePermissions.push (
                        permission.value
                    );
                }
            });
        }
        if (submodulePermissions.length > 0) {
            ModuleAccessTypes[submoduleItem.moduleId] = submodulePermissions;
        }
    });
    });

    const initialCheckedItems = {};
    const initialCollapsedItems = {};
    ModuleList.forEach((element) => {
      initialCheckedItems[`check_${element.moduleId}`] = (element.submodules.some(submoduleItem => submoduleItem.selPermission !== "null")); // Initially unchecked
      initialCollapsedItems[`panel_${element.moduleId}`] = (element.submodules.some(submoduleItem => submoduleItem.selPermission !== "null")); // Initially collapsible
    });
    setCheckedItems(initialCheckedItems);
    setCollapsedItems(initialCollapsedItems);
  }, [ModuleList]);

  const handleCheckboxChange = (event, moduleId) => {
    const { id, checked } = event.target;
    let hasSelectedValues = false;
    const module = ModuleList.find(mod => mod.moduleId === moduleId);
    if (module) {
      module.submodules.forEach(submodule => {
        if (ModuleAccessTypes[submodule.moduleId] && ModuleAccessTypes[submodule.moduleId].length > 0) {
          hasSelectedValues = true;
          return; // Exit loop if any submodule has selected values
        }
      });
    }
    if (hasSelectedValues) {
      infoAlert(t("modules.AccountType.addAndModifyPage.validation.moduleCheck"));
    }
    else {
	  
    setCheckedItems({ ...checkedItems, [id]: checked });
 
    if (checked) {
       setCollapsedItems({ ...collapsedItems, [id]: false });	 
    }else {
       setCollapsedItems({ ...collapsedItems, [id]: true });	 
    }
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
	 <TssTextBox placeholderName={t("modules.AccountType.addAndModifyPage.placeholder.accountType")} validation={AccountTypeValidationTheme} tooltipMessage={AccountTypeErrMsg}  label={t("modules.AccountType.addAndModifyPage.label.accountType")} mandatory="true" inputInfo={t("modules.AccountType.addAndModifyPage.inputInfo.accountTypeInfo",{ minAccountNameLen: minAccountNameLen })}  properties={accountTypeProp} defaultValue={accountType}/>
	</div>
 	<div align="left" className="form-group col-md-3">
	 <TssSelectBox label={t("modules.AccountType.addAndModifyPage.label.product")} options={ProductList} validation={ProductValidationTheme} tooltipMessage={ProductErrMsg} mandatory="true" defaultValue={ProductDefValue} onChange={ChangeProduct} disabled={true}/>
	</div>
	<div align="left" className="form-group col-md-3">
         <TssSelectBox label={t("modules.AccountType.addAndModifyPage.label.accountGroup")} options={AccountGroupList} validation={AccountGroupValidationTheme} tooltipMessage={AccountGroupErrMsg}  mandatory="true"  defaultValue={AccountGroupDefValue} onChange={ChangeAccountGroup}/>
        </div>
        <div align="left" className="form-group col-md-3">
 	 <TssSelectBox label={t("modules.AccountType.addAndModifyPage.label.landPage")} options={LandingPageList} validation={LandingPageValidationTheme} tooltipMessage={LandingPageErrMsg}  mandatory="true" defaultValue={LandingPageDefValue}  onChange={ChangeLandingPage}/>
	</div>
       </div>
       { isAccountGroupSel &&(
       <div className="row">
 	<div className="form-group col-md-12">
	{ ModuleList.map((element, index) => (
		<TssPanel 
		   panelId={`panel_${element.moduleId}`} 
		   panelBodyId={`panelBody_${element.moduleId}`} 
		   collapseReq={true} 
		   isCollapsed={collapsedItems[`panel_${element.moduleId}`] || false } 
		   header={
	 	      <>
	                 <label><input id={`check_${element.moduleId}`} type="checkbox" checked={checkedItems[`check_${element.moduleId}`] || false } onChange={(event) => handleCheckboxChange(event,element.moduleId)}/></label> &nbsp; &nbsp; &nbsp;
	                 <label>{element.moduleName}</label>
	              </>
	           }
		   children={
		      checkedItems[`check_${element.moduleId}`] &&(
			 <div>
		  	    <table style={{ width:'100%' }}>
	  		       {element.submodules.map((submoduleItem, index) => (
	   			  <tr>
	    			  <td style={{ width:'60%' }}>{submoduleItem.linkPath}</td>
	    			  <td style={{ width:'40%' }}>
				       <TssMultiSelectBox 
				          label={t("modules.AccountType.addAndModifyPage.label.accessType")} 
				          isSeachable="true" 
				          selectAllOption="true"  
				          options={PermissionList.filter(permission => (parseInt(submoduleItem.permission) & parseInt(permission.value)) !== 0)} 
				          onSelect={options => AccountTypeChange(submoduleItem.moduleId, options)} 
				          defaultValue={
  PermissionList
    .filter(permission => ModuleAccessTypes[submoduleItem.moduleId]?.includes(permission.value)) // Add null check
}
				       />
				       {/*<AccessType
                          		  submoduleItem={submoduleItem}
				       	  t={t}
		                          PermissionList={PermissionList}
                		          AccountTypeChange={AccountTypeChange}
                        	       />*/}
				  </td>
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
      	<TssButton id="previewButton" type="button" label={t('modules.Generic.buttons.label.preview')} btnProps={previewProps} isDisabled={(parseInt(ModulePermission) & 2) != 2} onClick={() => ShowPreviewModal("mod")}/>
	<TssButton id="closeButton" type="button" onClick={() => CloseModifyPage(AccountTypeDetails)} label={t('modules.Generic.buttons.label.close')} />
       </div>
      </div>
     </div>
    </div>
   </div>
  </section>

  <TssModal modalId="accountTypePreviewModal" modalBodyId="accountTypePreviewModalBody" className="modal-lg" header={t("modules.AccountType.previewPage.header")}>
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
                <TssButton  id="confirmButton" type="button" label={t("modules.Generic.buttons.label.confirm")}  onClick={ModifyAccountType}/>
                <TssButton  id="cancelButton" type="button" label={t("modules.Generic.buttons.label.close")} btnProps={closePreviewProps}/>
            </div>
          </div>
  </TssModal>
 </>
 )
}

/*const AccessType = ({ submoduleItem, t, PermissionList, AccountTypeChange }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    // Set default values when the component mounts
    setSelectedOptions(
      PermissionList.filter(permission => (parseInt(submoduleItem.selPermission) & parseInt(permission.value)) !== 0)
        .map(permission => permission.value)
    );
  }, []); // Empty dependency array ensures this effect runs only once, similar to componentDidMount

  const handleSelect = (options) => {
    setSelectedOptions(options);
    AccountTypeChange(submoduleItem.moduleId, options);
  };

  return (
    <TssMultiSelectBox
      label={t("modules.AccountType.addAndModifyPage.label.accessType")}
      isSeachable={true}
      selectAllOption={true}
      options={PermissionList.filter(permission => (parseInt(submoduleItem.permission) & parseInt(permission.value)) !== 0)}
      onSelect={handleSelect}
      defaultValue={selectedOptions}
    />
  );
};*/
export default AccountTypeModify;
