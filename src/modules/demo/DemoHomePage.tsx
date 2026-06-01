import React,{useState, useEffect} from 'react';
import TssDataTable from '@modules/common/default/components/TssDataTable';
import { Button } from 'primereact/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSync  } from '@fortawesome/free-solid-svg-icons';
import FormElements from './FormElements';
import conf from '@modules/conf/TssGui.json'
import TssButton from '@modules/common/default/components/TssButton'
import TssModal from '@modules/common/default/components/TssModal'
import TssPanel from '@modules/common/default/components/TssPanel'
import AccountsMain from './Demo';
import TssIcon  from '@modules/common/default/components/TssIcon'

// import {
//   CCard,
//   CCardBody,
//   CCardGroup,
//   CCardHeader,
//   CCol,
//   CLink,
//   CRow,
//   CWidgetStatsB,
//   CWidgetStatsC,
//   CWidgetStatsE,
//   CWidgetStatsF,
// } from '@coreui/react'


const smscApiUrl = conf.SMSC_API_URI;
const DemoHomePage = () => {

  const [clickCount, setClickCount] = useState(1);
   const [content, setContent] = useState([]);

  const [showAddPage, setShowAddPage] = useState(false);
  const [data, setData] = useState([]);
const handleButtonClick = () => {
    // Increment the click count
    setClickCount(prevCount => prevCount + 1);
    setContent(prevContent => [...prevContent, <div key={clickCount+1}>Repeated Content {clickCount + 1} <button onClick={() => deleteRow(clickCount+1)}>Delete</button></div>]);

  };

  const deleteRow = (index) => {
    setContent(prevContent => prevContent.filter((item, i) => i !== index));
  };

  const [selectedRows, setSelectedRows] = useState([]);

  // Event handler for checkbox selection
  const onCheckboxSelect = (e) => {
    setSelectedRows(e.value);
  };

useEffect(() =>{
	console.log (" selectedRows : "+  selectedRows );
},[selectedRows]);

 const renderContent = () => {
    const contentSet = [];
    for (let i = 0; i < clickCount&&i<=10; i++) {
      // Push the content to the array
      contentSet.push(
        <div key={i}>

          <label>Repeated Content {i + 1}</label>
		<button onClick={() => deleteRow(i)}>Delete</button>
        </div>
      );
    }
    return contentSet;
  };

  useEffect(() =>{
    const fetchData = async () =>{    
      try {
        const response = await fetch(smscApiUrl + '/api/data/for/getting/smsc/gateway/accounts'); 
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setData(data);
        console.log('Data fetched successfully:', data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      };
      fetchData();
  },[]);


  
  const products = data.map(item => ({
    //accountId: item.accountId,   
    // protocol: item.protocol,
    smscName: item.smscName,
    accountName: item.accountName,
    userName: item.userName,   
    noOfSessions: item.noOfSessions,
    shortCode: item.shortCode,
    regionName: item.regionName,
  }));

  const columns = [
    // { field: 'accountId', header: 'Account ID' , sortable: true , fixed:true},
    // { field: 'protocol', header: 'Protocol', sortable: true  },   
    { field: 'smscName', header: 'Smsc Name', sortable: true  , fixed:true },
    { field: 'accountName', header: 'Account Name', sortable: true  },
    { field: 'userName', header: 'User Name', sortable: true  },
    { field: 'noOfSessions', header: 'No of Sessions', sortable: true  },
    { field: 'shortCode', header: 'Short Code', sortable: true  },
    { field: 'regionName', header: 'Region Name', sortable: true  }
  ];

const customButtonTemplate = (rowData) => {
 return (
	<>

	 <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit(rowData)} className="tss-edit" />
 	     <span className="button-gap" style={{ marginLeft: '10px' }}></span>
    <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(rowData)} className="tss-delete" />
	
	</>
 );
};


const handleDelete = (rowData) => {

};
 const handleEdit = (rowData) => {
console.log( rowData );

};

const myButtonClick = () => {
console.log("AAAAAAAAAAAA");

};

const btnProps = {
"data-target" : "#myFirstModal" ,
"data-toggle" : "modal"

};

const buttons  = () => { 
	 return (
        <>

<TssButton id="myModalButton" type="button" label="open Modal" btnProps={btnProps} classname="tss-primary-btn"/>
         {/* <FontAwesomeIcon icon={faPlus} onClick={() => console.log('Button 1 clicked') } className="tss-add" title="Click to Add"/> */}
         <FontAwesomeIcon icon={faPlus} onClick={LoadAddPage} className="tss-add" title="Click to Add"/>
             <span className="button-gap" style={{ marginLeft: '10px' }}></span>
         <FontAwesomeIcon icon={faSync} onClick={() => console.log('Button 2 clicked') } className="tss-refresh" />

        </>
 );
};

const LoadAddPage = () => {
  setShowAddPage(true);
}

  return (
	//  <CCard className="mb-4">
  //     <CCardBody>

  <>
  {showAddPage &&(  
    <div className="card mb-12">
    <div className="card-body d-flex align-items-center py-8">
    
      <FormElements/>   
    </div>
    </div>         
  )}


   <div className="card mb-12">
    <div className="card-body d-flex align-items-center py-8"> 
      <div style={{width:'100%'}} >
          <TssDataTable data={products} columns={columns} customButton={customButtonTemplate} buttons={buttons} moduleName="SMSC Gateway Accounts" fileName={"MyDataTable_"+new Date().getTime()} showSelectionColumn={true} setSelectedRows={onCheckboxSelect} />
        </div>
    </div>

{/*
<div className="card-body "> 
 <div>
        {content}

      <button onClick={handleButtonClick}>Add Content</button>
    </div>

<TssPanel
panelId="myFirstPanel"
panelBodyId="myFirstPanelBody"
collapseReq={true}
isCollapsed={false}
header={
	<>
		<label><input type="checkbox" /></label> &nbsp; &nbsp; &nbsp;
		<label> test </label>

	</>
}
className="tss-info-panel" 
>
<TssIcon iconKey="tss_add" className="tss-primary-icon"/>
<TssIcon iconKey="tss_edit" className="tss-danger-icon"  onClickFun={myButtonClick}/>

</TssPanel>
</div>
 */}
  </div> 


 <TssModal
          modalId="myFirstModal"
          modalBodyId="myModalBody"
	  className="modal-lg"
        >
	 <AccountsMain/>
        </TssModal>
 
    </>
//  </CCardBody>
//     </CCard>


  );
};

export default DemoHomePage;

