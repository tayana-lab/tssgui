import React from 'react';

const TSSInputGroup = ({ prependElements = [], appendElements = [], inputElement = [],isPrependSelectBox=false }) => {
  return (
    <div style={{ marginLeft:isPrependSelectBox? "-6px" :"10px"}}>
      <div className='row'>
          <div className="input-group-prepend" id="tss-prependInputGroup"> 
          {prependElements.map((element, index) => {
            const elementType = element.type ? element.type.name || element.type : null;
            const elementLabel = element.props?.label;
            const elementSize = element.props?.size;
            //const isElementBorderRequired = element.props?.border;
            
            if (element.props.type  == 'checkbox' && element.props.label!==undefined && element.props.label!=="") {
              return (
                
                <fieldset className="input-group-text" id="basic-addon1" style={{display:"flex",alignItems:"center",justifyContent:"center", backgroundColor: "white" ,border:"1px solid #BDBDBD",height:`${element.props.label !=="" ? "50px" : "43px"}`,marginTop:`${element.props.label!=="" ? "-9px" : "8px"}`}} >
                  {element.props.label!== "" && (<legend className="w-auto" style={{ position: 'relative'}}>
                    <p title = {element.props.label} style={{color : "#757575",whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis', maxWidth:'100%',display:'block'}} className="mb-0" id="TSSGUI_LabelStyles">
                      &nbsp;&nbsp;{element.props.label}
                      &nbsp;&nbsp;
                    </p>
                  </legend>)}
                  <span key={index} style={{marginTop:"-5px"}}>
                    {element}
                  </span>
                </fieldset>                   
                
              );
            } 
            else if (element.type === 'div' || element.props.type === 'radio' || element.props.type  === 'checkbox') {
              return (
                <span key={index} className="input-group-text" id="basic-addon1" style={{ backgroundColor: "white" ,border:"1px solid #BDBDBD"}}>
                  {element}
                </span>
              );
            } 
           
            else if (elementType === 'TssSelectBox') {
              return (
                <div
                    className='col-md-12'
                    style={{
                      marginTop: elementLabel ? "-9px" : "-1px",
                      marginLeft: "7px",
                      width: "157px"
                    }}
                    key={index}
                  >
                {element}
                </div>
              );
            }
            else if (elementType === 'TssRadioButton') {
              return (
                 <div key={index} style={{ position: "relative" ,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span className="input-group-text" id="basic-addon1" style={{ backgroundColor: "white", height: "41px" ,border:"1px solid #BDBDBD",marginTop:`${element.props.label!=="" ? "" : "8px"}`,marginRight:"-3px"}}>
                     {element}
                  </span>
                </div>
              
              );
	    }
            else if (elementType==='TssTextBox') {
              return (
		          <div style={{width:elementSize!=="" ? elementSize : "216px",marginLeft:"-3px",marginTop:(elementLabel=="" || elementLabel==undefined) ? "-7px" : ""}}>      
                {element}
                </div>
              );
            }  
            // } else if (element.type === 'select') {
            //   return (
            //     <div  className='col-md-2' key={index} style={{ position: "relative",left:"3px",marginTop:"-11px" }}>
            //       {element}
            //     </div>
            //   );
            // } 
            else if (elementType==='TssButton') {
              
              return (
                <React.Fragment key={index} >
                {element}
              </React.Fragment>
              );
            }
	         else if (element.props.type === 'text') {
              return (
                <div key={index} style={{ position: "relative" }}>
                  <span className="input-group-text" id="basic-addon1" style={{ backgroundColor: "white", height: "41px" ,border:"1px solid #BDBDBD",marginTop:`${element.props.label!=="" ? "" : "8px"}`}}>
                    {element.props.value}
                  </span>
                </div>
              );
            }
             
            else {
              return (
                <span key={index}>
                {element}
                </span>
              );
            }
          })}
        </div>
	  {/*<div  id={appendElements.length > 0 ? "tss-inputGroup" : "tss-inputGroup-noappend"} className="col" >
          {inputElement.map((element, index) => (
            <div key={index} style={{borderRadius : prependElements.length>=1 ? "0px" : "10px"}}>
              {element}
            </div>
          ))}

        </div>*/}
	    <div
  id={appendElements.length > 0 ? "tss-inputGroup" : "tss-inputGroup-noappend"}
  style={{width:appendElements.length==0 ? "100%" : ""}}
  className="col"
>
  {inputElement.map((element, index) => {
    const elementType = element.type ? element.type.name || element.type : null;
    const elementLabel = element.props?.label;
    return (
        <div
          key={index}
          style={{
            width:appendElements.length==0 ? "100%" : "",
            marginTop: !elementLabel && elementType === "TssSelectBox" ? "10px" : "",
            borderRadius: prependElements.length >= 1 ? "0px" : "10px"
          }}
        >
          {element}
        </div>
    );
  })}
</div>  
        <div className="input-group-append" id="tss-appendInputGroup">
          {appendElements.map((element, index) => {
            const elementType = element.type ? element.type.name || element.type : null;
            const elementLabel = element.props?.label;
             if (element.type === 'div' || element.props.type === 'checkbox' || element.props.type === 'radio') {
              return (
                <span key={index} className="input-group-text" id="basic-addon1" style={{ backgroundColor: "white" ,height:"44px",border:"1px solid #BDBDBD"}}>
                  {element}
                </span>
              );
            }
            else if (elementType==='TssTextBox') {
              
              return (
                <div key={index} style={{ position: "relative" ,marginTop:"-9px"}}>
                {element}
                </div>
              );
            } else if (element.props.type === 'text') {
              return (
                <div key={index} style={{ position: "relative" }}>
                  <span className="input-group-text" id="basic-addon1" style={{ backgroundColor: "white", height: "41px" ,border:"1px solid #BDBDBD"}}>
                    {element.props.value}
                  </span>
                </div>
              );
            } 
             else if (element.type === 'select') {
              return (
                <div key={index} style={{ position: "relative",width:"90%",marginLeft:"5px"}}>
                  {element}
                </div>
              );
            }
            else if (elementType === 'TssSelectBox') {
              return (
                <div
                    className='col-md-12'
                    style={{
                      marginTop: elementLabel ? "-9px" : "-1px",
                      marginLeft: "-7px",
                      width: "157px"
                    }}
                    key={index}
                  >
                {element}
                </div>
              );
            }

            else if (elementType==='TssButton') {
              
              return (
                <React.Fragment key={index}>
                {element}
              </React.Fragment>
              );
            }
            
            else if (elementType==='p') {
              
              return (
                <span key={index} className="input-group-text" id="basic-addon1" style={{ backgroundColor: "white" ,border:"1px solid #BDBDBD",marginTop:"-9px",height:"43px"}}>
                {element}
              </span>
              );
            }
            else {
              return (
                <span key={index} className="input-group-text" id="basic-addon1" style={{ backgroundColor: "white" ,border:"1px solid #BDBDBD",width:"85%",fontSize:"25px"}}>
                  {element}
                </span>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default TSSInputGroup;
