import React from 'react';
import TssDataTable from '@app/modules/common/default/components/TssDataTable';
import TssIcon from '@app/modules/common/default/components/TssIcon';
import TssModal from '@app/modules/common/default/components/TssModal';
import TssButton from '@app/modules/common/default/components/TssButton';
import { useTranslation } from 'react-i18next';

const dialCodeMap = {
  US: '+1', IN: '+91', UK: '+44', AU: '+61', CA: '+1',
  DE: '+49', FR: '+33', JP: '+81', CN: '+86', SG: '+65',
  AE: '+971', NZ: '+64', ZA: '+27', BR: '+55', MX: '+52',
};

const TenantCreationView = ({
  tenantList,
  LoadAddPage,
  ShowModifyPage,
  GetTenantList,
  ShowDeleteModal,
  tenantToDelete,
  cancelDelete,
  confirmDelete,
}) => {
  const [t] = useTranslation();

  const cancelDeleteProp = {
    'data-target': '#tenantDeleteModal',
    'data-dismiss': 'modal',
  };

  const deleteIconProp = {
    'data-target': '#tenantDeleteModal',
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
      <TssIcon iconKey="tss_add"     title="Add Tenant" onClick={LoadAddPage} />
      <span className="button-gap" style={{ marginLeft: '10px' }} />
      <TssIcon iconKey="tss_refresh" title="Refresh"    onClick={GetTenantList} />
    </>
  );

  const tableHeadings = [
    { field: 'tenantId',        header: 'Tenant ID',           sortable: true  },
    { field: 'tenantName',      header: 'Tenant Name',         sortable: true  },
    { field: 'tenantCode',      header: 'Tenant Code',         sortable: true  },
    { field: 'domainName',      header: 'Domain Name',         sortable: true  },
    { field: 'subDomain',       header: 'Sub Domain',          sortable: true  },
    { field: 'defaultCc',       header: 'Country Code',        sortable: true  },

    { field: 'statusLabel',     header: 'Status',              sortable: true  },
    { field: 'actions',         header: '',  sortable: false, filter: false, body: rowButtons },
  ];

  const tableContent = tenantList.map((row) => ({
    tenantId:        row.TENANT_ID          || row.tenantId,
    tenantName:      row.TENANT_NAME        || row.tenantName,
    tenantCode:      row.TENANT_CODE        || row.tenantCode,
    domainName:      row.DOMAIN_NAME        || row.domainName        || '-',
    subDomain:       row.SUB_DOMAIN         || row.subDomain         || '-',
    defaultCc: (() => { const cc = row.DEFAULT_CC || row.defaultCc || ''; return cc ? (dialCodeMap[cc.toUpperCase()] || cc) : '-'; })(),

    statusLabel:     (row.STATUS ?? row.status) === 1 ? 'Active' : (row.STATUS ?? row.status) === 0 ? 'Inactive' : 'Deleted',
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
                  moduleName="Tenant Creation"
                  columnsDisplay={false}
                  columns={tableHeadings}
                  data={tableContent}
                  buttons={customButtons}
                  fileName="TenantCreation"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <TssModal
        modalId="tenantDeleteModal"
        modalBodyId="tenantDeleteBody"
        className="modal-md"
        header={`Delete Tenant: ${tenantToDelete?.tenantName || ''}`}
      >
        <div className="row">
          <div className="form-group col-md-12">
            <p>Are you sure you want to delete tenant <strong>{tenantToDelete?.tenantName}</strong>?</p>
          </div>
        </div>
        <div className="row mt-3">
          <div className="form-group col-md-12 d-flex justify-content-end tss-pull-right">
            <TssButton
              label="Confirm"
              onClick={() => confirmDelete(tenantToDelete)}
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

export default TenantCreationView;
