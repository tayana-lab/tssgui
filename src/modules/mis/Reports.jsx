import React, { useState , useEffect } from 'react'
import TssButtonGroup from '@modules/common/default/components/TssButtonGroup';
import TssDatePicker from '@modules/common/default/components/TssDatePicker';
import TssSelectBox from '@modules/common/default/components/TssSelectBox';
import TssMultiSelectBox from '@modules/common/default/components/TssMultiSelectBox';
import TssTextBox from '@modules/common/default/components/TssTextBox';
import TssButton from '@modules/common/default/components/TssButton';
import ReportsTable from '@modules/mis/ReportsTable';
import tssguiConf from '@modules/conf/TssGui.json';
import Log from '@app/modules/common/default/components/TssGUILog';
import { useLogout } from '@app/modules/common/default/utils/oidc-providers';
import TssSpinner from '@app/modules/common/default/components/TssSpinner';
import { useTranslation } from 'react-i18next';

const options = []

const url = tssguiConf.SERVER_JS_API_URI;

//////////////////////////////////////////////////////////////////////////
let clientID, clientIP, sessionID, clientName, userName, productId;
var mMode = "H"
var resultingStr = ""
var initialQueryParamString = ""
var uniqueString = ""

const Reports = ({reportId, ModuleID, fromDt, toDt,queryStr, SubMode}) => {

    const moduleId = ModuleID;
    const [t]= useTranslation();
    const logOut = useLogout();
    const [activeButton, setActiveButton] = useState({label : "Daily", value:1})
    const [pickMonth, setPickMonth] = useState(false)
    const [pickYear, setPickYear] = useState(false)
    const [pickRange, setPickRange] = useState(false)
    const [dateLabel, setDateLabel] = useState(t("MISRep.day"))
    const [showTable, setShowTable] = useState(false)
    const [jsonObj, setJsonObj] = useState({})
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [mode, setMode] = useState('F')
    const [reportData, setReportData] = useState([])
    const [modalReportDataDay, setModalReportDataDay] = useState([])
    const [modalReportDataMonth, setModalReportDataMonth] = useState([])
    const [modalReportDataYear, setModalReportDataYear] = useState([])
    const [loading, setLoading] = useState(false)
    const [permission, setPermission] = useState(0)
    const [repId, setRepId] = useState('');
    const [repName, setRepName] = useState('');
    const [queryParamString,setQueryParamString] = useState('')
    const [isDateBased, setIsDateBased] = useState(false)
    const [initiated, setInitiated] = useState(false)

    useEffect(() => {
      if (jsonObj && jsonObj.json ) {
        setRepId(jsonObj.json.REPORT_ID);
        setRepName(jsonObj.json.REPORT_NAME);
      }
   }, [jsonObj]); 

   useEffect(() => {
    if (jsonObj && jsonObj.json && jsonObj.json.DATE_FILTER && !jsonObj.json.MODAL_HEADING ) {
      setMode('H')
      mMode = 'H'
      setIsDateBased(true)
    }
    if (jsonObj && jsonObj.json && !jsonObj.json.DATE_FILTER){
      mMode = SubMode
    }
  }, [jsonObj]);


   /////////////////////////////////////////////////////////////////////////////
    const buttons = [];
    if (jsonObj && jsonObj.json && jsonObj.json.DATE_FILTER) {
        const filters = jsonObj.json.DATE_FILTER.split(',');
        filters.forEach(filter => {
            switch (filter.trim()) {
                case 'H':
                    buttons.push({ label: "Daily", value: 1 });
                    break;
                case 'M':
                    buttons.push({ label: "Monthly", value: 2 });
                    break;
                case 'Y':
                    buttons.push({ label: "Yearly", value: 3 });
                    break;
                case 'DR':
                    buttons.push({ label: "Date Range", value: 4 });
                    break;
                default:
                    break;
            }
        });
    }

    ///////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
      if(!fromDt || !toDt){
      const currentDate = new Date();
  
      // Function to format date to yyyy-mm-dd hh:mm:ss
      const formatDate = (date) => {
          const yyyy = date.getFullYear();
          const mm = String(date.getMonth() + 1).padStart(2, '0');
          const dd = String(date.getDate()).padStart(2, '0');
          const hh = String(date.getHours()).padStart(2, '0');
          const min = String(date.getMinutes()).padStart(2, '0');
          const ss = String(date.getSeconds()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
      };
  
      // Start of the day
      const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
      const fromDate = formatDate(startOfDay);
  
      // End of the day
      const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));
      const toDate = formatDate(endOfDay);
  
      setFromDate(fromDate);
      setToDate(toDate);
   }
  }, []);

  //////////////////////////////////////////////////////////////////////////////

  // incase fromDate and toDate is passed from main report to sub report 

  useEffect(() => {
      if(fromDt || toDt){

        let formattedFromDate = ""
        let formattedToDate = ""
        if(fromDt.length > 22){
          formattedFromDate = fromDt.slice(0, 4) + fromDt.slice(4)
          formattedToDate = toDt.slice(0, 4) + toDt.slice(4)
        }
        else if(fromDt.length > 19){
          formattedFromDate = fromDt.slice(0, 4) + fromDt.slice(4)
          formattedToDate = toDt.slice(0, 4) + toDt.slice(4)
        }
        else{
          formattedFromDate = fromDt
          formattedToDate = toDt
        }
      setFromDate(formattedFromDate)
      setToDate(formattedToDate)
      
      
      getSubReportData(formattedFromDate, formattedToDate)
      }
    },[fromDt, toDt])


    useEffect(() => {
      if(SubMode){
        mMode= SubMode
      }
    },[SubMode])
    ///////////////////////////////////////////////////////////////////////////////
    const formatDate = (date) => {
        const dt = new Date(date);
        const year = dt.getFullYear();
        const month = String(dt.getMonth() + 1).padStart(2, '0');
        const day = String(dt.getDate()).padStart(2, '0');
        if (activeButton.value === 1) {
            return `${year}-${month}-${day}`;
        } else if (activeButton.value === 2) {
            return `${year}-${month}`;
        } else if (activeButton.value === 3) {
            return `${year}`;
        }
        //else if (activeButton.value === 4) {
        //     return `${year}-${month}-${day} - ${year}-${month}-${day}`;
        // }
    };
    const [date, setDate] = useState(formatDate(new Date()));
    ///////////////////////////////////////////////////////////////////////////////
    const handleDateFilterClick = (event) => {
    setShowTable(false);
          if(event.value == 1){
              setActiveButton(event); setPickMonth(false); setPickYear(false); setPickRange(false); setDateLabel(t("MISRep.day"));mMode="H";
          }else if(event.value == 2){
              setActiveButton(event); setPickMonth(true); setPickYear(false); setPickRange(false); setDateLabel(t("MISRep.month"));mMode="M";
          }else if(event.value == 3){
              setActiveButton(event); setPickMonth(false); setPickYear(true); setPickRange(false); setDateLabel(t("MISRep.year"));mMode="Y";
          }else if(event.value == 4){
              setActiveButton(event); setPickMonth(false); setPickYear(false); setPickRange(true); setDateLabel(t("MISRep.range"));mMode="DR";
          }
          setDate(formatDate(new Date()));
          return event.value;
      }

    useEffect(() => {
      if(isDateBased){
        if(activeButton.value == 1) {setMode('H'); mMode = 'H';}
        if(activeButton.value == 2) {setMode('M'); mMode = 'M'}
        if(activeButton.value == 3) {setMode('Y'); mMode = 'Y'}
        if(activeButton.value == 4) {setMode('DR'); mMode = 'DR'}
      }
    },[activeButton])
    
    //////////////////////////////////////////////////////////////////////////////
    const setRowAppNum = (label, id, ColumnName) => {
          const str = resultingStr +"&_$"+ColumnName+"$_="+id;
          resultingStr = getUniqueQueryParameters(str)
          setQueryParamString(resultingStr)
      };
    ///////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        setDate(formatDate(new Date()));
    },[activeButton]);
    ///////////////////////////////////////////////////////////////////////////////////
    function handleGoClick() {
      setShowTable(true)
      getReportData();
    }    
    ///////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
      handleDateChange(date)
    },[date])
    //////////////////////////////////////////////////////////////////////////////
    const handleDateChange = (event) => {
      setShowTable(false);
      if(!fromDt || !toDt){
        if(mode == 'F' ){
          if(mMode == 'H' || dateLabel == "Day"){
            setFromDate(event + " 00:00:00");
            setToDate(event +" 23:59:59")
          }
          if(mMode == 'M' || dateLabel == "Month"){
            const [year, month] = event.split('-').map(Number); 
            const daysInMonth = new Date(year, month, 0).getDate();
            setFromDate(event + "-01 00:00:00");
            setToDate(event + "-" + daysInMonth +" 23:59:59")
          }
          if(mMode == 'Y' || dateLabel == "Year"){
            setFromDate(event + "-01-01 00:00:00");
            setToDate(event +   "-12-31 23:59:59")
          }
        }
        else if(mode == 'H' || dateLabel == "Day"){
          setFromDate(event + " 00:00:00");
          setToDate(event +" 23:59:59")
        }
        else if(mode == 'M' || dateLabel == "Month"){
          const [year, month] = event.split('-').map(Number); 
          const daysInMonth = new Date(year, month, 0).getDate();
          setFromDate(event + "-01 00:00:00");
          setToDate(event + "-" + daysInMonth +" 23:59:59")
        }
        else if(mode == 'Y' || dateLabel == "Year"){
          setFromDate(event + "-01-01 00:00:00");
          setToDate(event +   "-12-31 23:59:59")
        }
      }
      ///////////////////////////////////////////////////////
      
      // if(mode == 'DR'){
      //   setFromDate(event + " 00:00:00");
      //   setToDate(event +" 23:59:59")
      // }

    }
    ////////////////////////////////////////////////////////////////////
    
    const handleCumulate = (label) => {
      if(label === "Month"){
        mMode = "M"
        changeMode("M")
      }else if(label === "Day"){
        mMode = "H"
        changeMode("H")
      }else if(label == "Year"){
	      mMode = "Y"
        changeMode("Y")
      }
    }
    
    //////////////////////////////////////////////////////////////////////

    useEffect(() => {
      
      if(jsonObj && jsonObj.json && jsonObj.json.OTHER_FILTER ){
        const initialQueryParams = jsonObj.json.OTHER_FILTER.reduce((acc, filter) => {
          acc[`_$${filter.QUERY_PARAM_NAME}$_`] = encodeURIComponent("-1");
          return acc;
        }, {});
      
        initialQueryParamString = Object.entries(initialQueryParams)
          .map(([key, value]) => `&${key}=${value}`)
          .join('');
          resultingStr = initialQueryParamString;
          
          let extraParamString = ""
          
          if(jsonObj && jsonObj.json && jsonObj.json.EXT_PARAMS){
            jsonObj.json.EXT_PARAMS.forEach(param => {
              if (param.PARAM_NAME && param.PARAM_VALUE !== undefined) {
                extraParamString += `&_$${param.PARAM_NAME}$_=${param.PARAM_VALUE}`;
              }
          });
          }


          if(queryStr){
            initialQueryParamString+=queryStr;
          }
          
          initialQueryParamString += extraParamString;
          uniqueString= getUniqueQueryParameters(initialQueryParamString)

          resultingStr = uniqueString;
          setQueryParamString(uniqueString);
          setInitiated(true)        
      }
    }, [jsonObj,reportId]);
    ////////////////////////////////////////////////////////////////////
    function getUniqueQueryParameters(str) {
      const params = str.split("&");
      const seenParams = new Map();
      const uniqueParams = [];
  
      for (let i = params.length - 1; i >= 0; i--) {
          const param = params[i];
          const key = param.split("=")[0];  
          
          if (!seenParams.has(key)) {
              seenParams.set(key, param);
          }
      }

      for (const value of seenParams.values()) {
          uniqueParams.push(value);
      }
  
      return uniqueParams.reverse().join("&");
  }
  const [reloadFilters, setReloadFilters] = useState(false)
    /////////////////////////////////////////////////////////////////////
    let queryParams = {}; 
    const handleInputFeildChangeMS = (event, label) => {
      setShowTable(false);
      setReloadFilters(true);
      
      const filterObj = jsonObj.json.OTHER_FILTER.find(f => f.DISPLAY === label);
      if (filterObj) {
        
        const queryParamName = filterObj.QUERY_PARAM_NAME;
        if (event ==  "") {
          event = "-1";
        }
        const formattedData = formatData(event.toString());
        
        queryParams[`_$${queryParamName}$_`] = encodeURIComponent(formattedData);

        resultingStr += Object.entries(queryParams)
            .map(([key, value]) => `&${key}=${value}`)
            .join('');
        
      }
        const res = getUniqueQueryParameters(resultingStr)
        setQueryParamString(res)
      
    }
    ///////////////////////////////////////////////////////////////////
    const handleInputFeildChangeS = (event, label) => {
      setShowTable(false);
      setReloadFilters(true);
      const filterObj = jsonObj.json.OTHER_FILTER.find(f => f.DISPLAY === label);
      if (filterObj) {
        
        const queryParamName = filterObj.QUERY_PARAM_NAME;
        if (event.value ==  "") {
          event.value = "-1";
        }
        const formattedData = formatData(event.value.toString());
        
        queryParams[`_$${queryParamName}$_`] = encodeURIComponent(formattedData);

        resultingStr += Object.entries(queryParams)
            .map(([key, value]) => `&${key}=${value}`)
            .join('');
      }
      const res = getUniqueQueryParameters(resultingStr)
      setQueryParamString(res)
      
    }
    
    ///////////////////////////////////////////////////////////////////////
    const handleInputFeildChangeI = (event, label) => {
      setShowTable(false);
      setReloadFilters(true);
      const filterObj = jsonObj.json.OTHER_FILTER.find(f => f.DISPLAY === label);
      if (filterObj) {
        
        const queryParamName = filterObj.QUERY_PARAM_NAME;
        if (event.target.value ==  "") {
          event.target.value = "-1";
        }
        const formattedData = formatData(event.target.value.toString());
        
        queryParams[`_$${queryParamName}$_`] = encodeURIComponent(formattedData);

        resultingStr += Object.entries(queryParams)
            .map(([key, value]) => `&${key}=${value}`)
            .join('');
      }
      const res = getUniqueQueryParameters(resultingStr)
      setQueryParamString(res)
    }////////////////////////////////////////////////////////////////////////////////////

    const InputProp = {
      type : 'text',
      maxLength : 10,
      onChange : (event) => handleInputFeildChangeI(event, filter.DISPLAY)
  
    }
    ///////////////////////////////////////////////////////////////////////

    useEffect(() => {
      clientID = localStorage.getItem("acctID");
      clientIP = localStorage.getItem("clientIP");
      sessionID = localStorage.getItem("sessionID");
      clientName = localStorage.getItem("acctName");
      userName = localStorage.getItem("username");
      productId = parseInt(localStorage.getItem("productID"),10);
  },[]);
    

     useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${url}/tssgui/checkAccess?productId=${productId}&clientId=${clientID}&moduleId=${moduleId}&clientIp=${clientIP}&sessionId=${sessionID}`);

                if (!response.ok) {
                    throw new Error("Error fetching data ");
                }
                const data = await response.text();
                const responseObject = JSON.parse(data);
                const permission = responseObject.permission;
                if(permission == 0){
                    logOut();
                }
                setPermission(permission)
                Log('Report', 'INFO', 'Data fetched successfully');
            } catch (error) {
                Log('Report', 'ERROR', 'Error fetching data ');
            }
        };
        fetchData();
    }, []); 
 
     /////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await fetch(`${url}/tssgui/reports/getJSON?reportId=${reportId}&productId=${productId}`);
              if (!response.ok) {
              throw new Error("Error fetching data ");
              }
              const data = await response.json();
              setJsonObj(data);
              //console.log(JSON.stringify(data))
              Log('Report', 'INFO', 'Data fetched successfully ');
          } catch (error) {
              Log('Report', 'ERROR', 'Error fetching data');
          }
      };
      
      fetchData();
    }, [reportId, moduleId]);
    //////////////////////////////////////////////////////////////////////////////////////////
    const [filters, setFilters] = useState({})


    useEffect (() => {
      if(jsonObj && jsonObj.json && jsonObj.json.OTHER_FILTER.length > 0 ){
        getFiltersData(queryParamString)
      }
    },[jsonObj, queryParamString])

    ///////////////////////////////////////////////////////////////////////////////////////
    useEffect (() => {
      resultingStr += queryParamString
      const str = getUniqueQueryParameters(resultingStr)
      setQueryParamString(str)
    }, [reloadFilters])

    ///////////////////////////////////////////////////////////////////////////////////////
    useEffect (() => {
      resultingStr = ""
      setQueryParamString("")
    },[moduleId])
    
    ///////////////////////////////////////////////////////////////////////////////////////////
    useEffect (() => {
      if(jsonObj && jsonObj.json &&jsonObj.json.OTHER_FILTER.length==0 ){
        getFiltersData(queryParamString)
      }
    },[jsonObj])


    
    /////////////////////////////////////////////////////////////////////////////////////////////
      
      const getFiltersData = async () => {
          try {
              const response = await fetch(`${url}/tssgui/reports/getFiltersData?reportId=${reportId}&productId=${productId}&accountId=${clientID}&param=${encodeURIComponent(queryParamString)}`);
              if (!response.ok) {
              throw new Error("Error fetching data ");
              }
              const data = await response.json();
              const filtersData = data.filtersData;

              const transformedData = Object.keys(filtersData).reduce((acc, key) => {
                const otherFilter = jsonObj.json.OTHER_FILTER.find(filter => filter.DISPLAY === key);
              
                if (otherFilter) {
                  const valueIndex = parseInt(otherFilter.FILTER_QUERY.QUERY_PARAM_VALUE.replace('C', '')) - 1;
                  const labelIndex = parseInt(otherFilter.FILTER_QUERY.DATA_LABEL.replace('C', '')) - 1;
              
                  acc[key] = filtersData[key].map(item => {
                    const value = item[valueIndex] || null;
                    const label = item[labelIndex] || null;
              
                    return {
                      value,
                      label,
                    };
                  });
                } else {
                  acc[key] = filtersData[key].map(item => {
                    const [value, label] = item;
              
                    return {
                      value: value || null,
                      label: label || null,
                    };
                  });
                }
              
                return acc;
              }, {});
              
              setFilters(transformedData);
              
              Log('Report', 'INFO', 'Data fetched successfully');
          } catch (error) {
              Log('Report', 'ERROR', 'Error fetching data');
          }
      };
      
     
    //////////////////////////////////////////////////////////////////////////////////////////////

    function formatData(inputString) {
      const array = inputString.split(',');
      if (array.length > 1) {
        const formattedArray = array.map(item => `\\'${item}\\'`);
        return formattedArray.join(',');
      }
      return `${array[0]}`;
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////
      const [mainReportDataDay,setMainReportDataDay] = useState([])
      const [mainReportDataMonth,setMainReportDataMonth] = useState([])
      const [mainReportDataYear,setMainReportDataYear] = useState([])

      const getReportData = async () => {
          
          setLoading(true)
          try {
              const response = await fetch(`${url}/tssgui/reports/getReportData?reportId=${reportId}&productId=${productId}&accountId=${clientID}&fromDate=${fromDate}&toDate=${toDate}&mode=${mode}&params=${encodeURIComponent(queryParamString)}`);
             // alert(`${url}/tssgui/reports/getReportData?reportId=${reportId}&productId=${productId}&accountId=${clientID}&fromDate=${fromDate}&toDate=${toDate}&mode=${mode}&params=${encodeURIComponent(queryParamString)}`)
              if (!response.ok) {
              throw new Error("Error fetching data ");
              }
              const data = await response.json();
              if(isDateBased){
                if(mode == 'H'){
                  setMainReportDataDay(data)
                }if(mode == 'M'){
                  setMainReportDataMonth(data)
                }if(mode == 'Y'){
                  setMainReportDataYear(data)
                }
              }
              setReportData(data)
             // console.log("Report Data = "+ JSON.stringify(data))
              setLoading(false)
              Log('Report', 'INFO', 'Data fetched successfully');
          } catch (error) {
              setLoading(false)
              Log('Report', 'ERROR', 'Error fetching data ');
          }
      };

    //////////////////////////////////////////////////////////////////////////////////////////
    const getSubReportData = async (from , to) => {
          
      setLoading(true)
      try {
          const response = await fetch(`${url}/tssgui/reports/getReportData?reportId=${reportId}&productId=${productId}&accountId=${clientID}&fromDate=${from}&toDate=${to}&mode=${mode}&params=${encodeURIComponent(resultingStr)}`);
          //alert(`${url}/tssgui/reports/getReportData?reportId=${reportId}&productId=${productId}&accountId=${clientID}&fromDate=${from}&toDate=${to}&mode=${mode}&params=${encodeURIComponent(queryParamString)}`)
          if (!response.ok) {
          throw new Error("Error fetching data ");
          }
          const data = await response.json();
          if(isDateBased){
            if(mode == 'H'){
              setMainReportDataDay(data)
            }if(mode == 'M'){
              setMainReportDataMonth(data)
            }if(mode == 'Y'){
              setMainReportDataYear(data)
            }
          }
          setReportData(data)
         // console.log("Report Data = "+ JSON.stringify(data))
          setLoading(false)
          Log('Report', 'INFO', 'Data fetched successfully');
      } catch (error) {
          setLoading(false)
          Log('Report', 'ERROR', 'Error fetching data ');
      }
  };
    
    ///////////////////////////////////////////////////////////////////////////////////////////
     const getModalReportData = async (modalMode) => {
        setLoading(true)
        let from = fromDate;
        let to = toDate
        let formattedFromDate = ""
        let formattedToDate = ""

        if(from.length > 22){
          formattedFromDate = from.slice(0, 4) + from.slice(10)
          formattedToDate = to.slice(0, 4) + to.slice(10)
        }
        else if(from.length > 19){
          formattedFromDate = from.slice(0, 7) + from.slice(10)
          formattedToDate = to.slice(0, 7) + to.slice(10)
        }
        else {
          formattedFromDate = from 
          formattedToDate = to
        }

	        try {
            const response = await fetch(`${url}/tssgui/reports/getReportData?reportId=${reportId}&productId=${productId}&accountId=${clientID}&fromDate=${formattedFromDate}&toDate=${formattedToDate}&mode=${modalMode}&params=${encodeURIComponent(resultingStr)}`);
            //alert(`${url}/tssgui/reports/getReportData?reportId=${reportId}&productId=${productId}&accountId=${clientID}&fromDate=${formattedFromDate}&toDate=${formattedToDate}&mode=${modalMode}&params=${encodeURIComponent(resultingStr)}`)
            if (!response.ok) {
            throw new Error("Error fetching data ");
            }
            const data = await response.json();
            if(modalMode == 'H'){
              setModalReportDataDay(data)
            }else if(modalMode == 'M'){
              setModalReportDataMonth(data)
            }else if(modalMode == 'Y'){
              setModalReportDataYear(data)
            }
            //console.log("Report Data In Modal = "+ JSON.stringify(data))
            setLoading(false)
            Log('Report', 'INFO', 'Data fetched successfully');
        } catch (error) {
            setLoading(false)
            Log('Report', 'ERROR', 'Error fetching data');
        }
      };
    //////////////////////////////////////////////////////////////////////////////////////////////
    const getIntervalReportData = async (from , to) => {
      setLoading(true)
      try {
          const response = await fetch(`${url}/tssgui/reports/getReportData?reportId=${reportId}&productId=${productId}&accountId=${clientID}&fromDate=${from}&toDate=${to}&mode=${mMode}&params=${encodeURIComponent(resultingStr)}`);
          //console.log(`${url}/tssgui/reports/getReportData?reportId=${reportId}&productId=${productId}&accountId=${clientID}&fromDate=${from}&toDate=${to}&mode=${mMode}&params=${encodeURIComponent(queryParamString)}`)
          if (!response.ok) {
          throw new Error("Error fetching data ");
          }
          const data = await response.json();
          if(!isDateBased){
            if(mMode == 'H'){
              setModalReportDataDay(data)
            }else if(mMode == 'M'){
              setModalReportDataMonth(data)
            }else if(mMode == 'Y'){
              setModalReportDataYear(data)
            }
          }
          if(isDateBased){
            if(mMode == 'H'){
              setMainReportDataDay(data)
            }else if(mMode == 'M'){
              setMainReportDataMonth(data)
            }else if(mMode == 'Y'){
              setMainReportDataYear(data)
            }
          }
          //console.log("Report Data In Modal = "+ JSON.stringify(data))
          setLoading(false)
          Log('Report', 'INFO', 'Data fetched successfully ');
      } catch (error) {
          setLoading(false)
          Log('Report', 'ERROR', 'Error fetching data ');
      }
    };
      
    //////////////////////////////////////////////////////////////////////////////////////////////

    const changeMode = (newMode) => {
      mMode = newMode;
    }
    //////////////////////////////////////////////////////////////////////////////////////

    const shouldDisplay = (displayCondition, qyeryParam) => {
      
      const conditions = displayCondition.split("||").map(cond => cond.trim());
      if(conditions.some(condition => queryParamString.includes(condition)) == false){
        const str = resultingStr + "&_$"+qyeryParam+"$_=-1";
        resultingStr = getUniqueQueryParameters(str);
      }
      return conditions.some(condition => queryParamString.includes(condition));
    };  
    //////////////////////////////////////////////////////////////////////
    

    const [subReportMode, setSubReportMode] = useState('H')

    useEffect(() => {
      if(dateLabel == "Year")
        setSubReportMode("Y")
      else if(dateLabel == "Month")
        setSubReportMode("M")
      else if(dateLabel == "Day")
        setSubReportMode("H")
    },[dateLabel])


    return (
      <>
      {permission != 0 ? (
      <>
      {jsonObj && jsonObj.response && jsonObj.response.status == 0 && (
        <>
	   {(jsonObj.json.DATE_FILTER || !jsonObj.json.SUB) && (
            <>
            <div className="card">
                <div className="card-body align-items-center py-8">            
                    <div className="row">
                        <div className="form-group col-md-3 pt-2">
                            <TssButtonGroup  buttonArray={buttons} onClick={handleDateFilterClick} activeBtn={activeButton}/>
                        </div>
                        <div className="form-group col-md-3">
                            <TssDatePicker label={dateLabel} defaultValue={date} monthPicker={pickMonth} yearPicker={pickYear} dateRange={pickRange} onChange={handleDateChange}  maxDaysFromToday={0}/>
                        </div>
                        {jsonObj && jsonObj.json && jsonObj.json.OTHER_FILTER && (
                          <>
                            {jsonObj.json.OTHER_FILTER.map((filter, index) => (
                                <div className="form-group col-md-3" key={index}>
                                    { !filter.DISPLAY_CONDITION || (filter.DISPLAY_CONDITION && shouldDisplay(filter.DISPLAY_CONDITION, filter.QUERY_PARAM_NAME)) ? (
                                        <>
                                            {filter.TYPE === 'S' ? (
                                                <TssSelectBox 
                                                    label={filter.DISPLAY}  
                                                    options={filters[filter.DISPLAY] ? filters[filter.DISPLAY] : options} 
                                                    onChange={(event) => handleInputFeildChangeS(event, filter.DISPLAY)} 
                                                />
                                            ) : filter.TYPE === 'MS' ? (
                                                <TssMultiSelectBox 
                                                    label={filter.DISPLAY} 
                                                    options={filters[filter.DISPLAY] ? filters[filter.DISPLAY] : options} 
                                                    selectAllOption={true} 
                                                    isSeachable={true} 
                                                    onSelect={(event) => handleInputFeildChangeMS(event, filter.DISPLAY)} 
                                                />
                                            ) : filter.TYPE === 'I' ? (
                                                <TssTextBox 
                                                    label={filter.DISPLAY} 
                                                    properties={InputProp} 
                                                />
                                            ) : null}
                                        </>
                                    ) : null}
                                </div>
                            ))}
                          </>
                      )}
                    </div>
                    <div className="row">
                      <div className='form-group col-md-12'>
                        <div className='d-flex justify-content-end tss-pull-right'>
                          <TssButton label={t("modules.Generic.buttons.label.go")}  onClick={handleGoClick}/>
                        </div>
                      </div>   
                    </div>
                </div>
            </div>
           </>
          )}
          {/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
            <br/>
            {(showTable || !jsonObj.json.DATE_FILTER || jsonObj.json.SUB) &&(
            <ReportsTable jsonObj={jsonObj} 
                          Cumulate={dateLabel} 
                          ReportData={reportData}
                          GetModalReportData={getModalReportData}
                          ModalYearData={modalReportDataYear}
                          ModalMonthData={modalReportDataMonth}
                          ModalDayData={modalReportDataDay}
                          From = {fromDate}
                          To = {toDate}
                          LoadIntervalData = {getIntervalReportData}
                          SetCumulate = {handleCumulate}
                          Mode = {mMode}
                          Loading = {loading}
                          ActiveButton = {activeButton}
                          SetApp = {setRowAppNum}
                          ReportName = {repName} 
                          IsDateBased = {isDateBased}
                          MainDayData = {mainReportDataDay}
                          MainMonthData = {mainReportDataMonth}
                          MainYearData = {mainReportDataYear}
                          MainMode = {mode}
                          ChangeMode = {changeMode}
                          queryParamString = {queryParamString}
                          SubReportMode={subReportMode}
              />
           
            )}
        </>
      
        )}
      </>
     ):(
         <TssSpinner isLoading={true}/>
      )}
      </>
    )
}

export default Reports
