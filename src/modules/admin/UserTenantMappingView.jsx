import React from 'react';
import TssDataTable from '@app/modules/common/default/components/TssDataTable';
import TssIcon from '@app/modules/common/default/components/TssIcon';
import TssModal from '@app/modules/common/default/components/TssModal';
import TssButton from '@app/modules/common/default/components/TssButton';
import { useTranslation } from 'react-i18next';

const UserTenantMappingView = ({
  mappingList,
  LoadAddPage,
  ShowModifyPage,
  GetMappingList,
  ShowDeleteModal,
  mappingToDelete,
  cancelDelete,
  confirmDelete,
}) => {
  const [t] = useTranslation();

  const cancelDeleteProp = {
    'data-target': '#userTenantDeleteModal',
    'data-dismiss': 'modal',
  };

  const deleteIconProp = {
    'data-target': '#userTenantDeleteModal',
    'data-toggle': 'modal',
  };

  const rowButtons = (rowData) => (
    <div>
      <TssIcon
        iconKey="tss_edit"
        title="Edit"
        onClick={() => ShowModifyPage(rowData)}
      />
      <span style={{ marginLeft: '10px' }} />
      <TssIcon
        iconKey="tss_delete"
        title="Delete"
        iconProps={deleteIconProp}
        onClick={() => ShowDeleteModal(rowData)}
      />
    </div>
  );

  const customButtons = () => (
    <>
      <TssIcon iconKey="tss_add"     title="Add Mapping" onClick={LoadAddPage} />
      <span style={{ marginLeft: '10px' }} />
      <TssIcon iconKey="tss_refresh" title="Refresh"     onClick={GetMappingList} />
    </>
  );

  const tableHeadings = [
    { field: 'userId',      header: 'Account ID',   sortable: true },
    { field: 'userName',    header: 'Account Name', sortable: true },
    { field: 'tenantNames', header: 'Tenant(s)',    sortable: false, filter: false, body: (row) => (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {(row.tenantList || []).map((t) => (
          <span key={t.TENANT_ID} style={{
            display: 'inline-block', padding: '2px 8px', borderRadius: '12px',
            background: '#e3f2fd', color: '#1565c0', fontSize: '12px', whiteSpace: 'nowrap'
          }}>{t.TENANT_NAME}</span>
        ))}
      </div>
    )},
    { field: 'statusLabel', header: 'Status',       sortable: true },
    { field: 'actions',     header: '',             sortable: false, filter: false, body: rowButtons },
  ];

  const tableContent = mappingList.map((row) => ({
    userId:      row.USER_ID   || row.userId,
    userName:    row.USER_NAME || row.userName || '-',
    tenantNames: (row.TENANTS  || row.tenants  || []).map((t) => t.TENANT_NAME || t.tenantName).join(', '),
    tenantList:  row.TENANTS   || row.tenants  || [],
    statusLabel: (row.STATUS   ?? row.status) === 1 ? 'Active' : 'Inactive',
    _raw: row,
  }));

  return (
    <>
      <section className="content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-body d-flex align-items-center py-8">
              <div style={{ width: '100%' }}>
                <TssDataTable
                  moduleName="Tenant Mapping"
                  columnsDisplay={false}
                  columns={tableHeadings}
                  data={tableContent}
                  buttons={customButtons}
                  fileName="UserTenantMapping"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <TssModal
        modalId="userTenantDeleteModal"
        modalBodyId="userTenantDeleteBody"
        className="modal-md"
        header={`Delete Mapping: ${mappingToDelete?.userName || ''}`}
      >
        <div className="row">
          <div className="form-group col-md-12">
            <p>
              Are you sure you want to delete the mapping for account{' '}
              <strong>{mappingToDelete?.userName}</strong> — Tenant{' '}
              <strong>{mappingToDelete?.tenantName}</strong>?
            </p>
          </div>
        </div>
        <div className="row">
          <div className="form-group col-md-12 d-flex justify-content-end">
            <TssButton
              label="Confirm"
              onClick={() => confirmDelete(mappingToDelete)}
              {...cancelDeleteProp}
            />
            <TssButton
              label="Close"
              onClick={cancelDelete}
              {...cancelDeleteProp}
            />
          </div>
        </div>
      </TssModal>
    </>
  );
};

export default UserTenantMappingView;
