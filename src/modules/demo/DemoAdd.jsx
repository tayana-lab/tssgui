// import TssTextBox from '@modules/common/default/components/TssTextBox';
// import { useTranslation } from 'react-i18next';
// import React, { useState } from 'react';
// import ConfirmationDialog from '@app/modules/demo/ConfirmationDialog';
// const DemoAdd = ({closeAddPage,addData})=>{
//   const [t] = useTranslation();
//   const [showConfirmation, setShowConfirmation] = useState(false);

// return(

//   <div>
//   <section className="content">
//     <div className="container-fluid">
//     <div class="card">
//     <div class="card-body align-items-center py-8">

// <div className="row">
//    <div align="left" className="form-group col-md-4">
//    <TssTextBox  validation="form" placeholderName={t('modules.Demo.addpage.placeholder.input1')} mandatory="true" label={t('modules.Demo.addpage.label.input1')}/> 
//    </div>
//    <div align="left" className="form-group col-md-4">
//    <TssTextBox  validation="form" placeholderName={t('modules.Demo.addpage.placeholder.input2')} mandatory="true" label={t('modules.Demo.addpage.label.input2')}/> 
//    </div>
//    <div align="left" className="form-group col-md-4">
//    <TssTextBox validation="form"  placeholderName={t('modules.Demo.addpage.placeholder.input3')} mandatory="true" label={t('modules.Demo.addpage.label.input3')}/>  
//    </div>
// </div>

// <div className="col-md-12 d-flex justify-content-end">
//             <button type="button" className="btn btn-primary mr-2" data-target="#confirmationModal" data-toggle="modal" onClick={addData}>{t('modules.Demo.addpage.buttons.add')}</button>
//             <button type="button" className="btn btn-primary mr-2">{t('modules.Demo.addpage.buttons.reset')}</button>
//             <button type="button" className="btn btn-primary" onClick={closeAddPage}>{t('modules.Demo.addpage.buttons.close')}</button>
//           </div>

//           {/* {showConfirmation && (
//         <ConfirmationDialog 
//           message="Are you sure you want to add?"
//           onConfirm={handleConfirm}
//           onCancel={handleCancel}
//         />
//       )} */}

// </div>
// </div>
          
    
// </div>
// </section>
// </div>


// )


// }
// export default DemoAdd;


import React, { useState } from 'react';
import TssTextBox from '@modules/common/default/components/TssTextBox';
import { useTranslation } from 'react-i18next';
import { formValidation } from '@form-validation/bundle/popular';

const DemoAdd = ({ closeAddPage, addData }) => {
  const [t] = useTranslation();
  const [formErrors, setFormErrors] = useState({});

  const validateForm = (data) => {
    const validationSchema = {
      input1: {
        required: true,
        message: 'Input 1 is required'
      },
      input2: {
        required: true,
        message: 'Input 2 is required'
      },
      input3: {
        required: true,
        message: 'Input 3 is required'
      }
    };

    const errors = formValidation(data, validationSchema);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(":::::::bbbbbbbbb")
    const formData = {
      input1: event.target.input1.value,
      input2: event.target.input2.value,
      input3: event.target.input3.value
    };

    if (validateForm(formData)) {
      //addData(formData);
    }
  };

  return (
    <div>
      <section className="content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-body align-items-center py-8">
              <form onSumbit={handleSubmit}>
                <div className="row">
                  <div align="left" className="form-group col-md-4">
                    <TssTextBox
                      name="input1"
                      validation="form"
                      placeholderName={t('modules.Demo.addpage.placeholder.input1')}
                      mandatory={true}
                      label={t('modules.Demo.addpage.label.input1')}
                      tooltipMessage={formErrors.input1}
                    />
                  </div>
                  <div align="left" className="form-group col-md-4">
                    <TssTextBox
                      name="input2"
                      validation="form"
                      placeholderName={t('modules.Demo.addpage.placeholder.input2')}
                      mandatory={true}
                      label={t('modules.Demo.addpage.label.input2')}
                      tooltipMessage={formErrors.input2}
                    />
                  </div>
                  <div align="left" className="form-group col-md-4">
                    <TssTextBox
                      name="input3"
                      validation="form"
                      placeholderName={t('modules.Demo.addpage.placeholder.input3')}
                      mandatory={true}
                      label={t('modules.Demo.addpage.label.input3')}
                      tooltipMessage={formErrors.input3}
                    />
                  </div>
                </div>

                <div className="col-md-12 d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary mr-2" onClick={handleSubmit}>
                    {t('modules.Demo.addpage.buttons.add')}
                  
                  </button>
                  <button type="reset" className="btn btn-primary mr-2">
                    {t('modules.Demo.addpage.buttons.reset')}
                  </button>
                  <button type="button" className="btn btn-primary" onClick={closeAddPage}>
                    {t('modules.Demo.addpage.buttons.close')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DemoAdd;
