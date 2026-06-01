import React from 'react';

import { useEffect, useState,useRef ,Component} from 'react';
import '@modules/common/default/scss/TssComponentsCss.scss';
import { toast } from 'react-toastify';


import TssTextArea from '@modules/common/default/components/TssTextArea';

import TssFileUpload from '@modules/common/default/components/TssFileUpload'
import TssTextBox from '@modules/common/default/components/TssTextBox';
import TssSelectBox from '@modules/common/default/components/TssSelectBox';
import TssSelectBoxSearch from '@modules/common/default/components/TssSelectBoxSearch'
import TssInputGroup from '@modules/common/default/components/TssInputGroup';

import TssMultiSelectBox from '@modules/common/default/components/TssMultiSelectBox';
import TSSMultiSelectGrouping from '@modules/common/default/components/TSSMultiSelectGrouping'

import TssCheckbox from '@modules/common/default/components/TssCheckbox';
import TssIcon from '@modules/common/default/components/TssIcon';
import TssDatePicker from '@modules/common/default/components/TssDatePicker'
import TssButton from '@modules/common/default/components/TssButton'

import TssIPAddress from '@modules/common/default/components/TssIPAddress'
import TssRadioButton from '@app/modules/common/default/components/TssRadioButton'

import TssTab from '@app/modules/common/default/components/TssTable'

import TssControlSelect from '@app/modules/common/default/components/TssControlSelect'
import TssTableComponent from '@app/modules/common/default/components/TssTableComponent'

import TssReportsTable from '@app/modules/common/default/components/TssReportsTable'

//import BottomFloatingAlert from '/home/tmt/reactJs/tssgui/src/modules/smsc/provisioning/SampleText.jsx'

import { Form } from 'react-bootstrap';
//import Button from '@mui/material/Button';
import 'uikit/dist/css/uikit.min.css';
import 'icheck-material/icheck-material.min.css'
import 'admin-lte/dist/css/adminlte.min.css';
import 'admin-lte/plugins/fontawesome-free/css/all.min.css'; 
import 'admin-lte/plugins/icheck-bootstrap/icheck-bootstrap.min.css'; 
import 'admin-lte/plugins/jquery/jquery.min.js'; 
import 'admin-lte/plugins/bootstrap/js/bootstrap.bundle.min.js'; 
import 'admin-lte/dist/js/adminlte.min.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import ConfirmationDialog from '@app/modules/demo/ConfirmationDialog';
//import 'admin-lte/dist/css/adminlte.dark.min.css'; // Dark theme from AdminLTE
import "admin-lte/dist/css/alt/adminlte.light.min.css";



