import React, { useEffect ,useState,useRef,useMemo} from "react";
import TssButton from '@modules/common/default/components/TssButton';
import TssTextArea from '@modules/common/default/components/TssTextArea';
import TssTextBox from '@modules/common/default/components/TssTextBox';
import TssSelectBox from '@modules/common/default/components/TssSelectBox';
import { TieredMenu } from 'primereact/tieredmenu';
import { Button } from 'primereact/button';
import $ from 'jquery';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { InputText } from 'primereact/inputtext'
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import TssIcon from '@modules/common/default/components/TssIcon';
import { useTranslation } from 'react-i18next';


const TssTable = ({ headers, rows,id="table",reportName="test" ,isDownloadRequired=true,isScrollBarRequired=true}) => {

  const [t]= useTranslation();
  const [tableId,setTableId]=useState("")
  
  const [searchText, setSearchText] = useState(""); 

  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);
  }


  const filteredRows = useMemo(() => {
  if (!searchText) return rows;

  const lower = searchText.toLowerCase();

  return rows.filter(row =>
    row.some(cell => {
      if (!cell?.content) return false;

      // Handle string
      if (typeof cell.content === "string") {
        return cell.content.toLowerCase().includes(lower);
      }

      // Handle numbers
      if (typeof cell.content === "number") {
        return String(cell.content).includes(lower);
      }

      // Handle React elements (Textbox / Checkbox etc.)
      if (typeof cell.content === "object") {
        const val =
          cell.content?.props?.value ??
          cell.content?.props?.children ??
          "";

        return String(val).toLowerCase().includes(lower);
      }

      return false;
    })
  );
}, [rows, searchText]);


  
  useEffect(()=>{
    setTableId(id)
  },[id])


  const menu = useRef(null);

  const clientName = localStorage.getItem("acctName")
  const date = new Date();
  const printDate = formatPrintDateTime(date);
  const printText = t("components.TssDataTable.downloadFileText.printText", { clientName: clientName, printDate: printDate });


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


  /////////////////*** PDF ***////////////////////
