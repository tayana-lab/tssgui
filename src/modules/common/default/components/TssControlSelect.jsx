import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import TssIcon from '@app/modules/common/default/components/TssIcon';
import {infoAlert} from '@app/modules/common/default/components/TssFunction';

const TssControlSelect =({isSearchable=false,headings=[],options=[],onChange=()=>{},isOptionsMovable=false,moveAll=false})=>{

    const [t] = useTranslation();
    const [leftContainerList,setLeftContainerList] = useState(options && options.length> 0 ?options[0]:[])
    const [rightContainerList,setRightContainerList] = useState(options && options.length> 0 ?options[1]:[])
    const [selectedOption,setSelectedOption] = useState("")
    const [selectedOptionIndex,setSelectedOptionIndex] = useState(0)

    const [leftContainerListQuery,setLeftContainerListQuery] = useState("")
    const [filteredLeftContainerList,setFilteredLeftContainerList] = useState(options && options.length> 0 ? options[0]:[])

    const [rightContainerListQuery,setRightContainerListQuery] = useState("")
    const [filteredRightContainerList,setFilteredRightContainerList] = useState(options && options.length> 0 ? options[1]:[])

    useEffect(()=>{
        onChange(filteredLeftContainerList,filteredRightContainerList)
    },[filteredLeftContainerList,filteredRightContainerList])

    // useEffect(()=>{
       
    //     setLeftContainerList(options && options.length> 0 ?options[0]:[])
    //     setRightContainerList(options && options.length> 0 ?options[1]:[])
    //     setFilteredLeftContainerList(options && options.length> 0 ? options[0]:[])
    //     setFilteredRightContainerList(options && options.length> 0 ? options[1]:[])
    // },[options])

    const handleOptionSelect = (element,index) => {
        setSelectedOption(element)
        setSelectedOptionIndex(index)
    }
    

    const moveAllRight =() =>{
       
        if(filteredLeftContainerList.every((value, index) => value === filteredRightContainerList[index]))
        {
            return false;
        }    
        else {
            setFilteredLeftContainerList([])
	    setRightContainerList([...filteredLeftContainerList])
            setFilteredRightContainerList(prevList=>[...prevList,...filteredLeftContainerList])
        }
    }

    const moveAllLeft =() =>{

        if(filteredRightContainerList.every((value, index) => value === filteredLeftContainerList[index]))
        {
            return false;
        }    
        else {
            setFilteredRightContainerList([])
	    setLeftContainerList([...filteredRightContainerList])	
            setFilteredLeftContainerList(prevList=>[...prevList,...filteredRightContainerList])
        }
    }

    const moveOptionRight = () => {
        if(filteredLeftContainerList.length==0)
        {
                infoAlert(headings[0]+" is empty")
                return false;
        } 
        var temp=[]
        const temp1 = filteredLeftContainerList.find(option=>option.value==selectedOption.value)

        //console.log("::::::temp1::::::::::"+JSON.stringify(temp1))
        if(temp1.length!==0)
        {    
            temp.push(selectedOption)
            setFilteredLeftContainerList(prevList=>[...prevList.slice(0,selectedOptionIndex),...prevList.slice(selectedOptionIndex+1)])
           setRightContainerList([...temp])
	    setFilteredRightContainerList(prevList=>
            {
               //console.log("::::::::::::::right:::::::"+JSON.stringify([...prevList,...temp])) 
               return [...prevList,...temp]
            })
            setSelectedOption("")
        }
        else
        {
            infoAlert("Please select option in  "+headings[0])
            return false;
        }
    }


    // useEffect(()=>{
    //     console.log("::::::::::filteredRightContainerList:::::::::"+JSON.stringify(filteredRightContainerList))
    // },[filteredRightContainerList])
    
    const moveOptionLeft = () => {
        if(filteredRightContainerList.length==0)
        {
                infoAlert(headings[1]+" is empty")
                return false;
        } 
        var temp=[]
        const temp1 = filteredRightContainerList.find(option=>option.value==selectedOption.value)
        if(temp1.length!==0)
        {    
            temp.push(selectedOption)
            setFilteredRightContainerList(prevList=>[...prevList.slice(0,selectedOptionIndex),...prevList.slice(selectedOptionIndex+1)])
            setLeftContainerList([...temp])
	    setFilteredLeftContainerList(prevList=>[...prevList,...temp])
            setSelectedOption("")
        }
        else
        {
            infoAlert("Please select option in  "+headings[1])
            return false;
        }
    
    }


    const moveOptionFirst =(type) =>{
        if(selectedOption=="" && selectedOptionIndex==0)
        {
            return false;
        }    
        else
        {
            if(type=="Left")
            {  
	 	setLeftContainerList(prevValue=>[...prevValue.slice(selectedOptionIndex,selectedOptionIndex+1),...[...prevValue.slice(0,selectedOptionIndex),...prevValue.slice(selectedOptionIndex+1)]])    
                setFilteredLeftContainerList(prevValue=>[...prevValue.slice(selectedOptionIndex,selectedOptionIndex+1),...[...prevValue.slice(0,selectedOptionIndex),...prevValue.slice(selectedOptionIndex+1)]])
                setSelectedOptionIndex(0)
            }
            else
            {
		setRightContainerList(prevValue=>[...prevValue.slice(selectedOptionIndex,selectedOptionIndex+1),...[...prevValue.slice(0,selectedOptionIndex),...prevValue.slice(selectedOptionIndex+1)]])    
                setFilteredRightContainerList(prevValue=>[...prevValue.slice(selectedOptionIndex,selectedOptionIndex+1),...[...prevValue.slice(0,selectedOptionIndex),...prevValue.slice(selectedOptionIndex+1)]])
                setSelectedOptionIndex(0) 
            }
        }
    }
    

    const moveOptionLast =(type) =>{
        if(selectedOption=="" && selectedOptionIndex==0)
        {
            return false;
        }    
        else
        {
            if(type=="Left")
            { 
		setLeftContainerList(prevValue=>[...[...prevValue.slice(0,selectedOptionIndex),...prevValue.slice(selectedOptionIndex+1)],...prevValue.slice(selectedOptionIndex,selectedOptionIndex+1)])
                setFilteredLeftContainerList(prevValue=>[...[...prevValue.slice(0,selectedOptionIndex),...prevValue.slice(selectedOptionIndex+1)],...prevValue.slice(selectedOptionIndex,selectedOptionIndex+1)])
                setSelectedOptionIndex(0)
            }   
            else
            {
		setRightContainerList(prevValue=>[...[...prevValue.slice(0,selectedOptionIndex),...prevValue.slice(selectedOptionIndex+1)],...prevValue.slice(selectedOptionIndex,selectedOptionIndex+1)])
                setFilteredRightContainerList(prevValue=>[...[...prevValue.slice(0,selectedOptionIndex),...prevValue.slice(selectedOptionIndex+1)],...prevValue.slice(selectedOptionIndex,selectedOptionIndex+1)])
                setSelectedOptionIndex(0)
            } 
           
        }
    }

    const moveOptionAbove = (type) => {
        if(selectedOption=="" && selectedOptionIndex==0)
        {
            return false;
        } 
        else
        {
            if(type=="Left")
            {
	       setLeftContainerList(prevValue=>[...prevValue.slice(0,selectedOptionIndex-1),...prevValue.slice(selectedOptionIndex,selectedOptionIndex+1),...prevValue.slice(selectedOptionIndex-1,selectedOptionIndex),...prevValue.slice(selectedOptionIndex+1)])	    
               setFilteredLeftContainerList(prevValue=>[...prevValue.slice(0,selectedOptionIndex-1),...prevValue.slice(selectedOptionIndex,selectedOptionIndex+1),...prevValue.slice(selectedOptionIndex-1,selectedOptionIndex),...prevValue.slice(selectedOptionIndex+1)])
               setSelectedOptionIndex(0)
            }  
            else
            {
		setRightContainerList(prevValue=>[...prevValue.slice(0,selectedOptionIndex-1),...prevValue.slice(selectedOptionIndex,selectedOptionIndex+1),...prevValue.slice(selectedOptionIndex-1,selectedOptionIndex),...prevValue.slice(selectedOptionIndex+1)])    
                setFilteredRightContainerList(prevValue=>[...prevValue.slice(0,selectedOptionIndex-1),...prevValue.slice(selectedOptionIndex,selectedOptionIndex+1),...prevValue.slice(selectedOptionIndex-1,selectedOptionIndex),...prevValue.slice(selectedOptionIndex+1)])
                setSelectedOptionIndex(0)
            }  
        }   
    }

    const moveOptionBelow = (type) => {
        if(selectedOption=="" && selectedOptionIndex==0)
        {
            return false;
        } 
        else
        {
            if(type=="Left")
            {
		setLeftContainerList(prevValue=>[...prevValue.slice(0,selectedOptionIndex),...prevValue.slice(selectedOptionIndex+1,selectedOptionIndex+2),...prevValue.slice(selectedOptionIndex,selectedOptionIndex+1),...prevValue.slice(selectedOptionIndex+2)])    
                setFilteredLeftContainerList(prevValue=>[...prevValue.slice(0,selectedOptionIndex),...prevValue.slice(selectedOptionIndex+1,selectedOptionIndex+2),...prevValue.slice(selectedOptionIndex,selectedOptionIndex+1),...prevValue.slice(selectedOptionIndex+2)])
                setSelectedOptionIndex(0)
            }  
            else
            {
		setRightContainerList(prevValue=>[...prevValue.slice(0,selectedOptionIndex),...prevValue.slice(selectedOptionIndex+1,selectedOptionIndex+2),...prevValue.slice(selectedOptionIndex,selectedOptionIndex+1),...prevValue.slice(selectedOptionIndex+2)])    
                setFilteredRightContainerList(prevValue=>[...prevValue.slice(0,selectedOptionIndex),...prevValue.slice(selectedOptionIndex+1,selectedOptionIndex+2),...prevValue.slice(selectedOptionIndex,selectedOptionIndex+1),...prevValue.slice(selectedOptionIndex+2)])
                setSelectedOptionIndex(0)
            }  
        } 

    }

   const handleLeftContainerSearch = (event) => {
    const value = event.target.value;
    setLeftContainerListQuery(value);
    var tempArray = leftContainerList.filter(
        element => element.label.toLowerCase().includes(value.toLowerCase())
    );
    if(value=="")
    {
	setFilteredLeftContainerList(leftContainerList);	   
    }
    else 
    {	   
    setFilteredLeftContainerList(tempArray.length > 0 ? tempArray : [{"label":"No Options Available","value":"-1"}]);
    }	    
}


    const handleRightContainerList =(event)=>{
        const value=event.target.value;
        setRightContainerListQuery(value)
        var tempArray = rightContainerList.filter(
          element => element.label.toLowerCase().includes(value.toLowerCase())
       );
       if(value=="")
       {
           setFilteredRightContainerList(rightContainerList);
       }
       else
       {
           setFilteredRightContainerList(tempArray.length > 0 ? tempArray : [{"label":"No Options Available","value":"-1"}]);
       }


    }

    // useEffect(()=>{
    //     console.log(":::::leftContainerList:::::::::;;"+JSON.stringify(leftContainerList))
    // },[leftContainerList])

    return (
        <>
    
            <div className="row">
            {isOptionsMovable && 
                (<div className="col-md-1 d-flex flex-column mt-1 justify-content-center align-items-center">
                            <TssIcon iconKey="tss_forward" 
                                className="mb-2 mt-4" 
                                title= {t('modules.Generic.buttons.title.moveUp')} 
                                iconProps={{ style: { fontSize: '1.8rem' ,transform: "rotate(-90deg)"} }}
                                onClick={()=>moveOptionFirst("Left")}
                            />
                            <div style={{height:"7px"}}></div>
						   <TssIcon iconKey="tss_arrowRight"  
                                className="mb-2"
                                title={t('modules.Generic.buttons.title.moveAbove')}								
                                iconProps={{ style: { fontSize: '1.8rem',transform: "rotate(-90deg)" } }}
                                onClick={()=>moveOptionAbove("Left")}
						    />
                            <div style={{height:"7px"}}></div>
						   <TssIcon iconKey="tss_backward" 										    	
                                iconProps={{ style: { fontSize: '1.8rem',transform: "rotate(-90deg)" } }}
                                className="mb-2"
                                title={t('modules.Generic.buttons.title.moveDown')}
                                onClick={()=>moveOptionLast("Left")} 
						    />
                            <div style={{height:"7px"}}></div>
						   <TssIcon iconKey="tss_arrowLeft" 
                                title={t('modules.Generic.buttons.title.moveBelow')}
                                iconProps={{ style: { fontSize: '1.8rem',transform: "rotate(-90deg)"  } }}
                                className="mb-2"
                                onClick={()=>moveOptionBelow("Left")}
						   />

            </div>
            )}
            <div className={`col-md-${isOptionsMovable ? 4 : 5}`}>
                <fieldset className="contolSelectTagFieldset" style={{height:"250px"}}>
                        <legend className="w-auto contolSelectLegend">
                                            <h5 className="mb-0 contolSelectFontStyle">
                                                &nbsp;&nbsp;{headings[0]}&nbsp;&nbsp;
                                            </h5>
                        </legend>
                        <ul className="tss-controlSearchField">
                            {isSearchable && filteredLeftContainerList && filteredLeftContainerList.length > 0 && (
                                <>
                                <li style={{ marginBottom: "10px", display: "none" }}></li>
                                <li style={{ display: "inline", position: "relative", marginTop: "2px" }}>
                                    <input
                                    className='tss-controlSelectSearchFeild' 
                                    placeholder="Search"  
                                    value={leftContainerListQuery}
                                    onChange={(event)=>handleLeftContainerSearch(event)}
                                    />
                                </li>
                                </>
                            )}
                            <li style={{ height: "12%", display: "none" }}></li>
                        </ul>    
                        <ul className="tss-fieldSetUl-container" style={{ height:isSearchable ? "155px" : "180px"}}> 
                            {filteredLeftContainerList && filteredLeftContainerList.length>0 && filteredLeftContainerList.map((element,index)=>(
                                    
                                <>
                                     <li className={selectedOption.label==element.label ? "tss-controlSelect-optionsActive1" :"tss-controlSelect-options"}
                                         key={index}
                                         onClick={()=>handleOptionSelect(element,index)}>
                                         <h6 className={selectedOption.label==element.label ? "tss-contolSelect-optionLabelActive" : "tss-contolSelect-optionLabel"}
                                             title={element.label}
                                             style={{wordWrap:element.label.length>50?"break-word":"normal",overflow: "hidden",  textOverflow:"ellipsis",whiteSpace:"nowrap",width:"auto",display:"block"}}
                                         >{element.label}</h6>
                                    </li>
                                    <li className="defaultOption" ></li>
                                 </>
                                
                            ))}
                        </ul>

                </fieldset>
            </div>
            <div className='col-md-2 d-flex flex-column mt-1 justify-content-center align-items-center'>  
						   {moveAll && (
                            <TssIcon iconKey="tss_forward" 
							className="mb-2 mt-4" 
							title= {t('modules.Generic.buttons.title.moveAllRight')} 
							iconProps={{ style: { fontSize: '1.8rem' } }}
                            onClick={moveAllRight}
                            />)}
						   <TssIcon iconKey="tss_arrowRight"  
						 	className="mb-2"
							title={t('modules.Generic.buttons.title.moveSingleRight')}								
                            iconProps={{ style: { fontSize: '1.8rem' } }}
                            onClick={moveOptionRight}
						    />
						   {moveAll && (
                                <TssIcon iconKey="tss_backward" 										    	
                                 iconProps={{ style: { fontSize: '1.8rem' } }}
                                 className="mb-2"
                                 title={t('modules.Generic.buttons.title.moveAllLeft')}
                                 onClick={moveAllLeft} 
                                />

                           )}
						   <TssIcon iconKey="tss_arrowLeft" 
							title={t('modules.Generic.buttons.title.moveSingleLeft')}
							iconProps={{ style: { fontSize: '1.8rem' } }}
       						className="mb-2"
                            onClick={moveOptionLeft}
						   />
	  		</div>
            <div className={`col-md-${isOptionsMovable ? 4 : 5}`}>
                <fieldset className="contolSelectTagFieldset" style={{height:"250px"}}>
                        <legend className="w-auto contolSelectLegend">
                                            <h5 className="mb-0 contolSelectFontStyle">
                                                &nbsp;&nbsp;{headings[1]}&nbsp;&nbsp;
                                            </h5>
                        </legend>
                        <ul className="tss-controlSearchField">
                            {isSearchable && filteredRightContainerList && filteredRightContainerList.length > 0 && (
                                <>
                                <li style={{ marginBottom: "10px", display: "none" }}></li>
                                <li style={{ display: "inline", position: "relative", marginTop: "2px" }}>
                                    <input
                                    className='tss-controlSelectSearchFeild' 
                                    placeholder="Search"
                                    value={rightContainerListQuery}
                                    onChange={(event)=>handleRightContainerList(event)}
                                    />
                                </li>
                                </>
                            )}
                            <li style={{ height: "12%", display: "none" }}></li>
                        </ul> 
                        <ul className="tss-fieldSetUl-container" style={{ height:isSearchable ? "155px" : "180px"}}> 

                        {filteredRightContainerList && filteredRightContainerList.length>0 && filteredRightContainerList.map((element,index)=>(
                                    
                                    <>
                                        <li className="defaultOption" ></li>
                                        <li className={selectedOption.label==element.label ? "tss-controlSelect-optionsActive1" :"tss-controlSelect-options"}
                                            key={index}
                                            onClick={()=>handleOptionSelect(element,index)}>
                                            <h6 className={selectedOption.label==element.label ? "tss-contolSelect-optionLabelActive" : "tss-contolSelect-optionLabel"}
                                                title={element.label}
                                                style={{wordWrap:element.label.length>50?"break-word":"normal",overflow: "hidden",  textOverflow:"ellipsis",whiteSpace:"nowrap",width:"auto",display:"block"}}
                                            >{element.label}</h6>
                                        </li>
                                    </>
                                
                        ))}
                        </ul>     

                </fieldset>
            </div>
            {isOptionsMovable && (
                <div className="col-md-1 d-flex flex-column mt-1 justify-content-center align-items-center">
                <TssIcon iconKey="tss_forward" 
                                className="mb-2 mt-4" 
                                title= {t('modules.Generic.buttons.title.moveUp')} 
                                iconProps={{ style: { fontSize: '1.8rem' ,transform: "rotate(-90deg)"} }}
                                onClick={()=>moveOptionFirst("Right")} 
                                />
                                <div style={{height:"7px"}}></div>
                               <TssIcon iconKey="tss_arrowRight"  
                                 className="mb-2"
                                title={t('modules.Generic.buttons.title.moveAbove')}								
                                iconProps={{ style: { fontSize: '1.8rem',transform: "rotate(-90deg)" } }}
                                onClick={()=>moveOptionAbove("Right")}
                                />
                                <div style={{height:"7px"}}></div>
                               <TssIcon iconKey="tss_backward" 										    	
                                 iconProps={{ style: { fontSize: '1.8rem',transform: "rotate(-90deg)" } }}
                                 className="mb-2"
                                 title={t('modules.Generic.buttons.title.moveDown')}
                                 onClick={()=>moveOptionLast("Right")} 
                                />
                                <div style={{height:"7px"}}></div>
                               <TssIcon iconKey="tss_arrowLeft" 
                                title={t('modules.Generic.buttons.title.moveBelow')}
                                iconProps={{ style: { fontSize: '1.8rem',transform: "rotate(-90deg)"  } }}
                                   className="mb-2"
                                onClick={()=>moveOptionBelow("Right")}
                               />
    
                </div>

            )}
            
        </div>


        </>
       
    )
}

export default TssControlSelect;
