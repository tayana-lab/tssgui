import React from 'react'
import TssDataTable from '@app/modules/common/default/components/TssDataTable'
import { useTranslation } from 'react-i18next';
import TssModal from '@app/modules/common/default/components/TssModal';


const AccountsCount = ({StatusCountList,ShowDetails,FilteredAccounts}) => {
    const [t]= useTranslation();

    const tableHeadings =  [
        { field: 'product', header:t("modules.Accounts.accountsView.tssDataTable.statusCount.header.product") , fixed:true , sortable:true, filter:false},
        { field: 'active', header:t("modules.Accounts.accountsView.tssDataTable.statusCount.header.active"), sortable:true, filter:false,  body: rowData => rowData.active !== 0? <b><a className='tss-anchor' href="#" data-toggle='modal' data-target='#accountStatusModal' onClick={() => ShowDetails(rowData.productId, 0)}>{rowData.active}</a></b>: <span>{rowData.active}</span> },  
        { field: 'disabled', header:t("modules.Accounts.accountsView.tssDataTable.statusCount.header.disabled"), sortable:true, filter:false,  body: rowData => rowData.disabled !== 0? <b><a className='tss-anchor' href="#" data-toggle='modal' data-target='#accountStatusModal' onClick={() => ShowDetails(rowData.productId, 1)}>{rowData.disabled}</a></b>: <span>{rowData.disabled}</span> },
        { field: 'locked', header:t("modules.Accounts.accountsView.tssDataTable.statusCount.header.locked"), sortable:true, filter:false, body:  rowData => rowData.locked !== 0?  <b><a className='tss-anchor' href="#" data-toggle='modal' data-target='#accountStatusModal' onClick={() => ShowDetails(rowData.productId, 2)}>{rowData.locked}</a></b>: <span>{rowData.locked}</span> } ,
        { field: 'expired', header:t("modules.Accounts.accountsView.tssDataTable.statusCount.header.expired"), sortable:true, filter:false,  body:  rowData => rowData.expired !== 0? <b><a className='tss-anchor' href="#" data-toggle='modal' data-target='#accountStatusModal' onClick={() => ShowDetails(rowData.productId, 3)}>{rowData.expired}</a></b>: <span>{rowData.expired}</span> },
        { field: 'total', header:t("modules.Accounts.accountsView.tssDataTable.statusCount.header.total"), sortable:true, filter:false, body:  rowData => rowData.total !== 0?  <b><a className='tss-anchor' href="#" data-toggle='modal' data-target='#accountStatusModal' onClick={() => ShowDetails(rowData.productId, -2)} >{rowData.total}</a></b>: <span>{rowData.total}</span> }       
    ];

    const tableContent = StatusCountList.map(account => ({
        productId :account.productId,
        product: account.productName,
        active : account.activeCount,
        disabled : account.inactiveCount,
        locked : account.lockedCount,
        expired : account.expiredCount,
        total : account.allCount,
        
    }));


    const tableHeadingsInModal =  [       
        { field: 'loginId', header:t("modules.Accounts.accountsView.tssDataTable.filteredAccounts.header.loginId") , fixed:true , sortable:true, filter:false},
        { field: 'name', header:t("modules.Accounts.accountsView.tssDataTable.filteredAccounts.header.name"), sortable:true, filter:false},  
        { field: 'status', header:t("modules.Accounts.accountsView.tssDataTable.filteredAccounts.header.status") , sortable:true, filter:false},
        { field: 'expiry', header:t("modules.Accounts.accountsView.tssDataTable.filteredAccounts.header.expiry") , sortable:true, filter:false},
        { field: 'accountType', header:t("modules.Accounts.accountsView.tssDataTable.filteredAccounts.header.accountType") , sortable:true, filter:false},
        
    ];

    const tableContentInModal =FilteredAccounts.map(account => ({
        loginId: account.accountName,
        name : account.displayName,
        status : account.status == '0' ? 'Active' : account.status == '1' ? 'Disabled':account.status == '2' ? 'Locked':'Expired',
        expiry : account.accountExpiry.slice(0,10),
        accountType : account.accessDetails[0].accessTypeName,
    }));
    

    return (
        <>
            <section className="content">
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-body align-items-center py-8">
                            <TssDataTable moduleName={t("modules.Accounts.accountsView.tssDataTable.statusCount.label")} columns={tableHeadings} data={tableContent}  columnsDisplay={false} paginatorDisplay={false} pagination={false} globalFilterDisplay={false} downloadButtonDisplay={false}/>
                        </div>
                    </div>
                </div>
            </section>


            <TssModal header={t("modules.Accounts.accountsView.tssDataTable.statusCount.label")} modalId="accountStatusModal" modalBodyId="statusBody" className="modal-xl">
                <div className='form-group col-md-12'>
                    <TssDataTable columns={tableHeadingsInModal} data={tableContentInModal} columnsDisplay={false} paginatorDisplay={false} pagination={false} globalFilterDisplay={false} downloadButtonDisplay={false}/>
                </div>
            </TssModal>
        </>
    )
}

export default AccountsCount
