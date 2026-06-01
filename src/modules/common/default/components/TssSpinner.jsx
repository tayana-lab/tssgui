import React,{useState,useRef,useEffect} from 'react';
import {MetroSpinner} from "react-spinners-kit";
const TssSpinner = ({isLoading=false}) => {

  const [loading, setLoading] = useState(isLoading)	
 
  return (
	<>
		<div>
           <div className="spinnerContainer" >
                            <div className="spinner">
                                <MetroSpinner  size={50} color="#5C3DA4"
                                    loading={loading} />
                                <br />    
                               
                            </div>
           </div>
         </div>

	</>
  );
};

export default TssSpinner;

