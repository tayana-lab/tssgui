import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTriangleExclamation,faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import TssButton from '@modules/common/default/components/TssButton'
const ConfirmationDialog = ({ message, onConfirm,action }) => {
  
  const confirmProp = {
      "data-dismiss": "modal",
  };

  const cancelProp = {
    "data-dismiss": "modal",
};

  return (
    <>
    <div className="modal fade" id="confirmationModal" data-bs-backdrop="static" aria-labelledby="confirmationModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered mw-500px mh-200px" >
      <div className="modal-content"  style={{borderRadius:"8px"}}>     
        <div className="modal-header" style={{border:"none"}} >
          <div>
          </div>
          </div>
        
          {/* <div className="modal-header" style={{border:'none'}}>
            <h5 className="modal-title" id="confirmationModalLabel">Confirmation  
            {action === "delete" ? (
  <FontAwesomeIcon icon={faTriangleExclamation} style={{color: "#ff0505", marginLeft: '8px'}} />
) : (
  <FontAwesomeIcon icon={faTriangleExclamation} style={{color: "#0e8ff1", marginLeft: '8px'}} />
)}

            </h5>
            
          </div> */}
          <div className="modal-body" style={{display:"flex",justifyContent:"center",textAlign:"center"}} >
          <h5 style={{fontWeight:"bold"}}>{message}</h5>
          <br/>
          </div>
          <div className="modal-footer" style={{marginBottom:"3%",border:'none',display:"flex",justifyContent:"center",textAlign:"center"}}>
             {/* <button type="button" className="btn btn-outline-primary" style={{width:"100px",borderRadius:"32px"}} data-dismiss="modal" aria-label="Close" >Cancel</button>
             <button type="button" className="btn btn-primary" style={{width:"100px",borderRadius:"32px"}} data-dismiss="modal" onClick={onConfirm}  > Confirm</button> 
             */}
            <TssButton id="cancelButton" type="button" label="Cancel" btnProps={cancelProp} />
            <TssButton id="confirmButton" type="button" label="Confirm"  btnProps={confirmProp} />
          </div>
        </div>
      </div>
    </div>



   </>
  );
};




export default ConfirmationDialog;
