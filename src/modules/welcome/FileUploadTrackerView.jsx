import React,{useState,useEffect} from 'react';
import TssDataTable from '@app/modules/common/default/components/TssDataTable';
import TssModal from '@app/modules/common/default/components/TssModal';
import TssIcon from '@app/modules/common/default/components/TssIcon';
import TssTextBox from '@app/modules/common/default/components/TssTextBox';
import TssButton from '@app/modules/common/default/components/TssButton';
import TssDatePicker from '@modules/common/default/components/TssDatePicker';
import TssInputGroup from '@modules/common/default/components/TssInputGroup';
import TssCircularProgressBar from '@modules/common/default/components/TssCircularProgressBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { faPlus, faSync } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
const FileUploadTrackerView = ({ FileUploadTrackerList, ChangeFDate, ChangeTDate, FDate, TDate, TransId, GetFileUploadDetails, ChangeTime, ShowTrackerDetails, handleDownload }) => {


  const [data, setData] = useState([]);
  const [t] = useTranslation();

  const darkMode = useSelector((state) => state.ui.darkMode);
    const startDate =[
          <TssDatePicker label={t("modules.FileUploadTracker.filter.fDate")} mandatory = {true} defaultValue={FDate} showTime={true} onChange={ChangeFDate} maxDaysFromToday={0}/>
    ]
    const PredefinedOp =[
        <div className="dropdown" >
            <a className='tss-anchor dropdown-toggle' href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">Predefined</a>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <li onClick={() => {ChangeTime(1)}}><a className="dropdown-item" href="#">Last 1 Hour</a></li>
                <li onClick={() => {ChangeTime(2)}}><a className="dropdown-item" href="#">Last 6 Hours</a></li>
                <li onClick={() => {ChangeTime(3)}}><a className="dropdown-item" href="#">Today</a></li>
                <li onClick={() => {ChangeTime(4)}}><a className="dropdown-item" href="#">Yesterday</a></li>
                <li onClick={() => {ChangeTime(5)}}><a className="dropdown-item" href="#">Last 7 Days</a></li>
                <li onClick={() => {ChangeTime(6)}}><a className="dropdown-item" href="#">Last 30 Days</a></li>
                <li onClick={() => {ChangeTime(7)}}><a className="dropdown-item" href="#">This Month</a></li>
            </ul>
        </div>

    ]
    const endDate =[
          <TssDatePicker label={t("modules.tracker.filter.tDate")} mandatory = {true} defaultValue={TDate} showTime={true} onChange={ChangeTDate} maxDaysFromToday={0}/>
    ]

   const txnIdProp = {
        onChange : TransId
    }

    const SearchOp =[
       <TssIcon iconKey="tss_search" className='tss-search' onClick={() => GetFileUploadDetails()} title={t("modules.Generic.buttons.title.search")} />
    ]

  const buttons = (rowData) => {
    const disableButton = rowData.disableButton || (parseInt(rowData.modulePerm) & 8) != 8; 
    return (
      <div>
      
        <TssIcon iconKey="tss_edit" onClick={() => (parseInt(rowData.modulePerm) & 1) == 1 || (parseInt(rowData.modulePerm) & 2) == 2?ShowFileUploadTrackerModifyPage(rowData):""} title={t("modules.Generic.TssDataTable.button.title.edit")} />
        <span className="button-gap" style={{ marginLeft: '10px' }}></span>
        <TssIcon iconKey="tss_delete" onClick={() => {ShowDeleteFileUploadTrackerModal(rowData);}}  iconProps={!disableButton && (parseInt(rowData.modulePerm) & 8) == 8?deleteProp:""} isDisabled={disableButton} title={t('modules.Generic.TssDataTable.button.title.delete')} />
      </div>
    );
  };
  
  const customButtons  = () => {
    return (
         <>
	  <TssIcon iconKey="tss_refresh" onClick={GetFileUploadDetails} title={t('modules.Generic.buttons.title.refresh')}/>
         </>
    );
  };
  
  const tableHeadings = [
    { field: 'time', header: t('modules.FileUploadTracker.viewPage.TssDataTable.header.time'),fixed:true },
    { field: 'fileName', header: t('modules.FileUploadTracker.viewPage.TssDataTable.header.fileName') },
    { field: 'txnId', header: t('modules.FileUploadTracker.viewPage.TssDataTable.header.txnId')},
    { field: 'uploadedBy', header: t('modules.FileUploadTracker.viewPage.TssDataTable.header.uploadedBy')},
    { field: 'submitted', header: t('modules.FileUploadTracker.viewPage.TssDataTable.header.submitted') },
    { field: 'processed', header: t('modules.FileUploadTracker.viewPage.TssDataTable.header.processed') },
    { field: 'dropped', header: t('modules.FileUploadTracker.viewPage.TssDataTable.header.dropped') },
    { field: 'rejected', header: t('modules.FileUploadTracker.viewPage.TssDataTable.header.rejected')},
    { field: 'status', header: t('modules.FileUploadTracker.viewPage.TssDataTable.header.status')},
  ];

const tableContent = FileUploadTrackerList?.map(fileUploadDetails => {
  const { submitted, processed, dropped, rejected, status } = fileUploadDetails;

  // Calculate % only if status is 2 and submitted > 0
  const percent =  ((processed + dropped + rejected) / submitted) * 100;

  return {
    time: fileUploadDetails.time,
    fileName: (
      <span
        style={{ color: '#1976d2', cursor: 'pointer' }}
        onClick={() => handleDownload(fileUploadDetails.txnId+"."+fileUploadDetails.extension, fileUploadDetails.fileName)}
      >
        {fileUploadDetails.fileName}
      </span>
    ),
    txnId : fileUploadDetails.txnId,
    uploadedBy: fileUploadDetails.uploadedBy,
    submitted : fileUploadDetails.submitted,
    processed : fileUploadDetails.processed,
    dropped : fileUploadDetails.dropped,
    rejected : fileUploadDetails.rejected,
    status: status === 2 && submitted > 0 ? (<div className='nav-item mt-2' onClick={() => handleDownload("/processed/"+fileUploadDetails.txnId+"_Result.txt",fileUploadDetails.txnId+"_Result.txt")} style={{cursor:"pointer"}} title={t('modules.Generic.buttons.title.download')} >
       <div >
        <TssIcon iconKey='tss_download' />
       </div>
      </div>
	) : (<TssCircularProgressBar progress={percent} />)
  };
});

  /*const tableContent = FileUploadTrackerList?.map(fileUploadDetails => ({
	time : fileUploadDetails.time,
        fileName: fileUploadDetails.fileName,
        txnId : fileUploadDetails.txnId,
        uploadedBy : fileUploadDetails.uploadedBy,
        submitted : fileUploadDetails.submitted,
        processed : fileUploadDetails.processed,
        dropped : fileUploadDetails.dropped,
	rejected: fileUploadDetails.rejected,
	status: fileUploadDetails.status == 2 ?((fileUploadDetails.processed+fileUploadDetails.dropped+fileUploadDetails.rejected)/fileUploadDetails.submitted) * 100+" %":0
  }));*/


  return (
   <>
    <section className="content">
     <div >
      <div className="card">
       <div className="card-body align-items-center py-8">
        <div className="row ">
         <div className='form-group col-md-4'>
          <TssTextBox  placeholderName={t("modules.FileUploadTracker.filter.txnId")}  label={t("modules.FileUploadTracker.filter.txnId")} mandatory={false} properties={txnIdProp} />
         </div>
         <div className='form-group col-md-4'>
          <TssInputGroup  mandatory={false} inputElement={startDate} appendElements={PredefinedOp}/>
         </div>
         <div className='form-group col-md-4'>
          <TssInputGroup  mandatory={false} inputElement={endDate} appendElements={SearchOp}/>
         </div>
        </div>
        </div>
      </div>
      </div>
    </section>

    {ShowTrackerDetails && (
    <div className="card">
        <div className="card-body align-items-center py-8">
            <div className="row">
                <div className='form-group col-md-12'>
                <TssDataTable moduleName={t('modules.FileUploadTracker.viewPage.label')} columnsDisplay={false} columns={tableHeadings} data={tableContent}  fileName={t('modules.FileUploadTracker.viewPage.fileName')} />
                </div>
            </div>
        </div>
    </div>
   )}

   </>
  )
}

export default FileUploadTrackerView;

