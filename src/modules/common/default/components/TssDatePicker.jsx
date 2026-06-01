import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Calendar } from 'primereact/calendar';
import Log from "@app/modules/common/default/components/TssGUILog";
import moment from 'moment';
import TssIcon from '@modules/common/default/components/TssIcon';
import config from '@app/modules/conf/TssGui.json';
import CustomTooltipFeildSet from './CustomToolTipForFeildSet';
import { useDispatch, useSelector } from 'react-redux';
const TssDatePicker = forwardRef(({
  onChange,
  label = "Select Date",
  defaultValue="",
  mandatory = false,
  disabled = false,
  minDaysFromToday = -365000,
  maxDaysFromToday = 365000,
  validationTheme = "form",
  tooltipMessage = "Invalid Date",
  showTime = false,
  timeOnly= false,
  showSeconds=true,
  monthPicker = false,
  yearPicker = false,
  dateRange = false,
  placeholder = "Select Date",
  minutesOffset = 1
}, ref) => {

  const getDateFormat = () => {
    if (showTime && timeOnly && showSeconds) return config.DATETIME_FORMAT;
    if (showTime && timeOnly && !showSeconds) return config.TssHourMinuteFormat;
    if (showTime) return config.TssDateTimeFormat;
    if (monthPicker) return config.TssMonthFormat;
    if (yearPicker) return config.TssYearFormat;

    return config.TssDateFormat;
  };

  const dateFormat = getDateFormat();
  // console.log(":::::::::dateFormat:::::::::::"+dateFormat);

  const parseDefaultValue = (value, dateRange = false) => {
    if (!value) return dateRange ? [null, null] : null;

    if (dateRange) {
      const [start, end] = value.split(" - ");
      const startDate = moment(start, config.TssDateFormat, true);
      const endDate = moment(end, config.TssDateFormat, true);
      // console.log(":::startDate::::"+startDate+":::::::endDate:::::::"+endDate)
      return [
        startDate.isValid() ? startDate.toDate() : null,
        endDate.isValid() ? endDate.toDate() : null,
      ];
    } else {
      //const parsedDate = moment(value, config.TssDateFormat, true);
      const parsedDate = moment(value,dateFormat, true);
      return parsedDate.isValid() ? parsedDate.toDate() : null;
    }
  };



  const initialDate = parseDefaultValue(defaultValue,dateRange);
  const [tooltipMessageContent,setTooltipMessageContent]=useState("");

  useEffect(()=>{
    setTooltipMessageContent(tooltipMessage)
  },[tooltipMessage]);
  const [date, setDate] = useState(initialDate);

  const [formattedTime,setFormattedTime]= useState("");
  const [validation, setValidation] = useState(validationTheme);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [displayRequiredIcon, setDisplayRequiredIcon] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const calendarRef = useRef(null);

  const [tempDate,setTempDate]  = useState("");
  const nodeJSUrl = config.SERVER_JS_API_URI;
  useEffect(() => {
    const url = `${nodeJSUrl}/getServerTime`;
    Log("TSSGUI","TssDatePicker","::url::" + url);

    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error("Error in API Response");
        return response.text();
      })
      .then(data => {
        Log("TSSGUI","TssDatePicker","::time::" +data);
           
           
        const cleanDateStr = data.substring(1, 23);
        const date = new Date(cleanDateStr);
        setTempDate(date);
        })
      .catch(error => {
        Log("TSSGUI","TssDatePicker","::error::" +error);
      });

  }, [nodeJSUrl]);
  const darkMode = useSelector((state) => state.ui.darkMode);
  useEffect(() => {
    setValidation(validationTheme);
    setDisplayRequiredIcon(validationTheme === "formError");
  }, [validationTheme]);

  useEffect(() => {
    if (defaultValue!=="") {
      const newDate = parseDefaultValue(defaultValue,false);
      setDate(newDate);
      setSelectedDate(newDate);
    }
  }, [defaultValue, dateFormat]);

  useEffect(()=>{
    setDisplayRequiredIcon((validationTheme === "formError" || validation == "formError") ? true : false)
  },[validationTheme,validation]);

  useEffect(()=>{
    if(calendarVisible && defaultValue=="") {
      if(timeOnly)
      {
        var newDate = tempDate;
        const time = newDate.toTimeString().split(" ")[0];
        var vTemp = time.slice(0,time.length-3)
        setDate(vTemp);
        setFormattedTime(vTemp)
        onChange(vTemp,validation);
      }
      else
      {
      var newDate = tempDate;
      var temp = parseDefaultValue(newDate,dateRange)
      setDate(temp);
      setSelectedDate(temp);
      const formattedDateTemp = moment(temp).format(dateFormat);
      if(showTime && !showSeconds)
      {
        onChange(formattedDateTemp.slice(0,formattedDateTemp.length-3),validation);
      }
      else
       onChange(formattedDateTemp,validation);
      }
   }



  },[calendarVisible,tempDate])
  useEffect(()=>{

    if (!disabled && validationTheme !== "formError") {
      setValidation("formHover");
    }
    if(!calendarVisible)
    {
      if (!disabled && validationTheme !== "formError") {
        setValidation("form");
      }
    }
  },[calendarVisible])

  const handleLegendNameOnBlur = () => {
        //setTimeout(() => setCalendarVisible(false), 100);

    if (!disabled && validationTheme !== "formError") {
      setValidation("form");
    }
  };

  const handleDateChange = (e) => {
    const selected = e.value;

    if (dateRange) {
        if (Array.isArray(selected) && selected.length === 2) {
            setDate(selected);
            //setSelectedDate(selected);

                const formattedStartDate = moment(selected[0]).format(dateFormat);
                const formattedEndDate = moment(selected[1]).format(dateFormat);
                // console.log("::::::::::formattedStartDate::::::::", formattedStartDate);
                // console.log("::::::::::formattedEndDate::::::::", formattedEndDate);
                if(formattedEndDate!=="Invalid date")
                {
                setSelectedDate(`${formattedStartDate} - ${formattedEndDate}`);
                }
            if (onChange) {
                onChange(`${formattedStartDate} - ${formattedEndDate}`,validation);
            }
       }

    } else {

        if (onChange) {
            const formattedDate = moment(selected).format(dateFormat);
            setSelectedDate(formattedDate);
            if(showTime && !showSeconds)
            {
                    var temp = formattedDate.slice(0,formattedDate.length-3)
                    setDate(temp);
                    onChange(temp,validation);
            }
            else
            {
            setDate(selected);
            onChange(formattedDate,validation);
            }
        }

    }
};



