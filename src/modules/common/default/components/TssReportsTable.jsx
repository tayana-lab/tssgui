import React, { useEffect ,useState,useRef} from "react";
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

const TssReportsTable = ({tableHeader=()=>{},tableBody=()=>{},tableFooter=()=>{},id="",reportName=""}) => {

  const [t]= useTranslation();
  const [tableId,setTableId]=useState("")
  const [searchText, setSearchText] = useState(""); 
  const [originalBodyData, setOriginalBodyData] = useState([]); 
  const [filteredBody, setFilteredBody] = useState([]); 
  const menu = useRef(null);

  const clientName = localStorage.getItem("acctName")
  const date = new Date();
  const printDate = formatPrintDateTime(date);
  const printText = t("components.TssDataTable.downloadFileText.printText", { clientName: clientName, printDate: printDate });


  useEffect(() => {
    filterTableBody(); 
  }, [searchText]);

  useEffect(() => {
  const body = tableBody(); 
  if (Array.isArray(body)) {
    setOriginalBodyData(body);
    setFilteredBody(body);
  } else if (body && body.props && Array.isArray(body.props.children)) {
    setOriginalBodyData(body.props.children);
    setFilteredBody(body.props.children);
  } else {
    setOriginalBodyData([]);
    setFilteredBody([]);
  }
}, [tableBody]);


  const filterTableBody = () => {
  if (!Array.isArray(originalBodyData) || originalBodyData.length === 0) return;

  const lowerSearchText = searchText.toLowerCase();

  const filtered = originalBodyData.filter((row) =>
    row.props.children.some((cell) => {
      const cellValue = cell.props.children;

      if (typeof cellValue === "string") return cellValue.toLowerCase().includes(lowerSearchText);

      if (cellValue && cellValue.props && typeof cellValue.props.children === "string") {
        return cellValue.props.children.toLowerCase().includes(lowerSearchText);
      }

      return false;
    })
  );

  setFilteredBody(filtered);
};

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };
  
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

   const spaceAfterText = 50; 
   const startYPosition = 30 + spaceAfterText; 
 
   const tableElement = document.getElementById(tableId);
 
   doc.autoTable({
     html: tableElement,
     startY: startYPosition,
     theme: 'grid',
     styles: {
           fontSize: 12,
           cellPadding:4,
           overflow: 'linebreak',
     },
     headStyles: {
      lineWidth: 0.2,
      lineColor: [255, 255, 255],
      halign: 'center',
      valign: 'middle',
    },
     columnStyles: {
       0: { cellWidth: 'auto' },
       1: { cellWidth: 'auto' },
     },
     footStyles: {
      lineWidth: 0.2,
      lineColor: [255, 255, 255],
      halign: 'center',
      valign: 'middle',
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

    // 🔹 Header rows
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

            let cellText = cols[j].innerText.replace(/"/g, '""');

      
           if (/^[+-]/.test(cellText)) {
                cellText = "'" + cellText;  
            }
            row.push('"' + cellText + '"');
            hasData = true;

            let colspan = cols[j].getAttribute('colspan');
            if (colspan) {
                colspan = parseInt(colspan);
                // for (let k = 1; k < colspan; k++) {
                //     row.push('""');   // keep column alignment
                // }
                // colIndex += colspan;
                colIndex++;
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

    // 🔹 Data rows
    for (let i = 0; i < table.rows.length; i++) {
        let row = [];
        let cols = table.rows[i].querySelectorAll('td');
        let hasData = false;

        for (let j = 0; j < cols.length; j++) {
            let cellValue = cols[j].innerText.trim();

            if (cellValue !== '') {
                hasData = true;
            }

      
            if (/^[+-]/.test(cellValue)) {
                cellValue = '"' + cellValue + '"';  
            }

            if (/^\d{10,}$/.test(cellValue)) {
                row.push('"\t' + cellValue + '"');
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
              // for (let k = 1; k < colspan; k++) {
              //     row.push(''); 
              // }
              //colIndex += colspan;
               colIndex++;
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
      tableData.push(rowData);
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
    printWindow.document.write(`<br/>`);
    printWindow.document.write(`<br/>`);
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
    return (
    <div className="d-flex justify-content-end tss-pull right" style={{ position: 'relative' }}>
      <div className='horizontal-menu' style={{ display: 'flex', flexDirection: 'row', padding: '0 1rem', position: 'relative' }}>
        <TieredMenu className="customTMenu" model={downLoadItems} popup ref={menu} breakpoint="767px" style={{ display: 'flex', flexDirection: 'row', position: 'absolute' }} />
      </div>
      <Button className='tssDTDownloadBtn' icon={<TssIcon iconKey="tss_download" />} onClick={(e) => {menu.current.toggle(e); setTableId(tableID)}} style={{ background: 'none', border: 'none' }} />
    </div>
    )
  }
  return (
    
    <>
    
         <div className="ml-auto mb-6 tss-pull-right" style={{ display: 'flex', alignItems: 'center',marginLeft:"10%"}}>
             <span className="p-input-icon-left">
              <IconField iconPosition="left" style={{ marginRight: '-40px'}}  >
                <InputIcon className="pi pi-filter" />
                <InputText value={searchText} onChange={handleSearch} placeholder={t('components.TssDataTable.placeholder.search')} style={{ borderRadius: '10px' }} />
              </IconField>

            </span>
            {downloadButton(tableId)}
          </div>
          <br />

         <div  className="mt-4 scrollbar" style={{overflowX:"auto",width:"100%",maxWidth:"100%",position:"relative"}}>
         <table id={tableId} className="tss-datatable tss-datatable-striped customTable" style={{width:"100%"}}>
            <thead className="tss-datatable-thead">
              {tableHeader()}
            </thead>
            <tbody className="tss-datatable-tbody">
              {filteredBody} 
            </tbody>
            <tfoot className="tss-datatable-tfoot">
              {tableFooter()}
            </tfoot>
          </table>
          </div>
      </>
   
  );
};

export default TssReportsTable;
