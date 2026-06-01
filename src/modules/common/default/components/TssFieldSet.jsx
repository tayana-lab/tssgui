import React from 'react';

const TssFieldSet = ({ fieldSetData }) => {
    if (!fieldSetData || fieldSetData.length === 0) {
        return <div className="text-muted" style={{textAlign:"center"}} >No data available</div>;
    }


    return (
        <fieldset className="tss-fieldset">
           
         {fieldSetData}
     
       </fieldset>
    );
};
export default TssFieldSet;

