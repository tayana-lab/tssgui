import React,{useState,useEffect} from 'react';
import TssDataTable from '@modules/common/default/components/TssDataTable';
import { Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSync  } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import TssIcon from '@modules/common/default/components/TssIcon';
const DemoView = ({ LoadAddPage ,deleteRow}) => {


  const [data, setData] = useState([]);
  const [t] = useTranslation();

  const buttons = (rowData) => {
  
    const disableButton = rowData.disableButton;
  
  
    // const handleEditClick=()=>{
    //  alert("clicked");
    // }
    // const handleDeleteClick=()=>{
    //   alert("deleted");
    // }


    return (
      <div style={{ textAlign: 'center' }}>
      
        <FontAwesomeIcon
          icon={faEdit}
          onClick={!disableButton ? LoadAddPage : undefined} 
          className={`tss-edit ${disableButton ? 'disabled' : ''}`}
          title={t("modules.Demo.TssDataTable.buttons.title.edit")}
          style={{ cursor: disableButton ? 'not-allowed' : 'pointer' }}
        />
        <span className="button-gap" style={{ marginLeft: '10px' }}></span>
        {/* Delete button with faTrash icon */}
        <FontAwesomeIcon
          icon={faTrash}
          onClick={!disableButton ? deleteRow : undefined}
          className={`tss-delete ${disableButton ? 'disabled' : ''}`}
          title={t('modules.Demo.TssDataTable.buttons.title.delete')}
          style={{ cursor: disableButton ? 'not-allowed' : 'pointer' }}
          data-target="#confirmationModal" 
          data-toggle="modal"
        />
      </div>
    );
  };
  
  const customButtons  = () => { 
    return (
         <>
 
          {/* <FontAwesomeIcon icon={faPlus} onClick={() => console.log('Button 1 clicked') } className="tss-add" title="Click to Add"/> */}
          <FontAwesomeIcon icon={faPlus} onClick={LoadAddPage} className="tss-add" title={t('modules.Demo.buttons.title.add')}/>
              <span className="button-gap" style={{ marginLeft: '10px' }}></span>
          <FontAwesomeIcon icon={faSync} onClick={() => console.log('Button 2 clicked') } className="tss-refresh" title={t('modules.Demo.buttons.title.refresh')}/>
  
         </>
  );
  };
  








  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://10.0.5.122:6443/api/data/for/getting/smsc/gateway/accounts');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const jsonData = await response.json();

      const dataWithDisabledButtons = jsonData.map((item) => {
        const disableButton = item.userName === 'admin'; 
        return {
          smscName: item.smscName,
          accountName: item.accountName,
          userName: item.userName,   
          noOfSessions: item.noOfSessions,
          shortCode: item.shortCode,
          regionName: item.regionName,
          disableButton: disableButton,
        };
      });   
      
     
      setData(dataWithDisabledButtons); // Update state with fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    console.log("coming...")
  };

  const columns = [
    { field: 'smscName', header: t('modules.Demo.TssDataTable.header.smscName'),fixed:true },
    { field: 'accountName', header: t('modules.Demo.TssDataTable.header.accountName') },
    { field: 'userName', header: t('modules.Demo.TssDataTable.header.userName')},
    { field: 'noOfSessions', header: t('modules.Demo.TssDataTable.header.noOfSessions')},
    { field: 'shortCode', header: t('modules.Demo.TssDataTable.header.shortCode') },
    { field: 'regionName', header: t('modules.Demo.TssDataTable.header.regionName')},
    {
      field: 'disableButton',
      header: '',
      sortable:false,
      filter:false,
      body: buttons
    },
  ];

  // const data = [
  //   { Name: 'John', Age: 25, disableButton: false }, // Example with button enabled
  //   { Name: 'Jane', Age: 30, disableButton: true }, // Example with button disabled
  //   // Add more data rows as needed
  // ];

  return (
   <div>
    <section className="content">
      <div className="container-fluid">
        <div className="card">
    <div className="card-body d-flex align-items-center py-8"> 
      <div style={{width:"100%"}}>
      <TssDataTable moduleName={t('modules.Demo.label')} columnsDisplay={false} columns={columns} data={data} buttons={customButtons}  fileName={"MyDataTable"} />
    </div>
    </div>
    </div>
    </div>
    </section>
    </div>
    
  );
};

export default DemoView;

