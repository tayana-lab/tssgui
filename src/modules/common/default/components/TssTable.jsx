import React from "react";
import { useState, useEffect } from 'react';
import TssTextArea from '@modules/common/default/components/TssTextArea';
import 'primeicons/primeicons.css';
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
const TssTable =({ columns, data, options,defaultTable=true }) => {
    const [sortedColumn, setSortedColumn] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortedData, setSortedData] = useState([...data]);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedOptions, setSelectedOptions] = useState("");
    const [selectBoxKey, setSelectBoxKey] = useState(0); 
    const [textAreaValidationTheme, setTextAreaValidationTheme] = useState("form");
    const [textAreaValue, setTextAreaValue] = useState("");
  const [multiselectValidationTheme,setMultiSelectValidationTheme] = useState("selectForm");
  const [multiSelectTooltipMessage,setMultiSelectTooltipMessage] = useState("");
 

    useEffect(() => {
      setSortedData([...data]);
    }, [data]);
  
    const handleSearch = (query) => {
      setSearchQuery(query);
      if (query) {
        const filteredData = data.filter((row) =>
          columns.some((column) =>
            row[column.key].toString().toLowerCase().includes(query.toLowerCase())
          )
        );
        setSortedData(filteredData);
      } else {
        setSortedData([...data]);
      }
    };
  
    const handleSort = (columnKey) => {
      let sortedArray = [...sortedData];
      if (sortedColumn === columnKey) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        sortedArray.reverse();
      } else {
        setSortedColumn(columnKey);
        setSortOrder('asc'); 
        sortedArray.sort((a, b) =>
          a[columnKey] > b[columnKey] ? 1 : b[columnKey] > a[columnKey] ? -1 : 0
        );
      }
      setSortedData(sortedArray);
    };
   
    const sortIcon = (columnKey) => {
      if (sortedColumn === columnKey) {
        return sortOrder === 'asc'
          ? <i className="pi-arrow-up"></i>  
          : <i className="pi-arrow-down"></i>; 
      }
      return <i className="pi-sort-alt"></i>; 
    };
  
    const handleOptionSelect = (option) => {
      setSelectedOption(option.value);
      setSelectAccount(option);
      if(option.label==="Add")
      {
       //console.log(":::::::inside::::::::")
        setSelectValidationTheme("selectFormError")
        setSelectTooltipMessage("Required");
  
      }
      else
      {
        setSelectValidationTheme("selectForm")
      
      }
    };
    const handleMultiSelect = (options) => { 
      //console.log("Selected Option:", options);
      if(options.includes("2"))
        {
          //console.log(":::::::inside::::::::")
          setMultiSelectValidationTheme("selectFormError")
          setMultiSelectTooltipMessage("Required");
    
        }
        else
        {
          setMultiSelectValidationTheme("selectForm")
        
        }
    };
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
    return (
        <div className='row'>
        <div className='col-md-12' >
        <table  className={defaultTable ? "tss-datatable tss-datatable-striped" :  ""}  style={{width:"100%"}}>
          <thead className="tss-datatable-thead">
            <tr className="tss-datatable-header tss-sortable-column">
              {columns.map((column) => (
                <th key={column.key} onClick={() => handleSort(column.key)}>
                 {column.label}  {sortIcon(column.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="tss-datatable-tbody">
            {sortedData.map((row, index) => (
              <tr key={index} >
                {columns.map((column) => (
                  <td key={column.key}>
                  {column.isSelectBox ? (
                    <TssSelectBox
                    key={selectBoxKey}
                    label="Select an option"
                    mandatory={true}
                    options={options}
                    defaultValue={selectedOption}
                    onChange={handleOptionSelect}
                />
                  ) : column.isMultiSelectBox ? (
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
                  ) :column.isTextArea ?(
              <TssTextArea label= "Text Area" 
               placeholder="Text Area"
               validation={textAreaValidationTheme} 
               properties={textAreaProp}
               mandatory={false}
               />
                  ): (
                    row[column.key]
                  )}
                </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
      
    );
  };

export default TssTable;
