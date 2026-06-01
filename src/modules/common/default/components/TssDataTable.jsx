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
import { isValidElement } from "react";

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
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import store from '../store/store.ts'; 


const TssDataTable = ({ moduleName, columnsDisplay, paginatorDisplay, globalFilterDisplay, downloadButtonDisplay, columns, data, pagination, buttons, fileName, showCBColumnSelection = false, selectedRows, setSelectedRows, rowUniqueId, fullScreenSupport, rowsGroupReq = false, rowGroupFeild, rowGroupHeaderFormat, moduleNameDisplayReq = true ,defaultSortField, defaultSortOrder=1}) => {

  const [rows, setRows] = useState(10);
  const [first, setFirst] = useState(0);
  const [globalFilter, setGlobalFilter] = useState('');
  const fixedColumns = columns.filter(column => column.fixed && column.display !== 'none' && column.field !== rowGroupFeild);
  const nonFixedColumns = columns.filter(column => !column.fixed && column.display !== 'none' && column.field !== rowGroupFeild);
 const columnsOptions = columns.filter(column => !column.fixed && column.display !== 'none' && column.field !== rowGroupFeild && column.field !== 'disableButton');
  const [selectedColumns, setSelectedColumns] = useState(nonFixedColumns);
  const [visible, setVisible] = useState(false);
  const [selectedColumnsOptions, setSelectedColumnsOptions] = useState(columnsOptions);
  const [message, setMessage] = useState('');
  const disableButtonColumns = columns.filter(column => column.field === 'disableButton');
  const boxRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [filteredValue, setFilteredValue] = useState(null);
  const [filters, setFilters] = useState(null); 
  const [tableSortedData,setTableSortedData] = useState([]);
//const [sortField, setSortField] = useState(null);
//const [sortOrder, setSortOrder] = useState();

const [sortField, setSortField] = useState(() => {
 if (rowsGroupReq) return rowGroupFeild;
  if (defaultSortField) return defaultSortField;

	return null;

//  const firstSortableCol =
  //  fixedColumns.find(c => c.sortable !== false) ||
 //   nonFixedColumns.find(c => c.sortable !== false);

  //return firstSortableCol ? firstSortableCol.field : null;
});
//const [sortOrder, setSortOrder] = useState(defaultSortOrder);
const [sortOrder, setSortOrder] = useState(
  rowsGroupReq || defaultSortField ? defaultSortOrder : null
   );


const url = config.SERVER_JS_API_URI;



  useEffect(() => {
  const columnFields = columns.map(element=>element.field);
  const defaultFilters = {
    global: { value: null, matchMode: "contains" },
  };

  columnFields.forEach(field => {
    defaultFilters[field] = {
      operator: "and",
      constraints: [{ value: null, matchMode: "contains" }],
    };
  });

  setFilters(defaultFilters);
  setFilteredValue(data);
}, [data]);

  const dtRef = useRef(null);

  const menu = useRef(null);

  const test1 = useState(0);
  const [t] = useTranslation();

  const clientName = localStorage.getItem("acctName")

  const handleToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  const darkMode = useSelector((state) => state.ui.darkMode);
  const tableProps = {};

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
    tableProps.rowGroupMode = "subheader";
    tableProps.groupRowsBy = rowGroupFeild;
    tableProps.sortField = rowGroupFeild;

    if (rowGroupHeaderFormat) {
      tableProps.rowGroupHeaderTemplate = rowGroupHeaderFormat;
    }
    else {
      tableProps.rowGroupHeaderTemplate = headerTemplate;

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
  const selectedColumnFields = event.value.map(col => col.field);
    const orderedSelectedColumns = nonFixedColumns.filter(col => selectedColumnFields.includes(col.field));
    setSelectedColumns([...orderedSelectedColumns, ...disableButtonColumns]);
    setSelectedColumnsOptions(orderedSelectedColumns);
  };

  const columnComponents = selectedColumns.map(col => {

    return <Column
      key={col.field}
      field={col.field}
      header={col.header ? col.header : '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'}
      sortable={col.sortable !== false}
      filter={col.filter !== false}
      style={col.style}
      className={col.className}
      body={col.body} />;
  });

useEffect(() => {
        const handleScroll = () => {
                if (menu.current) {
                        menu.current.hide();
                }
        };

        window.addEventListener('scroll', handleScroll, true);

        window.addEventListener('resize', handleScroll);

        return () => {
                window.removeEventListener('scroll', handleScroll, true);
                window.removeEventListener('resize', handleScroll, true);

        };
}, []);


  const renderHeader = () => {
    return (
    
      <div className="flex justify-content-between align-items-center"  style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }} >

        {moduleNameDisplayReq !== false && (
            <div>
             <h5 className=" menu-header" style={{fontWeight: 'bold',  textAlign: 'left' }} >{moduleName}</h5>
            </div>
        )}
	<div  style={{width:'2%'}}></div>
        <div className='mt-2' style={{  display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flex: '0 0 auto'  }}>
          {/* Columns Part Start*/}
          {columnsDisplay !== false && (
            <div style={{ textAlign: 'left', marginRight: '10px' }}>
              <span>{t('components.TssDataTable.pagination.label.columns')}</span>
              <MultiSelect value={selectedColumnsOptions} options={columnsOptions} optionLabel="header" onChange={onColumnToggle} style={{ width: '10em', borderRadius: '10px' }} filter placeholder="Select Columns" maxSelectedLabels={3} />
            </div>
          )}
          {/* Columns Part End*/}

          {/* Paginator Part Start  */}
          {paginatorDisplay !== false && pagination !== false && (
            <div className='rows-per-page-options' >
              <PaginatorRowsPerPageOptions rowsPerPageOptions={[10,20,50,100,-1]} handleRowsPerPageChange={handleRowsPerPageChange} rows />
            </div>
          )}
          {/* Paginator Part End */}
          {/* Filter Part Start */}
          {globalFilterDisplay !== false && (
            <span className="p-input-icon-left">
              <IconField iconPosition="left" style={{ marginLeft: '10px' }}  >
                <InputIcon className="pi pi-search" />
                <InputText value={globalFilter} onChange={handleGlobalFilterChange} placeholder={t('components.TssDataTable.placeholder.search')} style={{ borderRadius: '10px' }} />
              </IconField>

            </span>
          )}
          {/* Filter Part End */}
          <div className="ml-2"/>
          <div className='button-container' style={{ display: 'flex', alignItems: 'center' }}>
            {buttons && buttons()}


            {downloadButtonDisplay !== false && (
              <div className="flex justify-content-center" >
                <div className='horizontal-menu'  style={{ display: 'flex', flexDirection: 'row', padding: '0 1rem' }} >
                  <TieredMenu model={downLoadItems} popup ref={menu} breakpoint="767px" style={{ display: 'flex', flexDirection: 'row' }} />
                </div>
                <Button className='tssDTDownloadBtn'  title={t('modules.Generic.buttons.title.download')}  icon={<TssIcon iconKey="tss_download" />} onClick={(e) => menu.current.toggle(e)} style={{ background: 'none', border: 'none' }} />
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

    //const allRows = dtRef.current.props.value;
const dt = dtRef.current;

const fullData = dt?.props?.value;

const allRows = filteredValue ?? fullData ?? [];


    if (!allRows || allRows.length === 0) {
      console.warn("No rows to copy.");
      return;
    }
const visibleColumns = columns.filter(col => col.header && col.header.trim() !== '');

    const headers = visibleColumns.map(col => col.header);
    const headerRow = headers.join('\t');
    const fields = columns.filter(col => col.header).map(col => col.field);
    const tableRows = tableSortedData.length>0 ? tableSortedData : allRows;
    const dataRows = tableRows.map(row => {
      return fields.map(field => {
        return getPlainText (row[field]);
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
  const visibleColumns = columns.filter(col => col.header && col.header.trim() !== '');

  const headers = visibleColumns.map(col => col.header);
  const fields = visibleColumns.map(col => col.field);

  const dt = dtRef.current;

  // Take filtered data if exists, else full data
  const baseData = filteredValue ?? dt?.props?.value ?? [];

  // Apply sorting if available
  let printData = [...baseData];
  if (sortField) {
    printData.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === 'string') {
        return valA.localeCompare(valB) * sortOrder;
      }

      return (valA - valB) * sortOrder;
    });
  }

  // Prepare data rows
  const dataRows = printData.map(row => {
    const filteredRow = {};
    fields.forEach(field => {
      filteredRow[field] = getPlainText(row[field]);
    });
    return filteredRow;
  });

let moduleNameStr = getPlainText (moduleName);

  // Construct HTML
  const tableContent = `
    <html>
    <head>
      <title>${moduleNameStr}</title>
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
      <table class='dtMiddleAllign'>
        <tr><td>${moduleNameStr}</td></tr>
      </table>
      <table>
        <tr><td>${printText}</td></tr>
      </table>
      <table>
        <thead>
          <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${dataRows.map(row => `<tr>${fields.map(field => `<td>${row[field]}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

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

/*	
  const exportCSV = (selectionOnly) => {

    const visibleColumns = columns.filter(col => col.header && col.header.trim() !== '');
    const headers = visibleColumns.map(col => col.header);
    const headerRow = headers.join(',');

    const fields = columns.filter(col => col.header).map(col => col.field);

    //const csvData = dtRef.current.props.value;


const dt = dtRef.current;

//const filteredData = dt?.props?.filteredValue;
const fullData = dt?.props?.value;

const csvData = filteredValue ?? fullData ?? [];



    const dataRows = csvData.map(row => {
      return fields.map(field => {
        //return getPlainText(row[field]);
	       const cell = getPlainText(row[field]);
               return escapeCsvValue(cell);
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
*/
const exportCSV = () => {


  const dt = dtRef.current;

const fullData = dt?.props?.value;

  let csvData = filteredValue ?? filteredData ?? fullData ?? [];

  // Apply sort manually (same logic as PDF)
  if (sortField) {
    csvData = [...csvData].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      // Handle null or undefined
      if (valA == null) return 1;
      if (valB == null) return -1;

      // Sort strings
      if (typeof valA === 'string') {
        return valA.localeCompare(valB) * sortOrder;
      }

      // Sort numbers or other types
      return (valA - valB) * sortOrder;
    });
  }

  const visibleColumns = columns.filter(
    col => col.header && col.header.trim() !== ''
  );
  const headers = visibleColumns.map(col => col.header);
  const fields = visibleColumns.map(col => col.field);

 const fieldTypeByField = visibleColumns.reduce((acc, col) => {
                if (col.fieldType) {
                        acc[col.field] = String(col.fieldType).toUpperCase();
                }
                return acc;
        }, {});

  const headerRow = headers.join(',');
  const dataRows = csvData.map(row =>
    fields
      .map(field => {
        let cell = getPlainText(row[field]);
	      const fieldType = fieldTypeByField[field];
              if (fieldType) {
                      switch (fieldType) {
                              case 'TEXT':
                              case 'STRING':
                                      cell =  '\u200C' + cell ;
                                      break;
                              default:
                                      break;

                      }
              }
	
        return escapeCsvValue(cell);
      })
      .join(',')
  );

  const csvContent = [headerRow, ...dataRows].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8'
  });
  saveAs(blob, fullFileName + '.csv');
};




  const exportColumns = columns.map((col) => ({ title: col.header, dataKey: col.field }));


const exportPdf = async  () => {

 const visibleColumns = columns.filter(col => col.header && col.header.trim() !== '');
      const headers = visibleColumns.map(col => col.header);
      const fields = visibleColumns.map(col => col.field);
  const dt = dtRef.current;

const fullData = dt?.props?.value;
      // ✅ this will now reflect exactly what is shown
      let exportRows = filteredValue ?? filteredData ?? fullData ?? [];

      if (sortField) {
        exportRows = [...exportRows].sort((a, b) => {
          const valA = a[sortField], valB = b[sortField];
          if (valA == null) return 1;
          if (valB == null) return -1;
          return typeof valA === 'string'
            ? valA.localeCompare(valB) * sortOrder
            : (valA - valB) * sortOrder;
        });
      }

      const dataRows = exportRows.map(row =>
        fields.map(field => getPlainText(row[field]))
      );

const response = await fetch(`${url}/tssgui/exportTssDataTablePdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "headers":headers, "dataRows":dataRows, "fileName": fullFileName }),
  });

if (!response.ok) {
    console.error('Failed to generate PDF');
    return;
  }

  const blob = await response.blob();
  const urlObj = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = urlObj;
  link.download = `${fullFileName}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(urlObj);

};

const exportPdf_1 = () => {
  import('jspdf').then((module) => {
	const { default: jsPDF } = module;
    import('jspdf-autotable').then(() => {
//      const doc = new jsPDF.default();

const doc = new jsPDF({
  orientation: "landscape",
  unit: "pt",   // points (better control for AutoTable)
  format: "a4"
});

      const visibleColumns = columns.filter(col => col.header && col.header.trim() !== '');
      const headers = visibleColumns.map(col => col.header);
      const fields = visibleColumns.map(col => col.field);
  const dt = dtRef.current;

const fullData = dt?.props?.value;
      // ✅ this will now reflect exactly what is shown
      let exportRows = filteredValue ?? filteredData ?? fullData ?? [];

      if (sortField) {
        exportRows = [...exportRows].sort((a, b) => {
          const valA = a[sortField], valB = b[sortField];
          if (valA == null) return 1;
          if (valB == null) return -1;
          return typeof valA === 'string'
            ? valA.localeCompare(valB) * sortOrder
            : (valA - valB) * sortOrder;
        });
      }

      const dataRows = exportRows.map(row =>
        fields.map(field => getPlainText(row[field]))
      );

const pageWidth = doc.internal.pageSize.getWidth();
const pageMargin = 60; // left + right margin

const colCount = headers.length;
const colWidth = (pageWidth - pageMargin) / colCount;

      doc.autoTable({
        head: [headers],
        body: dataRows,
margin: { left: 30, right: 30 },
  styles: {
    fontSize: 8,
    cellPadding: 3,
    halign: 'center',
    valign: 'middle',
    overflow: 'linebreak', // default for body
          breakWord: true,
  },
  headStyles: {
    fontStyle: 'bold',
    halign: 'center',
    valign: 'middle',
    cellWidth: colWidth,
    overflow: 'linebreak',
          breakWord: true,
  },
  didParseCell: function (data) {
    if (data.section === 'head') {
      // allow header to wrap
      data.cell.styles.overflow = 'linebreak';
             data.cell.styles.breakWord = true;
      data.cell.styles.cellWidth = colWidth;
    } else if (data.section === 'body') {
      // keep row content in single line
      data.cell.styles.overflow = 'linebreak';
             data.cell.styles.breakWord = true;
      data.cell.styles.cellWidth = colWidth;
    }
  }
});

      doc.save(fullFileName + '.pdf');
    });
  });
};


const exportExcel = () => {
  import('xlsx').then((xlsx) => {
    const visibleColumns = columns.filter(col => col.header && col.header.trim() !== '');
    const headers = visibleColumns.map(col => col.header);
    const fields = visibleColumns.map(col => col.field);

    const fieldTypeMap = visibleColumns.reduce((acc, col, idx) => {
		    if (col.fieldType)
		    {
		    acc[idx] = col.fieldType;
		    }
		    return acc;
        }, {});


    const dt = dtRef.current;

    // 🔹 Correct handling of filtering
const fullData = dt?.props?.value;

let excelData =  filteredValue ?? filteredData ?? fullData ?? [];

    // 🔹 Apply sorting if available
    const sortField = dt?.props?.sortField;
    const sortOrder = dt?.props?.sortOrder ?? 1;

    if (sortField) {
      excelData = [...excelData].sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];

        if (valA == null) return 1;
        if (valB == null) return -1;

        if (typeof valA === "string") {
          return valA.localeCompare(valB) * sortOrder;
        }
        return (valA - valB) * sortOrder;
      });
    }

    const dataRows = excelData.map(row => {
      const rowData = {};
      fields.forEach(field => {
        rowData[field] = getPlainText(row[field]);
      });
      return Object.values(rowData);
    });

    const excelData1 = [headers, ...dataRows];
    const worksheet = xlsx.utils.aoa_to_sheet(excelData1);

	       Object.keys(worksheet).forEach(cell => {
                  if (cell[0] === '!') return;

                  const colIndex = xlsx.utils.decode_cell(cell).c;
                  const fieldType = fieldTypeMap[colIndex];

                  if (!fieldType) return; // only columns WITH fieldType

                  const cellObj = worksheet[cell];

                 const normalizedFieldType = String(fieldType).toUpperCase();

                  switch (normalizedFieldType) {
                          case 'TEXT':
                          case 'STRING':
                                  cellObj.v = String(cellObj.v ?? '');
                                  cellObj.t = 's';
                                  cellObj.z = '@';
                                  break;

                          case 'NUMBER':
                                  cellObj.v = Number(cellObj.v);
                                  cellObj.t = 'n';
                                  break;

                          case 'DATE':
                          case 'DATETIME':
                                          if (cellObj.v) {
                                                  const d = new Date(cellObj.v);
                                                  cellObj.v = d;
                                                  cellObj.t = 'n';
                                          }
                                  break;

                          default:
                                  // leave untouched
                                  break;
                }
});

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


const renderWithProvider = (component) => (
		<Provider store={store}>
		{component}
		</Provider>
);

const getPlainString = (html) => {
	html = html.replace(/<br\s*\/?>/gi, '\n').trim();
	const tempElement = document.createElement('div');
	tempElement.innerHTML = html;
	return tempElement.textContent || tempElement.innerText || '';
};

const escapeCsvValue = (value) => {
  if (value == null) return '';

  const str = String(value);

  if (str.includes('"')) {
    // Escape double quotes by doubling them
    return `"${str.replace(/"/g, '""')}"`;
  }

  if (str.includes(',') || str.includes('\n') || str.includes('\r')) {
    // Wrap in quotes if comma, newline, or carriage return present
    return `"${str}"`;
  }

  return str;
};


