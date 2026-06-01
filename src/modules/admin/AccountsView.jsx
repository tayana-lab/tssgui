import React, { useEffect } from 'react'
import TssSelectBox from '@app/modules/common/default/components/TssSelectBox';
import TssDataTable from '@app/modules/common/default/components/TssDataTable';
import TssIcon from '@app/modules/common/default/components/TssIcon';
import conf from '@app/modules/conf/TssGui.json'
import TssModal from '@app/modules/common/default/components/TssModal';
import TssTextBox from '@app/modules/common/default/components/TssTextBox'
import TssButton from '@app/modules/common/default/components/TssButton';
import { useTranslation } from 'react-i18next';



const ldapSupport = conf.LDAP_SUPPORT

const AccountsView = ({ ProductsList, FilteredAccounts, 
                        Search, ShowFilteredAccountsTable,ShowAccountModifyPage,
                        Product, SelectedProduct, AccountType, SelectedAccountType, 
                        AccountStatus, SelectedAccountStatus, ShowSearch,
                        ShowDeleteAccountModal, DelPasswd, Close,ShowAddPage,
                        AccountToBeDeleted,AccountIdToBeDeleted,DeleteValidationTheme, 
                        DeleteTooltipMessage, DeletePassword, DeleteAccount,
			            AcctTyps,Permission,Refresh,RefreshKey,
			            FilterAccTypeErrMsg,FilterAccTypeValTheme,
                        AddPermission,DelPermission,LevelOfLoggedInUser      
                    }) => {

    const [t]= useTranslation();
    
    const statusConf = conf.STATUS; 
    const status = Object.entries(statusConf).map(([value, label]) => ({
        value,
        label
    }));                          


    const passwordProp = {
        type : "password",
        onChange : DeletePassword,
        maxLength : 20,
        value : DelPasswd
      }

    const deleteProp = 
    {
        "data-target": "#accountDeleteModal",
        "data-toggle": "modal"
    }

    //const deletedisable = (Permission & 8 == 8) || (mAccountId == localStorage.getItem("acctID"))) && (Level <= LevelOfLoggedInUser)
    const buttons = (rowData) =>
    {
        const disableButton = rowData.operations;
        return(
            <div>
                <TssIcon iconKey="tss_edit" onClick={() => ShowAccountModifyPage(rowData) } title={t("modules.Generic.TssDataTable.button.title.edit")}/>
                <TssIcon iconKey="tss_delete" className="gap" onClick={() => {ShowDeleteAccountModal(rowData)}} iconProps={deleteProp}  isDisabled={disableButton} title={t("modules.Generic.TssDataTable.button.title.delete")} />
            </div>
        )
    }
    const customButtons  = () => { 
        return (
            <>
              
                <TssIcon iconKey="tss_add" onClick={ShowAddPage} title={t('modules.Generic.buttons.title.add')} isDisabled={!AddPermission}/>     
                <TssIcon className='gap' iconKey="tss_refresh" onClick={Refresh} title={t('modules.Generic.buttons.title.refresh')}/>
             </>
        );
    };

    

    const tableHeadings =  [
        { field: 'loginId', header:t("modules.Accounts.accountsView.tssDataTable.filteredAccounts.header.loginId") , fixed:true , sortable:true, filter:false},
        { field: 'name', header:t("modules.Accounts.accountsView.tssDataTable.filteredAccounts.header.name"), sortable:true, filter:false},  
        { field: 'status', header:t("modules.Accounts.accountsView.tssDataTable.filteredAccounts.header.status") , sortable:true, filter:false},
        { field: 'expiry', header:t("modules.Accounts.accountsView.tssDataTable.filteredAccounts.header.expiry") , sortable:true, filter:false},
        { field: 'created', header:t("modules.Accounts.accountsView.tssDataTable.filteredAccounts.header.created") , sortable:true, filter:false},
        { field: 'mailId', header:t("modules.Accounts.accountsView.tssDataTable.filteredAccounts.header.mailId"), sortable:true, filter:false},
        { field: 'mobile', header:t("modules.Accounts.accountsView.tssDataTable.filteredAccounts.header.mobile") , sortable:true, filter:false},
        ...(ldapSupport == '1' ? [{ field: 'ldapUser', header: t("modules.Accounts.accountsView.tssDataTable.filteredAccounts.header.ldapUser"), sortable: true, filter: false }] : []),
        { field: 'level', header:t("modules.Accounts.accountsView.tssDataTable.filteredAccounts.header.level") , sortable:true, filter:false},
        { field: 'operations', header: '' , sortable:false, filter:false, body: buttons}    
    ];

    const tableContent = FilteredAccounts.map(account => ({
        accountId : account.accountId ,
        loginId: account.accountName,
        name : account.displayName,
        status : account.status == '0' ? 'Active' : account.status == '1' ? 'Disabled':account.status == '2' ? 'Locked':'Expired',
        expiry : account.accountExpiry.slice(0,10),
        created : account.creationTime.slice(0,10),
        mailId : account.mailId,
        mobile : account.mobileNum,
        ldapUser:account.ldapUser === '1' ? '✔' : '✘',
        level : account.privilegeLevel,     
        operations : ((Permission&8) != 8) || (localStorage.getItem("acctID") == account.acct_id) || (account.previlege_level <=  LevelOfLoggedInUser) ,
        //operations : account.previlege_level == "0"
    }));
    ////////////////////////////////////////////////////
    const accountTypes = AcctTyps.flatMap(product =>
        product.accessTypeDetails.map(accountType => ({
            value: accountType.accessTypeId,
            label: accountType.accessTypeName,
            productId: product.productId
        }))
    ); 

    const products = ProductsList.map(product => ({
        value: product.productId,            
        label: product.productName,
        productId : product.productId
    }));

    //////////////////////////////////////////////////////
    const closeProp = {
        "data-target": "#accountDeleteModal",
        "data-dismiss": "modal"
        
    };

    return (
        <>
            <section className="content">
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-body align-items-center py-8">

                            <div className="row ">
                                <div className='form-group col-md-4'>
                                    <TssSelectBox label={t("modules.Accounts.accountsView.label.product")} defaultValue={SelectedProduct} mandatory={false} options={products} onChange={Product} /> 
                                </div>
                                <div className='form-group col-md-4'>
                                    <TssSelectBox label={t("modules.Accounts.accountsView.label.accountType")} placeholder={t("modules.Accounts.accountsView.placeholder.accountType")} defaultValue={SelectedAccountType} tooltipMessage={FilterAccTypeErrMsg} validationTheme={FilterAccTypeValTheme} options={accountTypes} onChange={AccountType} key={RefreshKey} mandatory={true}/> 
                                </div>
                                <div className='form-group col-md-4'>
                                    <TssSelectBox label={t("modules.Accounts.accountsView.label.accountStatus")} defaultValue={SelectedAccountStatus} mandatory={false} options={status} onChange={AccountStatus} />
                                </div>
                            </div>
                            {ShowSearch && (
                            <div className="row " >
                                <div className='form-group col-md-12'>
                                    <TssButton  className='mt-2 tss-pull-right' id="searchButton" type="button" label={t("modules.Generic.buttons.label.search")} onClick={Search}/>
                                </div>
                            </div>
                            )}
                        
                            {ShowFilteredAccountsTable && (
                            <div className="row">
                                <div className='form-group col-md-12'>
                                    <TssDataTable className='mt-3' moduleName={t("modules.Accounts.accountsView.tssDataTable.filteredAccounts.label")} columns={tableHeadings} data={tableContent} columnsDisplay={false} buttons={customButtons} fileName={t('modules.Accounts.accountsView.tssDataTable.filteredAccounts.fileName')}/>
                                </div>
                            </div>
                            )} 
                        </div>
                    </div>
                   
                </div>
            </section>


            <TssModal modalId="accountDeleteModal" modalBodyId="deleteBody" className="modal-md" header={`${t("modules.Accounts.confirmPassword.label.delete")} ${AccountToBeDeleted}`}>
                <div className='row'>
                    
                        <div className='form-group col-md-12'>
                            <TssTextBox  placeholderName={t("modules.Accounts.confirmPassword.placeholder.password")} validation={DeleteValidationTheme} label={t("modules.Accounts.confirmPassword.label.password")} tooltipMessage={DeleteTooltipMessage} mandatory={true} properties={passwordProp} max={20}/>
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='form-group col-md-12 d-flex justify-content-end tss-pull-right'>   
                            <TssButton  id="confirmButton" type="button" label={t("modules.Generic.buttons.label.confirm")} onClick={() => DeleteAccount(AccountIdToBeDeleted)}/>
                            <TssButton  id="closeButton" type="button" label={t("modules.Generic.buttons.label.close")}  btnProps={closeProp}  onClick={Close}/>
                        </div>
                    </div>
            </TssModal>
        
        </>
    )
}

export default AccountsView
