// mainPage.js
import React, { useState } from 'react';
import AccountsView from './DemoView';
import AccountsAdd from './DemoAdd'
import ContentHeader from '@app/modules/common/default/components/TssContentHeader';
import ConfirmationDialog from '@app/modules/demo/ConfirmationDialog';
const Demo = () => {

  const [displayAddPage, setDisplayAddPage] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setConfirmationMessage] =useState(false);
  const [action, setAction] =useState("");
    const handleClick = () => {
   
       setDisplayAddPage(true);
      };
   const handleClose=()=>{
    setDisplayAddPage(false);
   }

   const deleteRow=() =>{
    setShowConfirmation(true);
    setConfirmationMessage("Are you sure you want to delete?");
    setAction("delete");
   }

   const addData=()=>{
    setShowConfirmation(true);
    setConfirmationMessage("Are you sure you want to add?");
    setAction("add");
   }
   const btnProps = {
    "data-target" : "#myFirstModal" ,
    "data-toggle" : "modal"
    
    };

    const handleConfirm = () => {
      // Your logic for confirmation
      console.log("Confirmed");
      setShowConfirmation(false);
    };
  
    const handleCancel = () => {
      // Your logic for cancellation
      console.log("Cancelled");
      setShowConfirmation(false);
      
    };


  return (
    <div>
        {/* <ContentHeader title="Demo" /> */}
      {displayAddPage&& (
        <AccountsAdd closeAddPage={handleClose} addData={addData}/>
      )}
      <AccountsView LoadAddPage ={handleClick} deleteRow={deleteRow} />
      
      {showConfirmation && (
        <ConfirmationDialog 
         // message="Are you sure you want to add?"
          message= {message}
          action={action}
          onConfirm={handleConfirm}
        />
      )}


    </div>
  );
};

export default Demo;