function downloadTableAsPDF() {
   const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a2',
  });

  doc.setFontSize(12);
  doc.text(reportName, 14, 20);

  doc.setFontSize(8);
  doc.text(printText, 14, 30);

  const tableElement = document.getElementById(tableId);

  doc.autoTable({
    html: tableElement,
    startY: 20,
    theme: 'grid',
    styles: {
          fontSize: 12,
          cellPadding:4,
          overflow: 'linebreak',
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 'auto' },
    },
    tableWidth: 'auto',
    margin: { top: 40 },
    pageBreak: 'auto',
  });

  doc.save(`${reportName}.pdf`);
}

  /////////////////*** CSV ***////////////////////

  function downloadTableAsCSV() {
    const table = document.getElementById(`${tableId}`);
    let csv = [];
    csv.push(`"${reportName}"`);
    csv.push(`"${printText}"`);
    csv.push('');

    let colSpans = [];

    for (let i = 0; i < table.rows.length; i++) {
        let row = [];
        let cols = table.rows[i].querySelectorAll('th');
        let colIndex = 0;
        let hasData = false;

        if (cols.length === 0) continue;

        for (let j = 0; j < cols.length; j++) {
            while (colSpans[colIndex]) {
                row.push('""');
                colSpans[colIndex]--;
                colIndex++;
            }
            row.push('"' + cols[j].innerText.replace(/"/g, '""') + '"');
            hasData = true;

            let colspan = cols[j].getAttribute('colspan');
            if (colspan) {
                colspan = parseInt(colspan);
                for (let k = 1; k < colspan; k++) {
                    row.push('""');
                }
                colIndex += colspan;
            } else {
                colIndex++;
            }

            let rowspan = cols[j].getAttribute('rowspan');
            if (rowspan) {
                rowspan = parseInt(rowspan);
                if (rowspan > 1) {
                    colSpans[colIndex - 1] = rowspan - 1;
                }
            }
        }

        if (hasData) {
            csv.push(row.join(','));
        }
    }

    for (let i = 0; i < table.rows.length; i++) {
        let row = [];
        let cols = table.rows[i].querySelectorAll('td');
        let hasData = false;

        for (let j = 0; j < cols.length; j++) {
            let cellValue = cols[j].innerText.trim();
            if (cellValue !== '') {
                hasData = true;
            }
            
            if (/^\d{10,}$/.test(cellValue)) {
                row.push('"`' + cellValue + '`"');
            } else {
                row.push('"' + cellValue.replace(/"/g, '""') + '"');
            }
        }

        if (hasData) {
            csv.push(row.join(','));
        }
    }

    const csvString = csv.join('\n');
    const utf8Bom = "\uFEFF";
    const blob = new Blob([utf8Bom + csvString], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = reportName + '.csv';

    link.click();
}

  /////////////////*** XLSX ***////////////////////

function downloadTableAsXLSX() {
  const table = document.getElementById(`${tableId}`);
  
  const data = [];

  data.push([reportName]);
  data.push([printText]);
  data.push([]); 

  let colSpans = [];

  for (let i = 0; i < table.rows.length; i++) {
      let row = [];
      let cols = table.rows[i].querySelectorAll('th');
      let colIndex = 0;
      let hasData = false;

      if (cols.length === 0) continue;

      for (let j = 0; j < cols.length; j++) {
          while (colSpans[colIndex]) {
              row.push(''); 
              colSpans[colIndex]--;
              colIndex++;
          }

          row.push(cols[j].innerText.replace(/"/g, '""'));
          hasData = true;

          let colspan = cols[j].getAttribute('colspan');
          if (colspan) {
              colspan = parseInt(colspan);
              for (let k = 1; k < colspan; k++) {
                  row.push(''); 
              }
              colIndex += colspan;
          } else {
              colIndex++;
          }

          let rowspan = cols[j].getAttribute('rowspan');
          if (rowspan) {
              rowspan = parseInt(rowspan);
              if (rowspan > 1) {
                  colSpans[colIndex - 1] = rowspan - 1; 
              }
          }
      }

      if (hasData) {
          data.push(row); 
      }
  }

  
  for (let i = 0; i < table.rows.length; i++) {
      let row = [];
      let cols = table.rows[i].querySelectorAll('td');
      let hasData = false;

      for (let j = 0; j < cols.length; j++) {
          let cellValue = cols[j].innerText.trim();
          if (cellValue !== '') {
              hasData = true;
          }
          
          row.push(cellValue.replace(/"/g, '""')); 
      }

      if (hasData) {
          data.push(row); 
      }
  }

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, `${reportName}.xlsx`);
}

  

   /////////////////*** COPY TO CLIPBOARD ***////////////////////
   const copyTableToClipboard = () => {
    const table = document.getElementById(`${tableId}`);
    if (!table) {
      return;
    }

    const tableData = [];
    const rows = table.querySelectorAll('tr');

    rows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      const rowData = Array.from(cells).map(cell => cell.innerText).join('\t');
      tableData.push(rowData);function downloadTableAsXLSX() {
        if (typeof XLSX === 'undefined') {
            return;
        }
    
        const table = document.getElementById(`${tableId}`);
        if (!table) {
            return;
        }
    
        const wb = XLSX.utils.book_new();
        const wsData = [
            [reportName],
            [printText],
            [],
        ];
    
        // Extract headers dynamically
        const headerRows = [];
        const headerRowElements = table.querySelectorAll('thead tr');
    
        headerRowElements.forEach(row => {
            const rowData = [];
            row.querySelectorAll('th').forEach(cell => {
                const colSpan = parseInt(cell.colSpan) || 1;
                rowData.push(cell.innerText.trim());
                for (let i = 1; i < colSpan; i++) {
                    rowData.push(""); // Placeholder for spanned headers
                }
            });
            headerRows.push(rowData);
        });
    
        // Add extracted headers to wsData
        headerRows.forEach(headerRow => wsData.push(headerRow));
    
        // Extract body rows
        const bodyRows = table.querySelectorAll('tbody tr');
        bodyRows.forEach(row => {
            const rowData = Array.from(row.querySelectorAll('td')).map(cell => cell.innerText.trim());
            wsData.push(rowData);
        });
    
        // Create worksheet and append to workbook
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
        // Generate and download the Excel file
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        function s2ab(s) {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < s.length; i++) {
                view[i] = s.charCodeAt(i) & 0xFF;
            }
            return buf;
        }
    
        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = reportName + '.xlsx';
        link.click();
    }
    
    });

    const tableText = tableData.join('\n');

    navigator.clipboard.writeText(tableText)
      .then(() => {
        Swal.fire({
          text: t('components.TssDataTable.copy.successText'),
          showConfirmButton: false, 
          timer: 2000
        });
      })
      .catch(err => {
        console.error('Failed to copy table to clipboard: ', err);
      });
  };
  
  /////////////////*** PRINT ***////////////////////
  function printTable() {

  
    const table = document.getElementById(`${tableId}`);
    if (!table) {
        return;
    }
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) {
        return;
    }

    printWindow.document.write(`<html><head><title>${reportName}</title>`);
    printWindow.document.write('<style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #e5e5e5; padding: 8px; text-align: left; }</style>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(`<h1>${reportName}</h1>`);
    printWindow.document.write(`<p>${printText}</p>`);
    printWindow.document.write(table.outerHTML);
    printWindow.document.write('</body></html>');

    printWindow.document.close();

    printWindow.onload = function() {
        printWindow.focus(); 
        printWindow.print(); 
    };
  }
  ///////////////////////////////////////////////////////////////////////////////////
  

  const downLoadItems = [
    {
      icon: <TssIcon iconKey="tss_copy" title={t('components.TssDataTable.title.download.copy')} />,
      command: (event) => copyTableToClipboard()
    },
    {
      icon: <TssIcon iconKey="tss_excel" title={t('components.TssDataTable.title.download.excel')} />,
      command: (event) => downloadTableAsXLSX()
    },
    {
      icon: <TssIcon iconKey="tss_pdf" title={t('components.TssDataTable.title.download.pdf')} />,
      command: (event) => downloadTableAsPDF()
    },
    {
      icon: <TssIcon iconKey="tss_csv" title={t('components.TssDataTable.title.download.csv')} />,
      command: (event) => downloadTableAsCSV()
    },
    {
      icon: <TssIcon iconKey="tss_print" title={t('components.TssDataTable.title.download.print')} />,
      command: (event) => printTable()
    }
  ];


  useEffect(()=>{
    setTableId(id)
  },[id])

  function downloadButton(tableID) {
    if(isDownloadRequired)
    {
    <div className="d-flex justify-content-end tss-pull right" style={{ position: 'relative' }}>
      <div className='horizontal-menu' style={{ display: 'flex', flexDirection: 'row', padding: '0 1rem', position: 'relative' }}>
        <TieredMenu className="customTMenu" model={downLoadItems} popup ref={menu} breakpoint="767px" style={{ display: 'flex', flexDirection: 'row', position: 'absolute' }} />
      </div>
      <Button className='tssDTDownloadBtn' icon={<TssIcon iconKey="tss_download" />} onClick={(e) => {menu.current.toggle(e); setTableId(tableID)}} style={{ background: 'none', border: 'none' }} />
    </div>
    }
   
    
  }
  return (
    <>
    <div className="mb-6 tss-pull-right mr-5" style={{ display: 'flex', alignItems: 'center'}}>
                 <span className="p-input-icon-left">
                  <IconField iconPosition="left" style={{ marginRight: '-40px'}}  >
                    <InputIcon className="pi pi-filter" />
                    <InputText value={searchText} onChange={handleSearch} placeholder={t('components.TssDataTable.placeholder.search')} style={{ borderRadius: '10px' }} />
                  </IconField>
    
                </span>
                
              </div>
              <br />

    <div className="mt-4 scrollbar" style={{width:"100%",overflowX:"auto",maxWidth:"100%",overflowY:"auto",maxHeight:isScrollBarRequired? "250px" : "",position:"relative",zIndex:"1"}}>
    <table id={tableId} className="tss-datatable tss-datatable-striped customTable" style={{width:"100%"}}>
      <thead className="tss-datatable-thead">
        {headers.map((headerRow, rowIndex) => (
          <tr className="tss-datatable-header tss-sortable-column" key={rowIndex}>
            {headerRow.map((header, cellIndex) => (
              <th
                style={{ textAlign: "center",fontWeight: 600,color:"white" }}
                key={cellIndex}
                colSpan={header.colSpan || 1}
                rowSpan={header.rowSpan || 1}
               >
                {header.label}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="tss-datatable-tbody" style={{overflow:"visible",zIndex:"1"}}>
        {filteredRows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td
		            style={{overflow:"visible",zIndex:"1"}}    
                key={cellIndex}
                colSpan={cell.colSpan || 1}
                rowSpan={cell.rowSpan || 1}
            
              >
                {cell.content}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    </>
  );
};

export default TssTable;
