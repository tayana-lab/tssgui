import React,{useState,useEffect} from 'react';
import TssDatePicker from '@modules/common/default/components/TssDatePicker';
import TssSelectBox from '@modules/common/default/components/TssSelectBox';
import TssDataTable from '@app/modules/common/default/components/TssDataTable';
import TssIcon from '@app/modules/common/default/components/TssIcon';
import TssInputGroup from '@modules/common/default/components/TssInputGroup'
import { useTranslation } from 'react-i18next';
import tssguiConf from '@app/modules/conf/TssGui.json';
import { useDispatch, useSelector } from 'react-redux';

const dateFormat="Y-m-d H:i:S";

const AuditTrackerView = ({AuditTrackerList,ProductList, AccountList, EventList, ChangeProduct ,ChangeAccount, ChangeEvent, ChangeFDate, ChangeTDate, ModifiedAccount, Event, FDate, TDate, GetAuditTrackerDetails, ShowAuditDetails, ChangeTime,Product }) => {
  const [t]                             = useTranslation();

  var colmdVal = "6";

  const prodId = tssguiConf.PRODUCT_ID;

  if(prodId == 0){
     colmdVal = "4";
  }

  const tableHeadings = [
    { field: 'time', header: t('modules.tracker.auditTracker.viewPage.TssDataTable.header.time'),fixed:true },
    { field: 'account', header: t('modules.tracker.auditTracker.viewPage.TssDataTable.header.account') },
    { field: 'event', header: t('modules.tracker.auditTracker.viewPage.TssDataTable.header.event')},
    { field: 'state', header: t('modules.tracker.auditTracker.viewPage.TssDataTable.header.state')},
    { field: 'ip', header: t('modules.tracker.auditTracker.viewPage.TssDataTable.header.ip')},
    { field: 'sessionId', header: t('modules.tracker.auditTracker.viewPage.TssDataTable.header.sessionId')},
  ];

   if (prodId == 0){
        tableHeadings.splice(2, 0, {
            field: 'product',
            header: t('modules.tracker.auditTracker.viewPage.TssDataTable.header.product'),
            sortable: true,
            filter: true
        });
    }



  const tableContent = AuditTrackerList.map(auditTracker => ({
        time : auditTracker.modifiedTime,
        account : auditTracker.modifierName,
        product : auditTracker.productName,
        event : auditTracker.eventName,
        state : auditTracker.status,
        ip : auditTracker.modifierIp,
        sessionId : auditTracker.sessionId
  }));
	const darkMode = useSelector((state) => state.ui.darkMode);
    const startDate =[
          <TssDatePicker label={t("modules.tracker.filter.fDate")} mandatory = {true} defaultValue={FDate} showTime={true} onChange={ChangeFDate} maxDaysFromToday={0}/>
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
    const SearchOp =[
       <TssIcon iconKey="tss_search" className='tss-search' onClick={() => GetAuditTrackerDetails()} title={t("modules.Generic.TssDataTable.button.title.search")} />
    ]
  
return (
   <>
    <section className="content">
     <div >
      <div className="card">
       <div className="card-body align-items-center py-8">
        <div className="row ">
         {prodId == 0 && (
	 <div className={`form-group col-md-${colmdVal}`}>
          <TssSelectBox label={t("modules.tracker.filter.product")} defaultValue={Product} mandatory={false} options={ProductList} onChange={ChangeProduct}/>
         </div>
   )}
         <div className={`form-group col-md-${colmdVal}`}>
          <TssSelectBox label={t("modules.tracker.filter.modAccount")} defaultValue={ModifiedAccount} mandatory={false} options={AccountList} onChange={ChangeAccount}/>
         </div>
         <div className={`form-group col-md-${colmdVal}`}>
          <TssSelectBox label={t("modules.tracker.filter.event")} defaultValue={Event} mandatory={false} options={EventList} onChange={ChangeEvent}/>
         </div>
         <div className='form-group col-md-6'>
	  <TssInputGroup  mandatory={false} inputElement={startDate} appendElements={PredefinedOp}/>
         </div>
         <div className='form-group col-md-6'>
	  <TssInputGroup  mandatory={false} inputElement={endDate} appendElements={SearchOp}/>
         </div>
        </div>
        </div>
      </div>
      </div>
    </section>
	{/* { ShowAuditDetails && (
    <div className="card">
       <div className="card-body align-items-center py-8">
	<div className="row">
         <div style={{width:'100%'}} >
          
         </div>
        </div>
        )} */}
       
    {ShowAuditDetails && (
    <div className="card">
        <div className="card-body align-items-center py-8">
            <div className="row">
                <div className='form-group col-md-12'>
                <TssDataTable moduleName={t('modules.tracker.auditTracker.viewPage.label')} columnsDisplay={false} columns={tableHeadings} data={tableContent}  fileName={t('modules.tracker.auditTracker.viewPage.fileName')} />
                </div>
            </div>
        </div>
    </div>
   )}
     
   </>
  )
}

export default AuditTrackerView;
