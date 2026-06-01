import React, { useState, useEffect, useRef } from 'react';
import TssModal from '@modules/common/default/components/TssModal';
import TssIcon from '@modules/common/default/components/TssIcon';
import TssReportsTable from '@modules/common/default/components/TssReportsTable'
import $ from 'jquery';
import { useTranslation } from 'react-i18next';
import tssguiConf from '@modules/conf/TssGui.json'
import SubReport from '@modules/mis/SubReport';
import Report from '@modules/mis/Reports';


const ReportsTable = ({ jsonObj , Cumulate , ReportData ,GetModalReportData, ModalYearData, ModalMonthData, ModalDayData , 
                        From, To, LoadIntervalData,SetCumulate,Mode,Loading,ActiveButton,SetApp, ReportName,IsDateBased,
                        MainDayData, MainMonthData, MainYearData, MainMode, ChangeMode, queryParamString,SubReportMode }) => {
  const [t]= useTranslation();
  const [mainHeading, setMainHeading] = useState(jsonObj.json.HEADING);
  const [modalHeading, setModalHeading] = useState(jsonObj.json.MODAL_HEADING)
  const [modalOpen, setModalOpen] = useState(false)
  const [filterVal, setFilterVal] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [initialMode, setInitialMode] = useState('')
  
  const [showSubReport, setShowSubReport] = useState(false)
  const [subReport, setSubReport] = useState('')
  

  const handleLinkClick = (redirectPath) => {
    const component = renderComponentFromString(redirectPath);
    if (component) {
      setShowSubReport(true);
      setSubReport(component);
    }
  };


  //to render sub report
  const renderComponentFromString = (componentString) => {
    try {
      const match = componentString.match(/^<(\w+)\s+(.*)\/>$/);
      if (!match) {
        throw new Error('Invalid component string format');
      }

      const componentName = match[1];
      const propsString = match[2];

      const props = {};
      propsString.split(/\s+/).forEach((prop) => {
        const [key, value] = prop.split('=');
        props[key] = value.replace(/['"]/g, '');
      });
      const componentsMap = {
        Report,
      };

      const Component = componentsMap[componentName];
      if (!Component) {
        throw new Error(`Component ${componentName} is not registered`);
      }

      return <Component {...props } fromDt={From} toDt={To} queryStr={queryParamString} SubMode={SubReportMode}/>;
    } catch (error) {
      console.error('Error rendering component from string:', error);
      return null; // Or return a fallback UI
    }
  };


  /////////////////////////////////////////////////////////
  const replaceDisplayNameInModal = (newDisplayName) => {
    if(!IsDateBased){
    const updatedHeading = modalHeading.map(row =>
      row.map(item => ({
        ...item,
        DISPLAY: (item.DISPLAY === '_$dateHeading$_' || item.DISPLAY === 'Date' ||item.DISPLAY === 'Month' ||item.DISPLAY === 'Hour' )? newDisplayName : item.DISPLAY,
      }))
    );
    setModalHeading(updatedHeading);
    }
  };

  //////////////////////////////////////////////////////////////////////////////////
  const replaceDisplayNameInMain = (newDisplayName) => {
    const updatedHeading = mainHeading.map(row =>
      row.map(item => ({
        ...item,
        DISPLAY: (item.DISPLAY === '_$dateHeading$_' || item.DISPLAY === 'Date' ||item.DISPLAY === 'Month' ||item.DISPLAY === 'Hour' )? newDisplayName : item.DISPLAY,
      }))
    );
    setMainHeading(updatedHeading);
  }
  ///////////////////////////////////////////////////////////////////////////////

  useEffect (() => {
    if(MainMode == 'Y'){
      replaceDisplayNameInMain("Month")
    }
    if(MainMode == 'M'){
      replaceDisplayNameInMain("Date")
    }
    if(MainMode == 'H'){
      replaceDisplayNameInMain("Hour")
    }
  }, [MainMode])
  ///////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    const onModalDismiss = () => {
      if(ActiveButton.value == 1){ SetCumulate("Day"); w('H')  }
      else if(ActiveButton.value == 2){ SetCumulate("Month"); ChangeMode('M') }
      else if(ActiveButton.value == 3){ SetCumulate("Year");  ChangeMode('Y') }
      setModalOpen(false)
    };
    $('#reportDetailsModal').on('hidden.bs.modal', onModalDismiss);

    return () => {
      $('#reportDetailsModal').off('hidden.bs.modal', onModalDismiss);
    };
  }, [modalOpen]);
  /////////////////////////////////////////////////////////////////

  useEffect(() => {
	if(Mode == 'H'){
		setSelectedMonth(getMonthName(From.slice(0,7)).toUpperCase())
		setSelectedDate(From.slice(8,10))
        }else if(Mode == 'M'){
		setSelectedMonth(getMonthName(From.slice(0,7)).toUpperCase())
	}
  if(MainMode == 'H'){
    setSelectedDate(From.slice(8,10))
    setSelectedMonth(getMonthName(From.slice(0,7)).toUpperCase())
    setSelectedYear(From.slice(0,4))

  }
  },[MainMode]);
  /////////////////////////////////////////////////////////////////

  function getMonthName(dateString) {
    const date = new Date(`${dateString}-01`); 
    return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
  }
  ///////////////////////////////////////////////////////////
  

  useEffect(() => {
    setInitialMode(Mode)
    setSelectedYear(From.slice(0,4))
  },[ActiveButton])

  //////////////////////////////////////////////////////////
  const handleKind = (filterLabel, id, Col) => {
    setFilterVal(filterLabel)
    setModalOpen(true)
    SetApp(filterLabel,id,Col)
    if (Cumulate == "Year" || Mode=="Y") {
      replaceDisplayNameInModal("Month");
      GetModalReportData('Y')
    } else if (Cumulate == "Month"|| Mode=="M") {
      replaceDisplayNameInModal("Date");
      GetModalReportData('M')
    } else if (Cumulate == "Day"|| Mode=="H") {
      replaceDisplayNameInModal("Hour");
      GetModalReportData('H')
    }  
  }

  //////////////////////////////////////////////////////

  const handleHeadingChange = () => {
    setModalOpen(true)
    if (Mode === 'Y') {
      replaceDisplayNameInModal("Month");
    } else if (Mode === 'M') {
      replaceDisplayNameInModal("Date");
    } else if (Mode === 'H') {
      replaceDisplayNameInModal("Hour");
    }
  }
  /////////////////////////////////////////////////

  useEffect (() => {
    handleHeadingChange()
  },[Mode])
  ///////////////////////////////////////////////////
  function getStartAndEndDates(year, monthName) {
    setSelectedMonth(monthName)
    const monthNames = tssguiConf.MONTHS
    const trimmedMonthName = monthName.trim().toUpperCase();
    const monthIndex = monthNames.indexOf(trimmedMonthName);

    if (monthIndex === -1) {
        return null;
    }
    const start = `${year}-${String(monthIndex + 1).padStart(2, '0')}-01 00:00:00`;
    const lastDay = new Date(year, monthIndex + 1, 0).getDate(); 
    const end = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${lastDay} 23:59:59`;
    return { start, end };
  }
  //////////////////////////////////////////////////
  const loadMonthsData = (month) => {
    const year = From.slice(0,4)
    SetCumulate("Month")
    const { start, end } = getStartAndEndDates(year, month);
    LoadIntervalData(start,end)
  }
  ////////////////////////////////////////////////////
  const loadDayData = (date) => {
    SetCumulate("Day")
    setSelectedDate(date.slice(8,10))
    const start = date +" 00:00:00";
    const end = date +" 23:59:59"
    LoadIntervalData(start,end)
  }
  /////////////////////////////////////////////////////////
  const loadMonthsDataInMain = (month,id, Col) => {
    SetApp(month,id, Col);
    replaceDisplayNameInMain('Date')
    ChangeMode('M')
    const year = From.slice(0,4)
    const { start, end } = getStartAndEndDates(year, month.toUpperCase());
    LoadIntervalData(start,end)
  }
  ////////////////////////////////////////////////////////////
  const loadDayDataMain = (date, id, Col) => {
    SetApp (date, id, Col);
    replaceDisplayNameInMain('Hour')
    ChangeMode('H')
    setSelectedDate(date.slice(8,10))
    const start = date +" 00:00:00";
    const end = date +" 23:59:59"
    LoadIntervalData(start,end)
  }
  /////////////////////////////////////////////////////
  const loadPreviousData = (mode) => {
    if (mode == 'M') {
      replaceDisplayNameInMain('Month')
      SetCumulate("Year")
      const year = From.slice(0, 4)
      const start = `${year}-01-01 00:00:00`;
      const end = `${year}-12-31 23:59:59`;
      LoadIntervalData(start, end);
    }
    else if (mode == 'H') {
      SetCumulate("Month")
      replaceDisplayNameInMain('Date')
      const year = From.slice(0, 4);
      const { start, end } = getStartAndEndDates(year, selectedMonth);
      LoadIntervalData(start, end);
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////
  const evaluateDisplayCondition = (condition, data) => {
    const regex = /sum\((C\d+)\)/g;
    let match;
    let formula = condition;
  
    while ((match = regex.exec(condition)) !== null) {
      const column = match[1]; 
      const columnIndex = parseInt(column.slice(1)) - 1; 
      const columnSum = data.reduce((sum, row) => {
        const value = parseFloat(row[columnIndex]) || 0;
        return sum + value;
      }, 0);
  
      formula = formula.replace(match[0], columnSum);
    }
    return eval(formula);
  };
  
  ///////////////////////////////////////////////////////////////////////////////////////////// 
  const shouldDisplay = (displayCondition) => {
    const conditions = displayCondition.split("||").map(cond => cond.trim());
    return conditions.some(condition => queryParamString.includes(condition));
  };   
  //////////////////////////////////////////////////////////////////////////////////////////////
  //                        FILTER BASED DATA IN VIEW PAGE
  //////////////////////////////////////////////////////////////////////////////////////////////
  const TableHeaderInMain = () => {
  return (
    <>
      {mainHeading.map((row, rowIndex) => (
        <tr key={rowIndex} className="tss-datatable-header tss-sortable-column">
          {row.map((header, index) => {
            const linkValue = header.LINK;
            if (!header.SHOW_HEADER || shouldDisplay(header.SHOW_HEADER)) {
              if (header.LINK) {
                return (
                  <th
                    key={index}
                    colSpan={header.COLSPAN}
                    rowSpan={header.ROWSPAN}
                    style={{ textAlign: header.ALIGN.toLowerCase(), fontWeight: 600 }}
                  >
                    <a href="#" onClick={() => handleLinkClick(linkValue)}>
                      {header.DISPLAY}
                    </a>
                  </th>
                );
              } else {
                return (
                  <th
                    key={index}
                    colSpan={header.COLSPAN}
                    rowSpan={header.ROWSPAN}
                    style={{ textAlign: header.ALIGN.toLowerCase(), fontWeight: 600 }}
                  >
                    {header.DISPLAY}
                  </th>
                );
              }
            }
            return null; // Return null for headers that do not meet the condition
          })}
        </tr>
      ))}
    </>
  );
};


  const TableBodyInMain = () => {
    return (
      ReportData.data && ReportData.data.map((row, rowIndex) => {
        const id = row[2];   

        return (
          <tr key={rowIndex}>
            {jsonObj.json.ROW_TEMPLATE.map((template, templateIndex) => {
              const columnIndex = parseInt(template.DISPLAY.slice(1)) - 1;
              const cell = row[columnIndex];
              const linkValue = template.LINK;
              if (!template.SHOW_VALUE || shouldDisplay(template.SHOW_VALUE)) {
              return (
                <td key={templateIndex}>
                  {linkValue ? (
                    <a
                      href="#"
                      data-toggle="modal"
                      data-target="#reportDetailsModal"
                      onClick={() => handleKind(cell, id, linkValue)}
                    >
                      {cell}
                    </a>
                  ) : (
                    cell
                  )}
                </td>
              )};
            })}
          </tr>
        );
      })
    )
  }
   
  const TableFooterInMain = () => {
    return (
      ReportData.data && ReportData.data[0] && (
        <tr>
          <td>
            <a
              href="#"
              data-toggle="modal"
              data-target="#reportDetailsModal"
              onClick={() => handleKind("Total", '-1', jsonObj.json.ROW_TEMPLATE[0]?.LINK)}
            >
              {t("MISRep.total")}
            </a>
          </td>
  
          {jsonObj.json.ROW_TEMPLATE.map((template, templateIndex) => {
            if (templateIndex === 0) return null;
  
            if (!template.SHOW_VALUE || shouldDisplay(template.SHOW_VALUE)) {
              if (template.DISPLAY_CONDITION) {
                const calculatedValue = evaluateDisplayCondition(template.DISPLAY_CONDITION, ReportData.data);
  
                return (
                  <td key={templateIndex} style={{ border: "1px solid #e5e5e5" }}>
                    {calculatedValue.toFixed(2)} 
                  </td>
                );
              } else {
                const columnIndex = parseInt(template.DISPLAY.slice(1)) - 1;
                const columnTotal = ReportData.data.reduce((sum, row) => {
                  const value = parseFloat(row[columnIndex]) || 0;
                  return sum + value;
                }, 0);
  
                return (
                  <td key={templateIndex} style={{ border: "1px solid #e5e5e5" }}>
                    {columnTotal}
                  </td>
                );
              }
            }
            return null;
          })}
        </tr>
      )
    );
  };
  
      
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  //                        DATE BASED  DATA IN MODAL
  //////////////////////////////////////////////////////////////////////////////////////////////////
  const TableHeaderInModal = () => {
    return (
      <>
        {!IsDateBased && modalHeading.map((row, rowIndex) => (
          <tr key={rowIndex} className="tss-datatable-header tss-sortable-column">
            {row.map((header, index) => {
              if (!header.SHOW_HEADER || shouldDisplay(header.SHOW_HEADER)) {
                return (
                  <th
                    key={index}
                    colSpan={header.COLSPAN}
                    rowSpan={header.ROWSPAN}
                    style={{ textAlign: header.ALIGN.toLowerCase(), fontWeight: 600 }}
                  >
                    {header.DISPLAY}
                  </th>
                );
              }
              return null;
            })}
          </tr>
        ))}
      </>
    );
  };

  const TableBodyInModalYear = () => {
    return (
      <>
        {!IsDateBased && ModalYearData.data &&
          ModalYearData.data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {jsonObj.json.MODAL_ROW_TEMPLATE.map((template, templateIndex) => {
                const columnIndex = parseInt(template.DISPLAY.slice(1)) - 1;
                const cell = row[columnIndex];
                const linkValue = template.LINK;
                if (!template.SHOW_VALUE || shouldDisplay(template.SHOW_VALUE)) {
                return (
                  <td key={templateIndex}>
                    {linkValue ? (
                      <a href="#" onClick={() => loadMonthsData(cell)}>
                        {cell}
                      </a>
                    ) : (
                      cell
                    )}
                  </td>
                )};
              })}
            </tr>
          ))
        }
      </>
    );
  };

  const TableFooterInModalYear = () => {
    return (
      <>
        {!IsDateBased && ModalYearData.data && (
          ModalYearData.data[0] && (
            <tr>
              <td>{t("MISRep.total")}</td>
              {jsonObj.json.MODAL_ROW_TEMPLATE.map((template, templateIndex) => {
                if (templateIndex === 0) return null;
  
                if (!template.SHOW_VALUE || shouldDisplay(template.SHOW_VALUE)) {
                  if (template.DISPLAY_CONDITION) {
                    const calculatedValue = evaluateDisplayCondition(template.DISPLAY_CONDITION, ModalYearData.data);
  
                    return (
                      <td key={templateIndex} style={{ border: "1px solid #e5e5e5" }}>
                        {calculatedValue.toFixed(2)} 
                      </td>
                    );
                  } else {
                    const columnIndex = parseInt(template.DISPLAY.slice(1)) - 1;
                    const columnTotal = ModalYearData.data.reduce((sum, row) => {
                      const value = parseFloat(row[columnIndex]) || 0;
                      return sum + value;
                    }, 0);
  
                    return (
                      <td key={templateIndex} style={{ border: "1px solid #e5e5e5" }}>
                        {columnTotal}
                      </td>
                    );
                  }
                }
                return null;
              })}
            </tr>
          )
        )}
      </>
    );
  };
  
  const TableBodyInModalMonth = () => {
    return (
      <>
        {!IsDateBased && ModalMonthData.data && (
          ModalMonthData.data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {jsonObj.json.MODAL_ROW_TEMPLATE.map((template, templateIndex) => {
                const columnIndex = parseInt(template.DISPLAY.slice(1)) - 1;
                const cell = row[columnIndex];
                const linkValue = template.LINK;
                if (!template.SHOW_VALUE || shouldDisplay(template.SHOW_VALUE)) {
                return (
                  <td key={templateIndex}>
                    {linkValue ? (
                      <a href="#" onClick={() => loadDayData(cell.slice(0, 10))}>
                        {cell.slice(0, 10)}
                      </a>
                    ) : (
                      cell
                    )}
                  </td>
                )};
              })}
            </tr>
          ))
        )}
      </>
    )
  };

  const TableFooterInModalMonth = () => {
    return (
      <>
        {!IsDateBased && ModalMonthData.data && (
          ModalMonthData.data[0] && (
            <tr>
              <td>{t("MISRep.total")}</td>
              {jsonObj.json.MODAL_ROW_TEMPLATE.map((template, templateIndex) => {
                
                if (templateIndex < 1) return null;
  
                if (!template.SHOW_VALUE || shouldDisplay(template.SHOW_VALUE)) {
                  if (template.DISPLAY_CONDITION) {
                    const calculatedValue = evaluateDisplayCondition(template.DISPLAY_CONDITION, ModalMonthData.data);
  
                    return (
                      <td key={templateIndex} style={{ border: "1px solid #e5e5e5" }}>
                        {calculatedValue.toFixed(2)} 
                      </td>
                    );
                  } else {
                    const columnIndex = parseInt(template.DISPLAY.slice(1)) - 1;
                    const columnTotal = ModalMonthData.data.reduce((sum, row) => {
                      const value = parseFloat(row[columnIndex]) || 0;
                      return sum + value;
                    }, 0);
  
                    return (
                      <td key={templateIndex} style={{ border: "1px solid #e5e5e5" }}>
                        {columnTotal}
                      </td>
                    );
                  }
                }
                return null;
              })}
            </tr>
          )
        )}
      </>
    );
  };

  const TableBodyInModalDay = () => {
    return (
      <>
        {!IsDateBased &&  ModalDayData.data && (
          ModalDayData.data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {jsonObj.json.MODAL_ROW_TEMPLATE.map((template, templateIndex) => {
                  const columnIndex = parseInt(template.DISPLAY.slice(1)) - 1;
                  const cell = row[columnIndex];
                  if (!template.SHOW_VALUE || shouldDisplay(template.SHOW_VALUE)) {
                  return (
                    <td key={templateIndex}>
                      {cell}
                    </td>
                  )};
                })}
              </tr>
            ))
          )}
      </>
  )};

  const TableFooterInModalDay = () => {
    return (
      <>
        {!IsDateBased && ModalDayData.data && (
          ModalDayData.data[0] && (
            <tr>
              <td>{t("MISRep.total")}</td>
              {jsonObj.json.MODAL_ROW_TEMPLATE.map((template, templateIndex) => {
                if (templateIndex < 1) return null;
  
                if (!template.SHOW_VALUE || shouldDisplay(template.SHOW_VALUE)) {
                  if (template.DISPLAY_CONDITION) {
                    const calculatedValue = evaluateDisplayCondition(template.DISPLAY_CONDITION, ModalDayData.data);
  
                    return (
                      <td key={templateIndex} style={{ border: "1px solid #e5e5e5" }}>
                        {calculatedValue.toFixed(2)} 
                      </td>
                    );
                  } else {
                    const columnIndex = parseInt(template.DISPLAY.slice(1)) - 1;
                    const columnTotal = ModalDayData.data.reduce((sum, row) => {
                      const value = parseFloat(row[columnIndex]) || 0;
                      return sum + value;
                    }, 0);
  
                    return (
                      <td key={templateIndex} style={{ border: "1px solid #e5e5e5" }}>
                        {columnTotal}
                      </td>
                    );
                  }
                }
                return null;
              })}
            </tr>
          )
        )}
      </>
    );
  };
    
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  //                        DATE BASED  DATA IN MAIN
  //////////////////////////////////////////////////////////////////////////////////////////////////
  const DateBasedTableHeaderInMain = () => {
    return (
      mainHeading.map((row, rowIndex) => (
        <tr key={rowIndex} className="tss-datatable-header tss-sortable-column">
          {row.map((header, index) => {
            
            if (!header.SHOW_HEADER || shouldDisplay(header.SHOW_HEADER)) {
              return (
                <th
                  key={index}
                  colSpan={header.COLSPAN}
                  rowSpan={header.ROWSPAN}
                  style={{ textAlign: header.ALIGN.toLowerCase(), fontWeight: 600 }}
                >
                  {header.DISPLAY}
                </th>
              );
            }
            return null;
          })}
        </tr>
      ))
    );
  };
  
  const TableBodyInMainYear = () => {
    return (
      MainYearData.data && MainYearData.data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {jsonObj.json.ROW_TEMPLATE.map((template, templateIndex) => {
            const id = row[2];
            const columnIndex = parseInt(template.DISPLAY.slice(1)) - 1;
            const cell = row[columnIndex];
            if (!template.SHOW_VALUE || shouldDisplay(template.SHOW_VALUE)) {
            return (
              <td key={templateIndex}>
                {template.LINK ? (
                  <a href="#" onClick={() => loadMonthsDataInMain(cell , id , template.LINK)}>
                    {cell}
                  </a>
                ) : (
                  cell
                )}
              </td>
            )};
          })}
        </tr>
      ))
    )
  };

  const TableFooterInMainYear = () => {
    return (
      MainYearData.data && MainYearData.data[0] && (
        <tr>
          <td>{t("MISRep.total")}</td>
          {jsonObj.json.ROW_TEMPLATE.map((template, templateIndex) => {
            if (templateIndex === 0) return null; 
  
            if (!template.SHOW_VALUE || shouldDisplay(template.SHOW_VALUE)) {
              if (template.DISPLAY_CONDITION) {
                const calculatedValue = evaluateDisplayCondition(template.DISPLAY_CONDITION,MainYearData.data );
                return (
                  <td key={templateIndex} style={{ border: "1px solid #e5e5e5" }}>
                    {calculatedValue.toFixed(2)} 
                  </td>
                );
              } else {
                const columnIndex = parseInt(template.DISPLAY.slice(1)) - 1;
                const columnTotal = MainYearData.data.reduce((sum, row) => {
                  const value = parseFloat(row[columnIndex]) || 0;
                  return sum + value;
                }, 0);
  
                return (
                  <td key={templateIndex} style={{ border: "1px solid #e5e5e5" }}>
                    {columnTotal} 
                  </td>
                );
              }
            } else {
              return null; 
            }
          })}
        </tr>
      )
    );
  };

  const TableBodyInMainMonth = () => {
    return (
      MainMonthData.data && MainMonthData.data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {jsonObj.json.ROW_TEMPLATE.map((template, templateIndex) => {
            const id = row[2];
            const columnIndex = parseInt(template.DISPLAY.slice(1)) - 1;
            const cell = row[columnIndex];
            if (!template.SHOW_VALUE || shouldDisplay(template.SHOW_VALUE)) {
            return (
              <td key={templateIndex}>
                {template.LINK ? (
                  <a href="#" onClick={() => loadDayDataMain(cell.slice(0, 10),id,template.LINK)}>
                    {cell.slice(0, 10)}
                  </a>
                ) : (
                  cell
                )}
              </td>
            )};
          })}
        </tr>
      ))
    )
  };

  const TableFooterInMainMonth = () => {
    return (
      MainMonthData.data && MainMonthData.data[0] && (
        <tr>
          <td>{t("MISRep.total")}</td>
          {jsonObj.json.ROW_TEMPLATE.map((template, templateIndex) => {
            if (templateIndex === 0) return null;

            if (!template.SHOW_VALUE || shouldDisplay(template.SHOW_VALUE)) {
              if (template.DISPLAY_CONDITION) {
                const calculatedValue = evaluateDisplayCondition(template.DISPLAY_CONDITION,MainMonthData.data);

                return (
                  <td key={templateIndex} style={{ border: "1px solid #e5e5e5" }}>
                    {calculatedValue.toFixed(2)} 
                  </td>
                );
              } else {
                const columnIndex = parseInt(template.DISPLAY.slice(1)) - 1;
                const columnTotal = MainMonthData.data.reduce((sum, row) => {
                  const value = parseFloat(row[columnIndex]) || 0;
                  return sum + value;
                }, 0);

                return (
                  <td key={templateIndex} style={{ border: "1px solid #e5e5e5" }}>
                    {columnTotal}
                  </td>
                );
              }
            } else {
              return null;
            }
          })}
        </tr>
      )
    );
  };

  const TableBodyInMainDay = () => {
    return (
      MainDayData.data && MainDayData.data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {jsonObj.json.ROW_TEMPLATE.map((template, templateIndex) => {
            const columnIndex = parseInt(template.DISPLAY.slice(1)) - 1;
            const cell = row[columnIndex];
            if (!template.SHOW_VALUE || shouldDisplay(template.SHOW_VALUE)) {
            return (
              <td key={templateIndex}>
                {cell}
              </td>
            )};
          })}
        </tr>
      ))
    )
  };
  

  const TableFooterInMainDay = () => {
    return (
      MainDayData.data && MainDayData.data[0] && (
        <tr>
          <td>{t("MISRep.total")}</td>
  
          {jsonObj.json.ROW_TEMPLATE.map((template, templateIndex) => {
            if (templateIndex === 0) return null;
  
            if (!template.SHOW_VALUE || shouldDisplay(template.SHOW_VALUE)) {
              if (template.DISPLAY_CONDITION) {
                const calculatedValue = evaluateDisplayCondition(template.DISPLAY_CONDITION, MainDayData.data);
  
                return (
                  <td key={templateIndex} style={{ border: "1px solid #e5e5e5" }}>
                    {calculatedValue.toFixed(2)} 
                  </td>
                );
              } else {
                const columnIndex = parseInt(template.DISPLAY.slice(1)) - 1;
                const columnTotal = MainDayData.data.reduce((sum, row) => {
                  const value = parseFloat(row[columnIndex]) || 0;
                  return sum + value;
                }, 0);
  
                return (
                  <td key={templateIndex} style={{ border: "1px solid #e5e5e5" }}>
                    {columnTotal}
                  </td>
                );
              }
            } else {
              return null;
            }
          })}
        </tr>
      )
    );
  };
  
  
  /////////////////////////////////////////////////////////////////////////////////////
  //                        TABLE LAYOUT
  //////////////////////////////////////////////////////////////////////////////////////
  return (
    <>
    
      {showSubReport && (
        <>
        <SubReport Component={subReport}/>
        </>
      )}
      {!showSubReport && (
      <div className="card">
        <div className="card-body align-items-center py-8">
          <div className='row'>
            <div className='col-md-12'>
            {(initialMode !== 'H' && (initialMode === 'M' ? Mode === 'H' : initialMode === 'Y' ? (Mode === 'H' || Mode === 'M') : false)) && IsDateBased &&(
              <TssIcon className='mb-3 ml-2' iconKey="tss_back" onClick={() => loadPreviousData(Mode)} />
            )}
              {!IsDateBased && (
                <>
                  <TssReportsTable
                      tableHeader={TableHeaderInMain} 
                      tableBody={TableBodyInMain} 
                      tableFooter={TableFooterInMain} 
                      id="mainTable" reportName={ReportName}
                  />
                </>
              )}
              {IsDateBased && MainMode == 'Y' && Mode == 'Y' && (
                <>
                  <b><span className='tss-heading'>&nbsp;&nbsp;&nbsp;{selectedYear}</span></b>
                  <TssReportsTable
                      tableHeader={DateBasedTableHeaderInMain} 
                      tableBody={TableBodyInMainYear} 
                      tableFooter={TableFooterInMainYear} 
                      id="mainTableYear" reportName={ReportName}
                  />
                </>
              )}
              {IsDateBased && (MainMode == 'M' || MainMode == 'Y') && Mode == 'M' &&(
                <>
                  <b><span className='tss-heading'>&nbsp;&nbsp;&nbsp;{selectedMonth} {selectedYear}</span></b>
                  <TssReportsTable
                      tableHeader={DateBasedTableHeaderInMain} 
                      tableBody={TableBodyInMainMonth} 
                      tableFooter={TableFooterInMainMonth} 
                      id="mainTableMonth" reportName={ReportName}
                  />
                </>
              )}
              {IsDateBased && (MainMode == 'H'|| MainMode == 'M' || MainMode == 'Y') && Mode == 'H' &&(
                <>
                  <b><span className='tss-heading'>&nbsp;&nbsp;&nbsp;{selectedDate} {selectedMonth} {selectedYear}</span></b>
                  <TssReportsTable
                      tableHeader={DateBasedTableHeaderInMain} 
                      tableBody={TableBodyInMainDay} 
                      tableFooter={TableFooterInMainDay} 
                      id="mainTableDay" reportName={ReportName}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
       )}

      <TssModal header={`${ReportName} (${filterVal})`} key={2} modalId="reportDetailsModal" modalBodyId="reportDetailsModalBody" className="modal-xl customModal">
        <div className='row' >
          {(initialMode !== 'H' && (initialMode === 'M' ? Mode === 'H' : initialMode === 'Y' ? (Mode === 'H' || Mode === 'M') : false)) && (
            <TssIcon className='mb-3 ml-2 mt-1' iconKey="tss_back" onClick={() => loadPreviousData(Mode)} />
          )}
          
          {Mode === 'Y' && (
            <>
            <b><span className='tss-heading'>&nbsp;&nbsp;&nbsp;{selectedYear}</span></b>
            <TssReportsTable
                      tableHeader={TableHeaderInModal} 
                      tableBody={TableBodyInModalYear} 
                      tableFooter={TableFooterInModalYear} 
                      id="yearTable" reportName={ReportName}
            />

            </>
          )}
          {Mode === 'M' && (
            <>
            <b><span className='tss-heading'>&nbsp;&nbsp;&nbsp;{selectedMonth} {selectedYear}</span></b>
            <TssReportsTable
                      tableHeader={TableHeaderInModal} 
                      tableBody={TableBodyInModalMonth} 
                      tableFooter={TableFooterInModalMonth} 
                      id="monthTable" reportName={ReportName}
                  />
            </>
         )}
          {Mode === 'H' && (
            <>
            <b><span className='tss-heading'>&nbsp;&nbsp;&nbsp;{selectedDate} {selectedMonth} {selectedYear}</span></b>
            <TssReportsTable
                      tableHeader={TableHeaderInModal} 
                      tableBody={TableBodyInModalDay} 
                      tableFooter={TableFooterInModalDay} 
                      id="dayTable" reportName={ReportName}
                  />
            </>
          )}
        </div>      
      </TssModal>      
    </>
  );
};

export default ReportsTable;

///////////////////////////////////////////////////////////////////////////////////////////
