import React from 'react';
import TssDataTable from '@app/modules/common/default/components/TssDataTable';
import TssIcon from '@app/modules/common/default/components/TssIcon';
import TssModal from '@app/modules/common/default/components/TssModal';
import TssButton from '@app/modules/common/default/components/TssButton';
import { useTranslation } from 'react-i18next';

const TenantMappingView = ({
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
    'data-target': '#mappingDeleteModal',
    'data-dismiss': 'modal',
  };

  const deleteIconProp = {
    'data-target': '#mappingDeleteModal',
    'data-toggle': 'modal',
  };

  const rowButtons = (rowData) => (
    <div>
      <TssIcon
        iconKey="tss_edit"
        title="Edit"
        onClick={() => ShowModifyPage(rowData)}
      />
      <span className="button-gap" style={{ marginLeft: '10px' }} />
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
      <span className="button-gap" style={{ marginLeft: '10px' }} />
      <TssIcon iconKey="tss_refresh" title="Refresh"     onClick={GetMappingList} />
    </>
  );

  const tableHeadings = [
    { field: 'mappingId',   header: 'Mapping ID',   sortable: true },
    { field: 'tenantName',  header: 'Tenant Name',  sortable: true },
    { field: 'tenantCode',  header: 'Tenant Code',  sortable: true },
    { field: 'productName', header: 'Product Name', sortable: true },
    { field: 'actions',     header: '', sortable: false, filter: false, body: rowButtons },
  ];

  const tableContent = mappingList.map((row) => ({
    mappingId:   row.MAPPING_ID   || row.mappingId,
    tenantName:  row.TENANT_NAME  || row.tenantName,
    tenantCode:  row.TENANT_CODE  || row.tenantCode,
    productName: row.PRODUCT_NAME || row.productName || '-',
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
                  fileName="TenantMapping"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <TssModal
        modalId="mappingDeleteModal"
        modalBodyId="mappingDeleteBody"
        className="modal-md"
        header={`Delete Mapping: ${mappingToDelete?.tenantName || ''}`}
      >
        <div className="row">
          <div className="form-group col-md-12">
            <p>Are you sure you want to delete the mapping for tenant <strong>{mappingToDelete?.tenantName}</strong>?</p>
          </div>
        </div>
        <div className="row mt-3">
          <div className="form-group col-md-12 d-flex justify-content-end tss-pull-right">
            <TssButton
              label="Confirm"
              onClick={() => confirmDelete(mappingToDelete)}
            />
            <TssButton
              label="Close"
              btnProps={cancelDeleteProp}
              onClick={cancelDelete}
            />
          </div>
        </div>
      </TssModal>
    </>
  );
};

export default TenantMappingView;
