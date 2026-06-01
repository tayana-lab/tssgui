import React, { useState, useEffect } from 'react';
import TssSpinner from '@app/modules/common/default/components/TssSpinner';

const TssResponseSpinner = ({ isLoading = false,textRequired=true }) => {
  const [loading, setLoading] = useState(isLoading);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  

  return (
    <>
       {loading && (
          <div className="tss-loading-overlay">
            
            <div className="tss-loading-spinner">
            {/* {textRequired && (
            <div className='tss-text'>  
            &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<p className='tss-helper-text'>Please Wait...</p>
            <br />
            <br />
            <br />
            <br />
            </div>)}  */}
            <br />
            <br />
            <br />
            <br />
              <TssSpinner isLoading={true} />
            </div>
          </div>
      )}
    </>
  );
};

export default TssResponseSpinner;
