import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { MultiSelect } from 'primereact/multiselect'
import { Checkbox } from 'primereact/checkbox';

import { saveAs } from 'file-saver'
import { Dialog } from 'primereact/dialog';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { TieredMenu } from 'primereact/tieredmenu';
import '@modules/common/default/scss/TssDataTable.scss'
import TssIcon from '@modules/common/default/components/TssIcon';
import { useTranslation } from 'react-i18next';
import { tableCustomStyles } from './tableCustomStyles.jsx';
import config from '../../../conf/TssGui.json';
import { useDispatch, useSelector } from 'react-redux';
// import styles from './DataTable.module.css';

const TssReportDataTable = ({ moduleName, columnsDisplay, paginatorDisplay, globalFilterDisplay, downloadButtonDisplay, columns, data, pagination, buttons, fileName, showCBColumnSelection = false, selectedRows, setSelectedRows, rowUniqueId, fullScreenSupport, rowsGroupReq = false, rowGroupFeild, rowGroupHeaderFormat, moduleNameDisplayReq = true, spanFlag = false }) => {

  const [rows, setRows] = useState(5);
  const [first, setFirst] = useState(0);
  const [globalFilter, setGlobalFilter] = useState('');
  const fixedColumns = columns.filter(column => column.fixed && column.display !== 'none' && column.field !== rowGroupFeild);
  const nonFixedColumns = columns.filter(column => !column.fixed && column.display !== 'none' && column.field !== rowGroupFeild);
  const [selectedColumns, setSelectedColumns] = useState(nonFixedColumns);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const boxRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const dtRef = useRef(null);

  const menu = useRef(null);

  const test1 = useState(0);
  const [t] = useTranslation();

  const clientName = localStorage.getItem("acctName")

  const handleToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  const darkMode = useSelector((state) => state.ui.darkMode);
  const rowGroupProps = {};

  const headerTemplate = (data) => {

    const fieldName = rowGroupFeild;
    const fieldValue = data?.[fieldName];

    return (
      <div className='flex align-items-center gap-2' >
        <span className="font-bold">{fieldValue}</span>
      </div>
    );
  };

  if (rowsGroupReq) {
    rowGroupProps.rowGroupMode = "subheader";
    rowGroupProps.groupRowsBy = rowGroupFeild;
    rowGroupProps.sortField = rowGroupFeild;


    if (rowGroupHeaderFormat) {
      rowGroupProps.rowGroupHeaderTemplate = rowGroupHeaderFormat;
    }
    else {
      rowGroupProps.rowGroupHeaderTemplate = headerTemplate;

    }
  }



  function formatDate(date, format) {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    format = format.replace("YYYY", year);
    format = format.replace("MM", month);
    format = format.replace("DD", day);
    format = format.replace("HH", hours);
    format = format.replace("mm", minutes);
    format = format.replace("ss", seconds);

    return format;
  }
  function formatPrintDateTime(date) {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    const formattedDate = `${dayOfWeek} ${month} ${day} ${year} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
  }
  const date = new Date();

  const printDate = formatPrintDateTime(date);
  const printText = t("components.TssDataTable.downloadFileText.printText", { clientName: clientName, printDate: printDate });

  const formattedDate = formatDate(date, config.TssDataTable_Format);
  const fullFileName = fileName + "_" + formattedDate;
  const downLoadItems = [
    {
      icon: <TssIcon iconKey="tss_copy" title={t('components.TssDataTable.title.download.copy')} />,
      command: (event) => exportCopy()
    },
    {
      icon: <TssIcon iconKey="tss_excel" title={t('components.TssDataTable.title.download.excel')} />,
      command: (event) => exportExcel()
    },
    {
      icon: <TssIcon iconKey="tss_pdf" title={t('components.TssDataTable.title.download.pdf')} />,
      command: (event) => exportPdf()
    },
    {
      icon: <TssIcon iconKey="tss_csv" title={t('components.TssDataTable.title.download.csv')} />,
      command: (event) => exportCSV(false)
    },
    {
      icon: <TssIcon iconKey="tss_print" title={t('components.TssDataTable.title.download.print')} />,
      command: (event) => exportPrint()
    }
  ];

  const handleGlobalFilterChange = (event) => {
    setGlobalFilter(event.target.value);
  };

  const handleRowsPerPageChange = (event) => {
    setRows(event.target.value);
  };


  const onColumnToggle = (event) => {
    const selectedColumnFields = event.value;
    const orderedSelectedColumns = nonFixedColumns.filter(col => selectedColumnFields.includes(col.field));
    setSelectedColumns(orderedSelectedColumns);
  };

const customHeaderTemplate = (column,index) => {
    const columnDef = columns.find(col => col.field === column.field);
    const colspan = spanFlag ? columnDef?.colspan || 1 : 1;
    const rowspan = spanFlag ? columnDef?.rowspan || 1 : 1;

    return (
        <th key={`${column.field}-${index}`} colSpan={colspan} rowSpan={rowspan}>
            {columnDef?.header || column.header}
        </th>
    );
};

  const customBodyTemplate = (rowData, column) => {
        const columnDef = columns.find(col => col.field === column.field);
        const colspan = spanFlag ? columnDef?.colspan || 1 : 1;
        const rowspan = spanFlag ? columnDef?.rowspan || 1 : 1;

        return (
            <td colSpan={colspan} rowSpan={rowspan}>
                {rowData[column.field]}
            </td>
        );
  };

  const columnComponents = selectedColumns.map((col, index) => {

    return <Column
      key={`${col.field}-${index}`}
      field={col.field}
      header={spanFlag ? customHeaderTemplate(col,index) : col.header}
      sortable={col.sortable !== false}
      filter={col.filter !== false}
      style={col.style}
      className={col.className}
      body={spanFlag ? customBodyTemplate :col.body} />;
  });

  const renderHeader = () => {
    return (
    
      <div className={`flex justify-content-between align-items-center ${darkMode? 'datatable-dark' : ''}`}  style={{ display: 'flex', alignItems: 'center' }} >

        {moduleNameDisplayReq !== false && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className={`p-datatable-modulename ${darkMode ? 'datatable-inner-dark' : ''}`} >{moduleName}</span>
          </div>
        )}

        <div className='mt-2' style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
          {/* Columns Part Start*/}
          {columnsDisplay !== false && (
            <div style={{ textAlign: 'left', marginRight: '10px' }}>
              <span>{t('components.TssDataTable.pagination.label.columns')}</span>
              <MultiSelect value={selectedColumns} options={nonFixedColumns} optionLabel="header" onChange={onColumnToggle} style={{ width: '10em', borderRadius: '10px' }} filter placeholder="Select Columns" maxSelectedLabels={3} />
            </div>
          )}
          {/* Columns Part End*/}

          {/* Paginator Part Start  */}
          {paginatorDisplay !== false && pagination !== false && (
            <div className={`rows-per-page-options ${darkMode ? 'pegi-dark' : ''}`} >
              <PaginatorRowsPerPageOptions rowsPerPageOptions={[5, 10, 20, -1]} handleRowsPerPageChange={handleRowsPerPageChange} rows />
            </div>
          )}
          {/* Paginator Part End */}
          {/* Filter Part Start */}
          {globalFilterDisplay !== false && (
            <span className="p-input-icon-left">
              <IconField iconPosition="left" style={{ marginLeft: '10px' }}  >
                <InputIcon className="pi pi-filter" />
                <InputText className={`${darkMode ? 'pegi-dark-one' : ''}`} value={globalFilter} onChange={handleGlobalFilterChange} placeholder={t('components.TssDataTable.placeholder.search')} style={{ borderRadius: '10px' }} />
              </IconField>

            </span>
          )}
          {/* Filter Part End */}

          <div className='button-container' style={{ display: 'flex', alignItems: 'center' }}>
            {buttons && buttons()}


            {downloadButtonDisplay !== false && (
              <div className="flex justify-content-center" >
                <div className='horizontal-menu'  style={{ display: 'flex', flexDirection: 'row', padding: '0 1rem' }} >
                  <TieredMenu model={downLoadItems} popup ref={menu} breakpoint="767px" style={{ display: 'flex', flexDirection: 'row' }} />
                </div>
                <Button className={`tssDTDownloadBtn ${darkMode? 'down-btn-dark' : ''}`}    icon={<TssIcon iconKey="tss_download" />} onClick={(e) => menu.current.toggle(e)} style={{ background: 'none', border: 'none' }} />
              </div>
            )}
            {fullScreenSupport === true && (<>
              <span className="button-gap" style={{ marginLeft: '8px' }}></span>
              <TssIcon className='toggle-expand-btn'    onClick={handleToggle} iconKey={isFullscreen ? "tss_minimize" : "tss_maximize"} title={t('components.TssDataTable.title.fullScreen')} />
            </>)}

            <div>
              <Dialog showHeader={false} visible={visible} modal style={{ width: '25%' }} onHide={() => setVisible(false)} >
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', marginTop: '40px' }}>
                  <p style={{ fontSize: '1.2rem' }}>{message}</p>
                </div>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
      
    )
  }


  const exportCopy = () => {
    if (!dtRef) {
      console.error("DataTable reference is not yet initialized.");
      return;
    }

    const allRows = dtRef.current.props.value;
    if (!allRows || allRows.length === 0) {
      console.warn("No rows to copy.");
      return;
    }

    const headers = columns.map(col => col.header);
    const headerRow = headers.join('\t');
    const fields = columns.filter(col => col.header).map(col => col.field);
    const dataRows = allRows.map(row => {
      return fields.map(field => {
        return row[field];
      }).join('\t');
    });

    const textToCopy = [headerRow, ...dataRows].join('\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => showAlert('success', t("components.TssDataTable.copy.successText")))
        .catch(err => {
          console.error('Could not copy rows: ', err);
          showAlert('error', t("components.TssDataTable.copy.failureText"));
        });
    } else {
      copyTextFallback(textToCopy);
    }
  };

  const copyTextFallback = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      showAlert('success', t("components.TssDataTable.copy.successText"));
    } catch (err) {
      console.error('Could not copy rows: ', err);
      showAlert('error', t("components.TssDataTable.copy.failureText"));
    }
    document.body.removeChild(textArea);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [visible]);


  const showAlert = (type, message) => {
    setMessage(message);
    setVisible(true);
  }


  const getDataTableContent = () => {
    const dataTableElement = document.querySelector('.datatable-container .p-datatable-scrollable-body');

    if (dataTableElement) {
      const clonedDataTable = dataTableElement.cloneNode(true);
      return clonedDataTable.innerHTML;
    } else {
      console.error("DataTable element not found.");
      return null;
    }

  };
  const exportPrint = () => {

    const headers = columns.filter(col => col.header).map(col => col.header);
    const fields = columns.filter(col => col.header).map(col => col.field);

    const printData = dtRef.current.props.value;

    const dataRows = printData.map(row => {
      const filteredRow = {};
      fields.forEach(field => {
        filteredRow[field] = row[field];
      });
      return filteredRow;
    });

    // Construct HTML table structure
    const tableContent = `
     <html>
     <head>
     <title>${moduleName}</title>
		  <style>
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid black;
          padding: 8px;
          text-align: left;
        }
	.dtMiddleAllign > tr {
		text-align: center;
	}
      </style>

     </head>
                 <body>
		  	<table className='dtMiddleAllign'>
		  		<tr>
		  			${moduleName}
		  		</tr>
		  	</table > 
		  	<table >
				<tr>
		  			${printText}
		  		</tr>
		  	</table >
                     <table >
                         <thead >
    		{ columns.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((header, colIndex) => (
			 return (
                            <th
                                key={`${rowIndex}-${colIndex}`}
                                colSpan={parseInt(header.colspan, 10)}
                                rowSpan={parseInt(header.rowspan, 10)}
                            >
                                {header.header}
                            </th>
			 );
                        ))}
                    </tr>
                ))}

                         </thead>
                         <tbody>
		  	       ${dataRows.map(row => `<tr>${fields.map(field => `<td>${row[field]}</td>`).join('')}</tr>`).join('')}
                         </tbody>
                     </table>
                 </body>
       </html>
        `;

    // Open a new window with the HTML content
    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(tableContent);
    printWindow.document.close();

    printWindow.print();

    const intervalId = setInterval(() => {
      if (printWindow.closed) {
        clearInterval(intervalId);
      } else if (!printWindow.document.hidden) {
        printWindow.close();
        clearInterval(intervalId);
      }
    }, 1);
  };

  const exportCSV = (selectionOnly) => {

    const headers = columns.map(col => col.header);
    const headerRow = headers.join(',');

    const fields = columns.filter(col => col.header).map(col => col.field);

    const csvData = dtRef.current.props.value;

    const dataRows = csvData.map(row => {
      return fields.map(field => {
        return row[field];
      }).join(',');
    });

    const textToCsvData = [headerRow, ...dataRows].join('\n');

    if (textToCsvData) {
      const blob = new Blob([textToCsvData], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, fullFileName + '.csv');
    } else {
      console.error("CSV data is undefined. Check the exportCSV method implementation.");
    }
  };

  const exportColumns = columns.map((col) => ({ title: col.header, dataKey: col.field }));

  const exportPdf = () => {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then(() => {
        const doc = new jsPDF.default();

        const headers = columns.map(col => col.header);
        const fields = columns.filter(col => col.header).map(col => col.field);
        const pdfData = dtRef.current.props.value;
        const dataRows = pdfData.map(row => {
          return fields.map(field => {
            return row[field];
          });
        });
        doc.autoTable({
          head: [headers],
          body: dataRows,
        });
        doc.save(fullFileName + '.pdf');
      });
    });
  };

  const exportExcel = () => {
    import('xlsx').then((xlsx) => {

      const headers = columns.map(col => col.header);
      const fields = columns.filter(col => col.header).map(col => col.field);
      const excelData = dtRef.current.props.value;
      const dataRows = excelData.map(row => {
        const rowData = {};
        fields.forEach(field => {
          rowData[field] = row[field];
        });
        return Object.values(rowData);
      });

      const excelData1 = [headers, ...dataRows];
      const worksheet = xlsx.utils.aoa_to_sheet(excelData1);

      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      saveAsExcelFile(excelBuffer);
    });
  };

  const saveAsExcelFile = (buffer) => {
    import('file-saver').then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data = new Blob([buffer], {
          type: EXCEL_TYPE
        });

        module.default.saveAs(data, fullFileName + EXCEL_EXTENSION);
      }
    });
  };


  const handlePageChange = (event) => {
    setFirst(event.first);
  };

  const filteredData = data.filter(item => {
    return Object.values(item).some(val =>
      val && val.toString().toLowerCase().includes(globalFilter.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / rows);

  const paginatorTemplate = totalPages > 1 ? "CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink" : "";


  const customEmptyMessage = () => {
    if (globalFilter) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <span>{t('components.TssDataTable.placeholder.emptyMessage')}</span>
        </div>
      );

    } else {
      return null;
    }
  }


  const header = renderHeader();

  return (

    <div className={`card no-border datatable-header ${isFullscreen ? 'panel-fullscreen' : ''} ${darkMode? 'datatable-dark' : 'datatable-header'}`}  ref={boxRef} >
      <DataTable
        ref={dtRef}
        rowHover
        scrollable
        scrollHeight="50vh"
        header={header}
        size="small"
        showGridlines
        stripedRows
        removableSort
        responsiveLayout="scroll"
        value={filteredData}
        paginator={pagination !== false && totalPages > 1}
        rows={rows}
        first={first}
        onPage={handlePageChange}
        paginatorTemplate={paginatorTemplate}
        currentPageReportTemplate={`${t('components.TssDataTable.pagination.label.showing')} {first} ${t('components.TssDataTable.pagination.label.to')} {last} ${t('components.TssDataTable.pagination.label.of')} {totalRecords} ${t('components.TssDataTable.pagination.label.entries')}`}
        emptyMessage={customEmptyMessage}
        style={{ width: '100%', height: '50%', zIndex: "1" }}
        selection={showCBColumnSelection ? selectedRows : null}
        onSelectionChange={showCBColumnSelection ? setSelectedRows : null}
        selectionMode={showCBColumnSelection ? 'checkbox' : null}
        dataKey={rowUniqueId}

        {...rowGroupProps}

      >
        {showCBColumnSelection && (
          <Column
            selectionMode="multiple"
            headerStyle={{ width: '3rem' }}
          />
        )}

        {/* {columns.map(column => ( */}
        {fixedColumns.map(column => (
          <Column
            key={column.field}
            field={column.field}
            header={column.header}
            sortable={column.sortable !== false}
            filter={column.filter !== false}
            style={column.style}
            className={column.className}
            body={column.body}
          // Add more properties as needed
          />
        ))}
        {columnComponents}
      </DataTable>
    </div>
  );
};

const PaginatorRowsPerPageOptions = ({ rowsPerPageOptions, handleRowsPerPageChange, rows }) => {
  const [t] = useTranslation();
  return (
    <div className="rows-per-page-options-container"   style={{ display: 'flex', alignItems: 'center' }}>
      <span>{t('components.TssDataTable.pagination.label.show')}</span>
      <select className="p-inputtext p-component"   defaultValue={rows} onChange={handleRowsPerPageChange} style={{ marginLeft: '2px', appearance: 'auto', borderRadius: '10px' }} >
        {rowsPerPageOptions.map(option => (
          <option key={option} value={option} style={{ 'color': 'red' }}>{option === -1 ? t("components.TssDataTable.pagination.label.all") : option}</option>
        ))}
      </select>
      <span>&nbsp;{t('components.TssDataTable.pagination.label.entries')}</span>
    </div>
  );
};



export default TssReportDataTable;