function FormElements() {

  
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedOptions, setSelectedOptions] = useState("");
  const [multiSelectOptions, setMultiSelectOptions] = useState(null);
  const [validationTheme, setValidationTheme] = useState("form");
  const [inputValue, setInputValue] = useState("hello");
  const [inputGroupValue, setInputGroupValue] = useState("");
  const [textAreaValue, setTextAreaValue] = useState("");
  const [inputGroupValidation, setInputGroupValidation] = useState("form");
  const [textAreaValidationTheme, setTextAreaValidationTheme] = useState("form");
  const [selectedDate, setSelectedDate] = useState(null);
  
  const [multipleOptionSelect,setMultipleOptionSelect] = useState(null);
  const [selectAccount,setSelectAccount] = useState("");
  const [selectedFileName,setSelectedFileName] = useState("");
  const [startDate,setStartDate] = useState("");
  const checkedValues=[];
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [action, setAction] =useState("");

  const [selectBoxKey, setSelectBoxKey] = useState(0); 
  
  const [nameInputValue,setNameInputValue] = useState("");

  const [selectValidationTheme,setSelectValidationTheme] = useState("selectForm");
  const [selectTooltipMessage,setSelectTooltipMessage] = useState("");

  const [multiselectValidationTheme,setMultiSelectValidationTheme] = useState("selectForm");
  const [multiSelectTooltipMessage,setMultiSelectTooltipMessage] = useState("");

  const [multiselectGroupingValidationTheme,setMultiSelectGroupingValidationTheme] = useState("selectForm");
  const [multiSelectGroupingTooltipMessage,setMultiSelectGroupingTooltipMessage] = useState("");
 
  const [searchSelectValidationTheme,setSearchSelectValidationTheme] = useState("selectForm");
  const [searchSelectTooltipMessage,setSearchSelectTooltipMessage] = useState("");

  const [leftContainerList,setLeftContainerList] = useState([])
  const [rightContainerList,setRightContainerList] = useState([])

  const [fileResetKey,setFileResetKey] = useState(0)

  const [radioButtonKey,setRadioButtonKey] = useState(0)
 
  const controlOptions = [
    { label: "The Client's configured quota is over, and he will not be able to push the messages", value: "The Client's configured quota is over, and he will not be able to push the messages" },
    { label: "The client is aletered whenever quota is added to his account", value: "The client is aletered whenever quota is added to his account" },
    { label: "The client is alerted when the system retry buffer is full", value: "The client is alerted when the system retry buffer is full" },
    { label: "The client is alerted on success creation of his account in the system", value: "The client is alerted on success creation of his account in the system" },
    { label: "The client is alerted when his account is deleted from the system", value: "The client is alerted when his account is deleted from the system" },
    { label: "File processing has been started", value: "File processing has been started" },
    { label: "File processing is 25% complete", value: "File processing is 25% complete" },
    { label: "File processing is 50% complete", value: "File processing is 50% complete" },
    { label: "File processing is 75% complete", value: "File processing is 75% complete" },
    { label: "File processing is completed", value: "File processing is completed" },
    { label: "File processing has been forcefully stopped by super or admin", value: "File processing has been forcefully stopped by super or admin" },
    { label: "File processing has stopped due to invalid timezone", value: "File processing has stopped due to invalid timezone" },
    { label: "File processing has been stopped by super or admin", value: "File processing has been stopped by super or admin" },
    { label: "File processing has been paused due to invalid timezone", value: "File processing has been paused due to invalid timezone" },
    { label: "File processing has been paused as green channel file processing is in progress", value: "File processing has been paused as green channel file processing is in progress" },
    { label: "File processing has been paused", value: "File processing has been paused" },
    { label: "File processing has been restarted", value: "File processing has been restarted" },
    { label: "File has been rejected due to some validations in the system", value: "File has been rejected due to some validations in the system" },
    { label: "File has been stopped due to validity period expired", value: "File has been stopped due to validity period expired" },
    { label: "Every client sets a threshold for the message limit available in the system, on reaching of the threshold the client would be alerted", value: "Every client sets a threshold for the message limit available in the system, on reaching of the threshold the client would be alerted" },
    { label: "The client is alerted when the validity of his account is expired", value: "The client is alerted when the validity of his account is expired" }
  ];
  
  const handleFileReset =() => {
    setFileResetKey(preValue =>preValue+1)
  }
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age',isSelectBox:true },
    { key: 'email', label: 'Email',isMultiSelectBox:true},
    { key: 'RlNo', label:'Number',isTextArea:true}
  ];

  const data = [
    { name: 'John Doe', age: 28, email: 'john@example.com' },
    { name: 'Jane Smith', age: 34, email: 'jane@example.com' },
    { name: 'Alice Johnson', age: 25, email: 'alice@example.com' },
    { name: 'Bob Brown', age: 30, email: 'bob@example.com' }

    // Add more data as needed
  ];
  const options =[
    { label: 'View', value: '1'},
    { label: 'Add', value: '2'},
    { label: 'Modify', value: '3'},
    { label: 'Delete', value: '4'},
    { label: 'Option1', value: '5' },
    { label: 'Option2', value: '6' },
    { label: 'Option3', value: '7' },
  ];


  const optionsSelectCheck = [
    { label: 'Option1', value: '1' },
    { label: 'Option2', value: '2' },
    { label: 'Option3', value: '3' },
  ];

  const optionsSelectCheckMUI = [
    { label: 'Option1', value: '1' },
    { label: 'Option2', value: '2' },
    { label: 'Option3', value: '3' },
  ];

 
  const multiSelectDefaultValue=[{ label: 'Option1', value: '1' },
  { label: 'Option2', value: '2' }]

  const optionsSelectionForMultipleGrouping =  [
    {
    label: 'Label 1',
    options: [
      { value: 1, label: 'One' },
      { value: 2, label: 'Two' },
      { value: 3, label: 'Three' }
    ]
  },
  {
    label: 'Label 2',
    options: [
      { value: 4, label: 'Four' },
      { value: 5, label: 'Five' },
      { value: 6, label: 'Six' }
    ]
  }
  ];


  const radioOptions = [
    { label: 'File Upload', value: '1', defaultChecked: true },
    { label: 'File Upload2', value: '2', defaultChecked: false }
  ];

  const handleClear = () =>
  {
    toast.success('Success Toast');
  }
  
  const handleReset = () =>
  {
    toast.error("Error Toast");
  }
  const [checkboxOptions,setCheckboxOptions] = useState(radioOptions);

  const [selectedRadioOptions, setSelectedRadioOptions] = useState(null);

  const handleRadioChange = (index, isChecked) => {
    if (isChecked) {
      setSelectedRadioOptions(index);
      console.log(":::::::::Selected Values::::::"+index)
    }
  };
 
  const handleCheckboxChange = (index, checked) => {
    const updatedOptions = checkboxOptions.map((option, i) => 
      i === index ? { ...option, defaultChecked: checked } : option
    );
    setCheckboxOptions(updatedOptions);
    
    const checkedValues = updatedOptions
      .filter(option => option.defaultChecked)
      .map(option => option.value);

    console.log("Checked values: " + checkedValues.join(", "));
  };


  const [fileValidation,setFileValidation] = useState("form")
  const [fileTooltipMessage,setFileTooltipMessage] = useState("")

  const handleFileChange = (file) => {
    setSelectedFileName(file);
    setFileValidation("formError")
    setFileTooltipMessage("TooltipMessage")
    console.log('Selected file:', file);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option.value);
    setSelectAccount(option);
    if(option.label==="Add")
    {
      console.log(":::::::inside::::::::")
      setSelectValidationTheme("selectFormError")
      setSelectTooltipMessage("Required");

    }
    else
    {
      setSelectValidationTheme("selectForm")
    
    }
  };

  const handleSearchOptionSelect =(option) => {
    setSelectedOption(option);
    setSelectAccount(option);
    if(option.label==="Add")
    {
      console.log(":::::::inside::::::::")
      setSearchSelectValidationTheme("selectFormError")
      setSearchSelectTooltipMessage("Required");

    }
    else
    {
      setSearchSelectValidationTheme("selectForm")
    
    } 
  }



  const handleDateChange = (date) => {
    setSelectedDate(date);
    
  };



  
  const handleSelect = (option) => {
    setSelectedOption(option);
    console.log("Selected Option:", option.label);
   };

   const handleMultipleOptionSelect = (selected) => {
    setMultipleOptionSelect(selected);
    console.log("Selected Option:", selected);
    if(selected.includes("Two")){
    console.log(":inside grouping")
    setMultiSelectGroupingValidationTheme("selectFormError");
    setMultiSelectGroupingTooltipMessage("Required");
    }
    else
    {
      setMultiSelectGroupingValidationTheme("selectForm");
    }
  };

  
  const handleSelectAll = (selected) => {
    setSelectedOptions(selected);
  };

  const handleMultiSelect = (options) => { 
    console.log("Selected Option:", options);
    if(options.includes("2"))
      {
        console.log(":::::::inside::::::::")
        setMultiSelectValidationTheme("selectFormError")
        setMultiSelectTooltipMessage("Required");
  
      }
      else
      {
        setMultiSelectValidationTheme("selectForm")
      
      }
  };

  

  const handleOnClick= (e) => {
     alert("onclick");
  }	  
   

  const handleChange = (event) => {
    const inputValue = event.target.value;
    setInputValue(inputValue)
    if (inputValue === "") {
      setValidationTheme("formHover");
    } else {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(inputValue)) {
        setValidationTheme("formError");
      } else {
        // setValidationTheme("formSuccess");
        setValidationTheme("formHover");
      }
    }

  }

  const handleInputGroupChange = (event) => {
    const inputValue = event.target.value;
    setInputGroupValue(inputValue)
    if (inputGroupValue === "") {
      setInputGroupValidation("formHover");
    } else {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(inputValue)) {
        setInputGroupValidation("formError");
      } else {
        // setInputGroupValidation("formSuccess");
        setValidationTheme("formHover");
      }
    }

  }

  const textBoxProp = {
			
    "type" : "text",
     "onChange" : handleChange,
     "value" : inputValue,
};


 const [number,setNumber] = useState("");
 const handleNumberChange = (inputData) => {
   setNumber(inputData.target.value);
 }
 const textBoxProp1 = {
  type: "number",
  value: number,
  maxLength: 5,
  onChange: handleNumberChange,
};
 const handleResetInput = () => {

  setRadioButtonKey(prevValue=>prevValue+1)
  setInputValue("");
  setInputGroupValue("");
  setTextAreaValue("");
  
  if (selectedOption == "")
    {
      console.log(":::::::inside::::::::")
      setSelectValidationTheme("selectFormError")
      setSelectTooltipMessage("Required");
    }
  setSelectedOption({value:"",label:""});
  setSelectBoxKey(prevKey => prevKey + 1);
 }

  const inputGroupProp = {
			
   "type" : "text",
   "onChange" :handleInputGroupChange ,
   "value" : inputGroupValue,
  };
  const handleInputChange = (event) => {
    const inputValue = event;
    if (inputValue === "") {
      setValidationTheme("formHover");
    } 

  }

  const handleTextAreaInputChange = (event) => {
    const inputValue = event.target.value;
    setTextAreaValue(inputValue);
    if (inputValue === "") {
      setTextAreaValidationTheme("formHover");
    } else {
        if(inputValue.length >10) {
          setTextAreaValidationTheme("formError");
      } else {
        // setTextAreaValidationTheme("formSuccess");
        setTextAreaValidationTheme("formHover");
      }
    }

  }

  const textAreaProp = {
    "onChange" : handleTextAreaInputChange,
    "value" : textAreaValue,
    
  }

  const prependElements =[
    // <TssIcon iconKey="tss_add" className="tss-primary-icon" />,
    // <TssIcon iconKey="tss_delete" className="tss-primary-icon" />,
   
  ]

  const appendElements =[
   
    // <TssTextBox  
              
    //           inputInfo="The domain name must contain at least one period and can only contain letters, numbers, and hyphens."
    //           placeholderName="Enter Email"
    //           validation={validationTheme}
    //           tooltipMessage="Warning"
    //           label="Email" 
    //           mandatory={true} 
    //           properties={textBoxProp}
    //           disabled={false}
              
    //         /> 

    <TssSelectBox
                key={selectBoxKey}
                label="Time format"
                mandatory={true}
                options={[
                  {label:"Seconds" , value : 0},
                  {label:"Minutes" , value : 1},
                  {label:"Hours" , value : 2},
                  {label:"Days" , value: 3},
                  {label:"Months" , value : 4},
                ]}
                placeholder=''
                defaultValue={selectedOption}
                onChange={handleOptionSelect}
                validationTheme={selectValidationTheme}
                tooltipMessage={selectTooltipMessage}
                
              />
            
   
  ]

  const inputElement = [
    <TssTextBox  
    disabled={false}  
    inputInfo="The domain name must contain at least one period and can only contain letters, numbers, and hyphens."
    placeholderName="Enter Email"
    validation={inputGroupValidation}
    tooltipMessage="Warning"
    label="Email" 
    mandatory={true} 
    properties={inputGroupProp}
  /> 
    ]  
  
  const handleIpAddreess =(ipAddress) => {
    console.log(":::::IP Address:::::::"+ipAddress)
  }

  
  const handleNameInput =(event) =>{
    setNameInputValue(event.target.value)
    console.log(":::::::name input::::::"+event.target.input1.value)
  }


  const handleSelectedOptions=(leftEvents,rightEvents) => {

    setLeftContainerList(leftEvents)
    setRightContainerList(rightEvents)
    // console.log("::::::leftEvents::::::::"+JSON.stringify(leftEvents))
    // console.log("::::::rightEvents::::::::"+JSON.stringify(rightEvents))
  }

  const tHeader =()=>{
    return (
    <tr>
      <th>Data1</th>
      <th>Data2</th>
      <th>Data3</th>
    </tr>
    );
  }

  const tBody=()=>{
    return (
      <>
      <tr>
        <td>Data1Row1</td>
        <td>Data2Row1</td>
        <td>Data3Row1</td>
      </tr>
      <tr>
        <td>Data1Row2</td>
        <td>Data2Row2</td>
        <td>Data3Row2</td>
      </tr>
      </>
      
      )
  }

  const tFooter = () => {
    return (
      <tr>
        <td>Data1Footer</td>
        <td>Data2Footer</td>
        <td>Data3Footer</td>
      </tr>
    );
  }
  

  return (
    
       <div style={{width:"95%",padding:"10px",height:"350vh"}}>




        {/*===============================================================================================================================*/}
         <div className='row'>
             
             <div className='col-md-3'>

                     <TssTextBox  
                         
                        inputInfo="The domain name must contain at least one period and can only contain letters, numbers, and hyphens."
                        placeholderName="Enter Email"
                        validation={validationTheme}
                        tooltipMessage="Warning"
                        label="Email" 
                        mandatory={true} 
                        properties={textBoxProp}
                        disabled={false}
                        
                      /> 
                    
             </div>
             
             {/* <div className="col-md-4">
             <TssTextBox  
                         
                         validation={validationTheme}
                         label="Number" 
                         mandatory={true} 
                         properties={textBoxProp1}
                         disabled={false}
                         
                       /> 

              </div> */}
             


         </div>
        
         
         {/* ================================================================================================================*/}
         <br />
         <br />
         <div className='row'>
          <div className='col-md-5' style={{marginLeft:"-10px"}} >
                <TssInputGroup 
                     prependElements={prependElements}
                     appendElements={appendElements}
                     inputElement={inputElement}
                    />
          </div>
          <div className='col-md-3' style={{marginLeft:"10px"}} >
                    {/* <DatePickerComponent/> */}
                
          </div>        
         </div>
         <br />
         <br />

         
       
         {/*================================================================================================================*/}
        <div className='row'>
        <div className='col-md-3'>
               <div className="form-group " >
               <TssTextArea label= "Bootstrap Text Area " placeholder="Text Area" validation={textAreaValidationTheme} properties={textAreaProp} mandatory={false}/>
               </div>
          </div>

          <div className='col-md-3'>
          
          <TssIPAddress 
          label="IP Address" 
          mandatory={true} 
          onChange={handleIpAddreess} 
          min={0} 
          max={255} 
          defaultValue='10.1.5.122'/>
          
          </div>
        
        </div>  
        
        
         {/*===================================================================================================================*/}
         <div className='row'>
        <div className='col-md-3'>
        <label>&nbsp;&nbsp;&nbsp;</label>
              <TssSelectBox
                key={selectBoxKey}
                label="Select an option"
                mandatory={true}
                options={options}
                defaultValue={selectedOption}
                onChange={handleOptionSelect}
                validationTheme={selectValidationTheme}
                tooltipMessage={selectTooltipMessage}
                
              />

        </div>
       

        <div className='col-md-3'>
          <label>&nbsp;&nbsp;&nbsp;</label>
         
          <TssSelectBoxSearch
                label="Select an option"
                mandatory={true}
                options={options}
                defaultValue={options.find(element=>element.value==selectedOption.value)}
                onSelect = {handleSearchOptionSelect}
                disabled={false}
                validationTheme={searchSelectValidationTheme}
                tooltipMessage={searchSelectTooltipMessage}
              
              />
        </div>

        <div className='col-md-3'>
          <label>&nbsp;&nbsp;&nbsp;</label>
          <TssMultiSelectBox 
           label="MultiSelect"  
           options={options} 
           onSelect={handleMultiSelect} 
           defaultValue="Select All"
           isSeachable={true}
           selectAllOption={true}
           mandatory={true}
           validationTheme={multiselectValidationTheme}
           tooltipMessage={multiSelectTooltipMessage}
          
           />
         
        </div>
        <div className='col-md-3'>
        <label>&nbsp;&nbsp;&nbsp;</label>
              <TSSMultiSelectGrouping 
               mandatory={true} 
               options={optionsSelectionForMultipleGrouping} 
               onChange={handleMultipleOptionSelect} 
               label="MultiSelect with Grouping" 
               defaultValue={[]}
               validationTheme={multiselectGroupingValidationTheme}
               tooltipMessage={multiSelectGroupingTooltipMessage} />

          </div>
      </div>
      <br/>
      <br/>


      {/*==========================================================================*/}
     
     
     
      
      <br/>
      <br />

      
      <div className='row'>
             <div className='col-md-3' >
               <TssDatePicker label="Date"
                  onChange={handleDateChange} 
                  dateTimeEnabled={true}
                  dateLimit={-60} 
                 />
             </div>
             <div className='col-md-3'>
                  <TssFileUpload label="File Upload" validation={fileValidation} tooltipMessage={fileTooltipMessage} onFileChange={handleFileChange} disabled={false} key={fileResetKey}/>
            </div>
            <div className='col-md-3' style={{marginTop:"1%"}}>
                  <TssButton label="File Reset" onClick={handleFileReset}/>
            </div>
        </div>
        <br />
        
      {/*==================================================================================== */}
      <div className='row'>
          
      </div>
      <br />
     {/*==================================================================================== */}
   
      <br />
      <br/>

               <TssCheckbox options={checkboxOptions} onCheckboxChange={handleCheckboxChange} columns={7}/>

       <br />
       <br/>  
       <br />
         <div className="row">
             <TssButton onClick={handleResetInput} className="btn btn-primary" label="Reset" />
          </div>
        <br />
        <br />
         
       <div className='row'>   
               <div className='col-md-3' >      
               <TssRadioButton columns={1} options={checkboxOptions} onChange={handleRadioChange} uniqueId="first" key={radioButtonKey}/>
               </div>
               
               <div className='form-group col-md-3' >
               <TssTextBox  
                         
                         inputInfo="The domain name must contain at least one period and can only contain letters, numbers, and hyphens."
                         placeholderName="Enter Email"
                         validation={validationTheme}
                         tooltipMessage="Warning"
                         label="Email" 
                         mandatory={true} 
                         properties={textBoxProp}
                         disabled={false}
                         
                       /> 
                </div>  
                <div className='form-group col-md-2' style={{width:"150px"}}>    
                <TssRadioButton columns={1} options={checkboxOptions} onChange={handleRadioChange} id="second"/>   
                </div> 
       </div>    
       <br />
       <br />


        {/* <TssTab columns={columns} data={data} options={options} />    */}
          <br />
          <br />
          <div className='row'>
            <div className='col-md-12'>
            <TssControlSelect headings={["SelectBox1","SelectBox2"]}  options={[controlOptions,[]]} onChange={handleSelectedOptions} isSearchable={true} isOptionsMovable={true} moveAll={true}/>
            </div>
          </div>
           
        
          <br />
          <br />
          <br />
          <br />
          <TssTableComponent 
          id="reportTable"
          headers={[
            
            [
              { label: "Header 1", colSpan: 2, rowSpan: 2 },
              { label: "Header 2", colSpan: 3, rowSpan: 1 },
              { label: "Header 3", colSpan: 3, rowSpan: 1 }
            ],
         
            [
              { label: "Subheader 2.1", colSpan: 1, rowSpan: 1 },
              { label: "Subheader 2.2", colSpan: 1, rowSpan: 1 },
              { label: "Subheader 2.1", colSpan: 1, rowSpan: 1 },
              { label: "Subheader 3.1", colSpan: 1, rowSpan: 1 },
              { label: "Subheader 3.2", colSpan: 1, rowSpan: 1 },
              { label: "Subheader 3.3", colSpan: 1, rowSpan: 1 }
            ]
          ]} 

          rows={[[
            { content: "Row 1 Col 1", rowSpan:1,colSpan: 2 },
            { content: "Row 1 Col 2.1", colSpan: 1 },
            { content: "Row 1 Col 2.2", colSpan: 1 },
            { content: "Row 1 Col 2.3", colSpan: 1 },
            { content: "Row 1 Col 3.1", colSpan: 1 },
            { content: "Row 1 Col 3.2", colSpan: 1 },
            { content: "Row 1 Col 3.3", colSpan: 1 },
          ],
          [
            { content: "Row 2 Col 1", rowSpan: 1,colSpan:2 },
            { content: "Row 2 Col 2.1", colSpan: 1 },
            { content: "Row 2 Col 2.2", colSpan: 1 },
            { content: "Row 2 Col 2.3", colSpan: 1 },
            { content: "Row 2 Col 3.1", colSpan: 1 },
            { content: "Row 2 Col 3.2", colSpan: 1 },
            { content: "Row 2 Col 3.3", colSpan: 1 },
          ],
          [
            { content: "Row 3 Col 1", rowSpan: 1,colSpan:2 },
            { content: "Row 3 Col 2.1", colSpan: 1 },
            { content: "Row 3 Col 2.2", colSpan: 1 },
            { content: "Row 3 Col 2.3", colSpan: 1 },
            { content: "Row 3 Col 3.1", colSpan: 1 },
            { content: "Row 3 Col 3.2", colSpan: 1 },
            { content: "Row 3 Col 3.3", colSpan: 1 }
          ]
        ]} />


        <br />
        <br />

        <TssTableComponent 
          id="componenetTable"
          headers={[
            
            [
              { label: "Header 1", colSpan: 1, rowSpan: 1 },
              { label: "Header 2", colSpan: 1, rowSpan: 1 },
              { label: "Header 3", colSpan: 1, rowSpan: 1 }
            ]
          ]} 

          rows={[[
            { content: "Row 1 Col 1", rowSpan:1,colSpan: 1 },
            { content: <TssSelectBox
              key={selectBoxKey}
              label="Select an option"
              mandatory={true}
              options={options}
              defaultValue={selectedOption}
              onChange={handleOptionSelect}
              />, 
              rowSpan:1,colSpan: 1 
            },
            { content: <TssTextArea 
                        label= "Bootstrap Text Area " 
                        placeholder="Text Area"  
                        properties={textAreaProp} 
                        mandatory={false}
                      />, 
              rowSpan:1,colSpan: 1 
            },
          ],
          [
            { content: "Row 2 Col 1", rowSpan:1,colSpan: 1 },
            { content: <TssSelectBox
              key={selectBoxKey}
              label="Select an option"
              mandatory={true}
              options={options}
              defaultValue={selectedOption}
              onChange={handleOptionSelect}
              />, 
              rowSpan:1,colSpan: 1 
            },
            { content: <TssTextArea 
                        label= "Bootstrap Text Area " 
                        placeholder="Text Area"  
                        properties={textAreaProp} 
                        mandatory={false}
                      />, 
              rowSpan:1,colSpan: 1 
            },
          ]
        ]} />

        <br />
        <br />
        <TssTableComponent 
          id="noramlTable"
          headers={[
            
            [
              { label: "Header 1" },
              { label: "Header 2" },
              { label: "Header 3" }
            ]
          ]} 

          rows={[[
            { content: "Row 1 Col 1"},
            { content: "Row 1 Col 2"},
            { content: "Row 1 Col 3"},
          ],
          [
            { content: "Row 2 Col 1"},
            { content: "Row 2 Col 2"},
            { content: "Row 2 Col 3"},
          ],
          [
            { content: "Row 2 Col 1"},
            { content: "Row 2 Col 2"},
            { content: "Row 2 Col 3"},
          ],
          [
            { content: "Row 2 Col 1"},
            { content: "Row 2 Col 2"},
            { content: "Row 2 Col 3"},
          ],
          [
            { content: "Row 2 Col 1"},
            { content: "Row 2 Col 2"},
            { content: "Row 2 Col 3"},
          ],
          [
            { content: "Row 2 Col 1"},
            { content: "Row 2 Col 2"},
            { content: "Row 2 Col 3"},
          ],
          [
            { content: "Row 2 Col 1"},
            { content: "Row 2 Col 2"},
            { content: "Row 2 Col 3"},
          ],
          [
            { content: "Row 2 Col 1"},
            { content: "Row 2 Col 2"},
            { content: "Row 2 Col 3"},
          ],
          [
            { content: "Row 2 Col 1"},
            { content: "Row 2 Col 2"},
            { content: "Row 2 Col 3"},
          ],
          [
            { content: "Row 2 Col 1"},
            { content: "Row 2 Col 2"},
            { content: "Row 2 Col 3"},
          ],
          [
            { content: "Row 2 Col 1"},
            { content: "Row 2 Col 2"},
            { content: "Row 2 Col 3"},
          ],
          [
            { content: "Row 2 Col 1"},
            { content: "Row 2 Col 2"},
            { content: "Row 2 Col 3"},
          ]

        ]} />

        <br />
        <br />

        <TssTableComponent 
         id="accountTable"
         headers={[
          [
            { label: "Product" },
            { label: "Account Type" }
          ]
        ]} 

          rows={[[
            { content:"SMSC"},
            { content:  
              <TssSelectBox
                key={selectBoxKey}
                label="Select an option"
                mandatory={true}
                options={options}
                defaultValue={selectedOption}
                onChange={handleOptionSelect}
              />
            }
          ],
          [
            { content:"USSD"},
            { content:  
              <TssSelectBox
                key={selectBoxKey}
                label="Select an option"
                mandatory={true}
                options={options}
                defaultValue={selectedOption}
                onChange={handleOptionSelect}
              />
            }
          ]
        ]} />

        <br />
        <br />

        <TssReportsTable 
             tableHeader={tHeader} tableBody={tBody} tableFooter={tFooter} id="Table" reportName='test'
        />
          {/* <div className='row'> 
  
              <div className='col-12' style={{position:"relative"}}>
              <table className="tss-datatable tss-datatable-striped" style={{position:"absolute",width:"100%"}}>
                <thead className="tss-datatable-thead">
                    <tr className="tss-datatable-header tss-sortable-column">
                        <th>Product</th>
                        <th>Account Type</th>
                    </tr>
                </thead>
                <tbody className="tss-datatable-tbody">
                    <tr>
                        <td>USSD</td>
                        <td>
                            <TssSelectBox
                                key={selectBoxKey}
                                label="Select an option"
                                mandatory={true}
                                options={options}
                                defaultValue={selectedOption}
                                onChange={handleOptionSelect}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>USSD</td>
                        <td>
                            <TssSelectBox
                                key={selectBoxKey}
                                label="Select an option"
                                mandatory={true}
                                options={options}
                                defaultValue={selectedOption}
                                onChange={handleOptionSelect}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>USSD</td>
                        <td>
                            <TssSelectBox
                                key={selectBoxKey}
                                label="Select an option"
                                mandatory={true}
                                options={options}
                                defaultValue={selectedOption}
                                onChange={handleOptionSelect}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
          </div>
               

       </div>     */}
  
     </div> 

     
     

  );
}
 
export default FormElements;