const handleTimeChange = (e) => {
  let selectedDate = e.value;

  if (selectedDate instanceof Date && !isNaN(selectedDate)) {
    let hours = selectedDate.getHours();
    let minutes = selectedDate.getMinutes();

    if (e.originalEvent) {
      const prevMinutes = date?.getMinutes();

      if (prevMinutes !== undefined && hours === date?.getHours()) {
        const lastStep = 60 - minutesOffset;

        if (minutes === 0 && prevMinutes === lastStep) {
          hours = (hours + 1) % 24;
          selectedDate.setHours(hours, 0, 0);
        }

        if (minutes === lastStep && prevMinutes === 0) {
          hours = (hours - 1 + 24) % 24; 
          selectedDate.setHours(hours, lastStep, 0);
        }
      }
    }

    const timeStr = showSeconds
      ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(selectedDate.getSeconds()).padStart(2, '0')}`
      : `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    onChange(timeStr,validation);
    setDate(selectedDate);
    setFormattedTime(timeStr);

  }
};



const handleDateChangeInput = (e) => {
  let value = e.target.value;

  if (timeOnly) {
    value = value.replace(/\D/g, "");
    if(value.length< 4)
    {
     setValidation("formError");
     setTooltipMessageContent("Invalid date,Enter the date in valid format:"+placeholder);
    }
    else
    {
     setValidation("form");
     setTooltipMessageContent("");
    } 
    if (value.length > 4) {
      value = value.slice(0, 4);
    }

    if (value.length > 2) {
      value = value.slice(0, 2) + ":" + value.slice(2);
    }

    if (value.length === 5) {
      const [h, m] = value.split(":").map(Number);

      if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
        const d = tempDate;
        //console.log(":::d:::::"+d);
        d.setHours(h, m, 0, 0);
        setDate(d);
        setFormattedTime(value);
        onChange(value,validation);
      } else {
        setFormattedTime(""); // invalid → clear
        onChange("",validation);
      }
    } else {
      setFormattedTime(value);
      onChange(value,validation);
    }
  } else {
    setDate(e.target.value);
    onChange(e.target.value,validation);
  }
};