const getPlainText = (htmlString) => {
    if (typeof htmlString !== 'string' && !React.isValidElement(htmlString)) {
        htmlString = JSON.stringify(htmlString); 
    }

    const htmlStr = ReactDOMServer.renderToStaticMarkup(renderWithProvider(htmlString));
    let plainText = getPlainString(htmlStr);

    if (plainText === '') {
        if (htmlStr.indexOf("tss-validIcon") >= 0)
            plainText = t("components.TssDataTable.downloadFileText.tss-validIcon");
        else if (htmlStr.indexOf("tss-inValidIcon") >= 0)
            plainText = t("components.TssDataTable.downloadFileText.tss-inValidIcon");
    }

    return plainText;
};




  const handlePageChange = (event) => {
    setFirst(event.first);
  };

const globalSearchColumns = columns.filter(
  col => col.header && col.header.trim() !== ''
);

  const filteredData = data.filter(item => {
    /*return Object.values(item).some(val =>
      val && val.toString().toLowerCase().includes(globalFilter.toLowerCase())
    );*/

return globalSearchColumns.some(col => {
                  const value = item[col.field];
                  return (
                          value != null &&
                          value.toString().toLowerCase().includes(globalFilter.toLowerCase())
                  );
          })

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

/*
const onFilter = (e) => {
  setFilters(e.filters);

  const filters = e.filters;
  const filtered = filteredData.filter(row => {
    return Object.entries(filters).every(([field, meta]) => {
      const value = meta?.constraints?.[0]?.value;
      const matchMode = meta?.constraints?.[0]?.matchMode;

      if (!value) return true; // No filter for this field

      const rowValue = (row[field] ?? '').toString().toLowerCase();
      const filterVal = value.toString().toLowerCase();

      switch (matchMode) {
        case 'startsWith':
          return rowValue.startsWith(filterVal);
        case 'contains':
          return rowValue.includes(filterVal);
        case 'endsWith':
          return rowValue.endsWith(filterVal);
        case 'equals':
          return rowValue === filterVal;
        case 'notEquals':
          return rowValue !== filterVal;
        case 'in':
          return Array.isArray(filterVal) ? filterVal.includes(rowValue) : false;
        default:
          return true;
      }
    });
  });

  setFilteredValue(filtered);
};
*/

const onFilter = (e) => {
  setFilters(e.filters);

  // Always filter from the original data prop
  const filtered = data.filter(row => {
    return Object.entries(e.filters).every(([field, meta]) => {
      const constraint = meta?.constraints?.[0];
      const value = constraint?.value;
      const matchMode = constraint?.matchMode;

      if (!value) return true;

      if (field === 'global') {
        return Object.values(row).some(cellVal =>
          (cellVal ?? '').toString().toLowerCase().includes(value.toLowerCase())
        );
      }

      const rowValue = (row[field] ?? '').toString().toLowerCase();
      const filterVal = value.toString().toLowerCase();

      switch (matchMode) {
        case 'startsWith':
          return rowValue.startsWith(filterVal);
        case 'contains':
          return rowValue.includes(filterVal);
        case 'endsWith':
          return rowValue.endsWith(filterVal);
        case 'equals':
          return rowValue === filterVal;
        case 'notEquals':
          return rowValue !== filterVal;
        case 'in':
          return Array.isArray(filterVal) ? filterVal.includes(rowValue) : false;
        default:
          return true;
      }
    });
  });

  setFilteredValue(filtered);   // ✅ now always updated
};

const getSortPlainText = (val) => {
    if (val === null || val === undefined) return "";

    if (isValidElement(val)) {
        try {
            if (typeof val.props.children === "string") {
                return val.props.children;
            }
            if (Array.isArray(val.props.children)) {
                return val.props.children.join(" ");
            }
            return JSON.stringify(val.props.children) || "";
        } catch {
            return "";
        }
    }

    return val.toString();
};

const customSort = (e) => {
 if (!e.sortField) {
       setSortField(null);
       setSortOrder(null);
       setTableSortedData(filteredData);   // restore original data
       return;
   }

    setSortField(e.sortField);
    setSortOrder(e.sortOrder);

    const original = filteredData;

    const sorted = [...original].sort((a, b) => {
        let v1 = getSortPlainText(a[e.sortField]);
        let v2 = getSortPlainText(b[e.sortField]);

        if (typeof v1 === "string") v1 = v1.toLowerCase();
        if (typeof v2 === "string") v2 = v2.toLowerCase();

        if (v1 > v2) return e.sortOrder;
        if (v1 < v2) return -e.sortOrder;
        return 0;
    });

    setTableSortedData(sorted);
};

const prevFilteredRef = useRef(filteredData);

useEffect(() => {
    if (
        prevFilteredRef.current === filteredData ||
        (prevFilteredRef.current?.length === filteredData?.length &&
         prevFilteredRef.current?.every((v, i) => v === filteredData[i]))
    ) {
        return;
   }

    prevFilteredRef.current = filteredData;
    setTableSortedData(filteredData);
}, [filteredData]);

useEffect(() => {
    setTableSortedData(filteredData);
}, []);



  const header = renderHeader();
  return (

    <div className={`card no-border datatable-header ${isFullscreen ? 'panel-fullscreen' : ''} ${darkMode? 'datatable-dark' : 'datatable-header'}`}  ref={boxRef} >
      <DataTable
        ref={dtRef}
	reorderableColumns
        rowHover
        header={header}
        size="small"
        stripedRows
        removableSort
        responsiveLayout="scroll"
        //value={filteredData}
        paginator={pagination !== false && totalPages > 1}
        rows={rows}
        first={first}
        onPage={handlePageChange}
        paginatorTemplate={paginatorTemplate}
        currentPageReportTemplate={`${t('components.TssDataTable.pagination.label.showing')} {first} ${t('components.TssDataTable.pagination.label.to')} {last} ${t('components.TssDataTable.pagination.label.of')} {totalRecords} ${t('components.TssDataTable.pagination.label.entries')}`}
        emptyMessage={customEmptyMessage}
        style={{ width: '100%', zIndex: "1" }}
        selection={showCBColumnSelection ? selectedRows : null}
        onSelectionChange={showCBColumnSelection ? setSelectedRows : null}
        selectionMode={showCBColumnSelection ? 'checkbox' : null}
        dataKey={rowUniqueId}
//         tableStyle={{ tableLayout: 'fixed' }}
	  resizableColumns={false}
        {...tableProps}
value={tableSortedData}
	 //   value={filteredData}   // show filtered rows or full data
  filters={filters}                       // active filters state
onFilter={onFilter}
  sortField={sortField}
  sortOrder={sortOrder}
 // onSort={(e) => {
 //   setSortField(e.sortField);
 //   setSortOrder(e.sortOrder);
 // }}
onSort={customSort}

       //   onValueChange={(sortedData) => setTableSortedData(sortedData)} 
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
	    header={column.header ? column.header : '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'}
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



export default TssDataTable;
