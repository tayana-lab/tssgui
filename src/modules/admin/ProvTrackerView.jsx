import React from 'react'
import TssSelectBox from '@modules/common/default/components/TssSelectBox';
import TssDatePicker from '@modules/common/default/components/TssDatePicker';
import TSSMultiSelectGrouping from '@modules/common/default/components/TSSMultiSelectGrouping';
import TssInputGroup from '@modules/common/default/components/TssInputGroup'
import TssIcon from '@modules/common/default/components/TssIcon'
import TssDataTable from '@app/modules/common/default/components/TssDataTable';
import { useTranslation } from 'react-i18next';
import conf from '@app/modules/conf/TssGui.json';
import { useDispatch, useSelector } from 'react-redux';


const prodId = conf.PRODUCT_ID;
const versionStatus = conf.VERSION_STATUS;
const ProvTrackerView = ({ ProductList, Product, NewProduct, AccountList , AllOption , Account , NewAccount, Events ,NewEvents,  StartDate , NewStartDate, EndDate,NewEndDate,ChangeTime, ProvTrackerDetails, Search, ShowTable}) => {
    const [t]= useTranslation();
    
    var colmdVal = "6";
    if(prodId == 0){
	colmdVal = "4";
    }


    
    const Accounts = AccountList.map(account => ({
        value: account.accountId,            
        label: account.displayName,
    }));
const darkMode = useSelector((state) => state.ui.darkMode);
    const tableHeadings =  [
        { field: 'time', header:t('modules.tracker.provTracker.tssDataTable.header.time'), fixed:true , sortable:false, filter:true},
        { field: 'account', header:t('modules.tracker.provTracker.tssDataTable.header.account'), sortable:false, filter:true},  
        { field: 'ip', header:t('modules.tracker.provTracker.tssDataTable.header.ip'), sortable:false, filter:true},
        { field: 'event', header:t('modules.tracker.provTracker.tssDataTable.header.event'), sortable:false, filter:true},
        { field: 'before', header:t('modules.tracker.provTracker.tssDataTable.header.before'), sortable:false, filter:true},
        { field: 'after', header:t('modules.tracker.provTracker.tssDataTable.header.after'), sortable:false, filter:true},
        // { field: 'version', header:t('modules.tracker.provTracker.tssDataTable.header.version'), sortable:true, filter:true},
    ]
    if (versionStatus != 0) {
        tableHeadings.push({
            field: 'version',
            header: t('modules.tracker.provTracker.tssDataTable.header.version'),
            sortable: true,
            filter: true
        });
    }

    if (prodId == 0){
        tableHeadings.splice(3, 0, {
            field: 'product',
            header: t('modules.tracker.provTracker.tssDataTable.header.product'),
            sortable: true,
            filter: true
        });
    }


    const tableContent = ProvTrackerDetails.map(prov => ({
        time : prov.generationTime ,
        account: prov.accountName,
        product :prov.productName,
        ip : prov.clientIp,
        event : prov.eventName,
	before : (<textarea key={ProvTrackerDetails} className='custom-textarea' row={1} readOnly >{prov.before}</textarea>),
        after : (<textarea key={ProvTrackerDetails} className='custom-textarea' row={1} readOnly>{prov.after}</textarea>),
        version : prov.versionDisplay
    }));

    const startDate =[
        <TssDatePicker label={t('modules.tracker.provTracker.label.fDate')} defaultValue={StartDate} dateTimeEnabled={true}  onChange={NewStartDate} showTime={true} maxDaysFromToday={0} minDaysFromToday={-1000}/>
    ]
    const PredefinedButton =[
        <div className="dropdown">
            <a className='tss-anchor dropdown-toggle'  href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">{t('modules.tracker.provTracker.predefined.label')}</a>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <li onClick={() => {ChangeTime(1)}}><a className="dropdown-item" href="#">{t('modules.tracker.provTracker.predefined.1')}</a></li>
                <li onClick={() => {ChangeTime(2)}}><a className="dropdown-item" href="#">{t('modules.tracker.provTracker.predefined.2')}</a></li>
                <li onClick={() => {ChangeTime(3)}}><a className="dropdown-item" href="#">{t('modules.tracker.provTracker.predefined.3')}</a></li>
                <li onClick={() => {ChangeTime(4)}}><a className="dropdown-item" href="#">{t('modules.tracker.provTracker.predefined.4')}</a></li>
                <li onClick={() => {ChangeTime(5)}}><a className="dropdown-item" href="#">{t('modules.tracker.provTracker.predefined.5')}</a></li>
                <li onClick={() => {ChangeTime(6)}}><a className="dropdown-item" href="#">{t('modules.tracker.provTracker.predefined.6')}</a></li>
                <li onClick={() => {ChangeTime(7)}}><a className="dropdown-item" href="#">{t('modules.tracker.provTracker.predefined.7')}</a></li>
            </ul>
        </div>
        
    ]
    const endDate =[
        <TssDatePicker label={t('modules.tracker.provTracker.label.tDate')} defaultValue={EndDate} dateTimeEnabled={true} onChange={NewEndDate} showTime={true} maxDaysFromToday={0} minDaysFromToday={-1000}/>
    ]
    const SearchButton =[
       <TssIcon  iconKey="tss_search" className='tss-search' onClick={Search} title={t('modules.tracker.provTracker.title.search')}/>
       
    ]

    return (
    <>
    <section className="content">
        <div>
            <div className="card">
                <div className="card-body align-items-center py-8">
                    <div className="row">
                       {prodId == 0 &&(
			 <div className={`form-group col-md-${colmdVal}`}>
                            <TssSelectBox label={t('modules.tracker.provTracker.label.product')} options={ProductList} defaultValue={Product} onChange={NewProduct} />
                        </div>
                       )}
                        <div className={`form-group col-md-${colmdVal}`}>
                            <TssSelectBox label={t('modules.tracker.provTracker.label.account')} options={[AllOption,...Accounts]} defaultValue={Account} onChange={NewAccount}/>
                        </div>
                        <div className={`form-group col-md-${colmdVal}`}>
                            <TSSMultiSelectGrouping label={t('modules.tracker.provTracker.label.events')} defaultValue="Select All" options={Events} onChange={NewEvents}  placeholder={t('modules.tracker.provTracker.placeholder.events')} disabled={prodId == 0 && Product?.value == -1} />
                        </div>
	           </div>
	           <div className="row">
                        <div className='form-group col-md-6'>
                            <TssInputGroup  mandatory={false} inputElement={startDate} appendElements={PredefinedButton}/>
                        </div>
                        <div className='form-group col-md-6'>
                            <TssInputGroup  mandatory={false} inputElement={endDate} appendElements={SearchButton}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    {ShowTable && (
    <div className="card">
        <div className="card-body align-items-center py-8">
            <div className="row">
                <div className='form-group col-md-12'>
                    <TssDataTable moduleName={t('modules.tracker.provTracker.tssDataTable.label')} columns={tableHeadings} data={tableContent} columnsDisplay={false} fileName={t('modules.tracker.provTracker.fileName')}/>
                </div>
            </div>
        </div>
    </div>
   )}
    
    </>
  )
}

export default ProvTrackerView