const getMinDate = () => {
	return minDaysFromToday !== null ? moment().add(minDaysFromToday, 'days').toDate() : null;
};

const getMaxDate = () => {
	return maxDaysFromToday !== null ? moment().add(maxDaysFromToday, 'days').toDate() : null;
};

const toggleCalendar = () => {
	setCalendarVisible(prevState => {
		return !prevState;
	});
};

const outsideClickListener = (event) => {
	if (calendarRef.current && !calendarRef.current.contains(event.target)) {
		setCalendarVisible(false);
	}
};





const resetDate = () => {
    setDate(null);
    setSelectedDate(null);
    if (onChange) {
      onChange(null);
    }
  };

  useImperativeHandle(ref, () => ({
    resetDate: () => {
      resetDate();
    }
  }));

  const getView = () => {
    if (yearPicker) return "year";
    if (monthPicker) return "month";
    return "date";
  };

  useEffect(() => {
    document.addEventListener('mousedown', outsideClickListener);
    return () => {
      document.removeEventListener('mousedown', outsideClickListener);
    };
  }, []);




  const formattedDate = dateRange && date? Array.isArray(date) && date[0] && date[1]

  ? `${moment(date[0]).format("YYYY-MM-DD")} - ${moment(date[1]).format("YYYY-MM-DD")}`

  : ''  : !dateRange && date && showTime && !showSeconds ? moment(date).format(dateFormat).slice(0,-3) : !dateRange && date ? moment(date).format(dateFormat) : selectedDate;
  //console.log("::::::formattedDate:::::"+formattedDate+":::::date:::::"+date);
  return (
    <div className={`${validation} ${disabled ? 'tss-disableField' : ""} `}>
      <fieldset className="p-2 selectHover " id="TSSGUI_DateFieldSetStyle">
        <legend className="w-auto" style={{ position: 'relative' }}>
          <p className="mb-0" id="TSSGUI_InputTextFieldLabelStyle">
            &nbsp;&nbsp;{label}<span className='mandatory' style={{ display: mandatory ? "inline" : "none" }}>*</span>&nbsp;&nbsp;
          </p>
        </legend>
        <div ref={calendarRef} style={{ position: "relative" }}>
          <input
            style={{zIndex:1,width:showTime || !dateRange?"80%":"96%",background:"none"}}
            type="text"
            value={timeOnly ? formattedTime: formattedDate}
            title={formattedDate}
            onFocus={() => setCalendarVisible(true)}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={!timeOnly}
            onFocus={!timeOnly ? e => e.target.blur() : ()=>{}}
            className='tss-datePicker-input'
            onChange={timeOnly ? handleDateChangeInput: () => {}}
          />
          {!disabled && calendarVisible && (
            <Calendar
              style={{zIndex:9999}}
              className={`tss-datePicker ${darkMode? 'tss-datePicker-dark' : ''}`}
              value={dateRange ? (Array.isArray(date) ? date : []) : date}
              onChange={timeOnly? handleTimeChange : handleDateChange}
              selectionMode={dateRange ? "range" : "single"}
              dateFormat={"yy-mm-dd"}
              showTime={showTime}
              showSeconds={showSeconds}
              disabled={disabled}
              minDate={getMinDate()}
              maxDate={getMaxDate()}
              view={getView()}
              hourFormat="24"
              timeOnly = {timeOnly}
              stepMinute={minutesOffset}
              inline
            />
          )}
          <TssIcon iconKey="tss_calender" className={`tss-primary-icon tss_calender_iconStyle ${darkMode? 'tss_calender_iconStyle-dark' : ''}`}  onClick={toggleCalendar} />
        </div>
      </fieldset>
      {displayRequiredIcon &&
        <CustomTooltipFeildSet content={tooltipMessageContent} theme="Dark">
          <TssIcon iconKey="tss_errorAlert" className="tss-danger-icon tss-datePickerRequiredIcon" />
        </CustomTooltipFeildSet>
      }
    </div>
  );
});

export default TssDatePicker;

