import Swal from 'sweetalert2';
import config from '../../../conf/TssGui.json';
// Confirmation Alert
export const confirmAction = async (textMsg, confirmText = 'Yes', cancelText = 'No') => {
  const result = await Swal.fire({
    title: '',
    text: textMsg,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    allowOutsideClick: false,
  });

  return result.isConfirmed;
};

// Success Alert
export const successAlert = (textMsg) => {
  Swal.fire({
   // title: 'Success',
    text: textMsg,
    //icon: 'success',
    confirmButtonColor: '#c4b0f3',
    allowOutsideClick: false
  });
};

// Error Alert
export const errorAlert = (textMsg) => {
  Swal.fire({
   // title: 'Error',
    text: textMsg,
    icon: 'error',
    confirmButtonColor: '#c4b0f3',
    allowOutsideClick: false,
    customClass: {
        confirmButton: 'swal2-confirm-button'
      }
  });
};

// Info Alert
/*port const infoAlert = (textMsg) => {
  Swal.fire({
   // title: 'Info',
    text: textMsg,
   // icon: 'info',
    confirmButtonColor: '#5C3DA4 ',
    allowOutsideClick: false,
    customClass: {
        confirmButton: 'swal2-confirm-button'
      }
  });
};
*/
export const infoAlert = (textMsg, onConfirm) => {
  Swal.fire({
    text: textMsg,
    confirmButtonColor: '#5C3DA4',
    allowOutsideClick: false,
    customClass: {
      confirmButton: 'swal2-confirm-button'
    }
  }).then((result) => {
    if (result.isConfirmed && typeof onConfirm === 'function') {
      onConfirm(); 
    }
  });
};

export const showLoginWarning = (icon, title) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: config.WARNING_TIMEOUT,
    showCloseButton: true
  });

  Toast.fire({
    icon: icon,
    title: title,
    width: '500px'
  });
};

// Toast Notification
export const showToast = (icon, title, position = 'top-end') => {
  let timer;
  if (icon === 'success') {
    timer = config.SUCCESS_TIMEOUT;
  } else if (icon === 'error') {
    timer = config.ERROR_TIMEOUT;
  } 
  const Toast = Swal.mixin({
    toast: true,
    position: position,
    showConfirmButton: false,
    showCloseButton: true,
    timer: timer,
    timerProgressBar: true,
    customClass: {
      popup: 'custom-toast'
    },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);

      const progressBar = toast.querySelector('.swal2-timer-progress-bar');
      if (icon === 'success') {
        progressBar.classList.add('swal2-progress-bar-success');
      } else if (icon === 'error') {
        progressBar.classList.add('swal2-progress-bar-error');
      }
    }
  });

  Toast.fire({
    icon: icon,
    title: title
  });
};


export const chkDateWithTimeWithDateFormat = ( date, text, DateFormat, t) => {
  let errorMessage = "";
  const checkDate = () => {
    if (date === '') {
      errorMessage = t("modules.Generic.errorMsg.mandatory");
      return errorMessage;
    }

    let dd = '';
    let mm = '';
    let yyyy = '';
    let time = '';

    if ("YYYY" === DateFormat.substring(0, date.indexOf("-"))) {
      yyyy = date.substring(0, date.indexOf("-"));
      mm = date.substring(date.indexOf("-") + 1, date.lastIndexOf("-"));
      dd = date.substring(date.lastIndexOf("-") + 1, date.lastIndexOf(" "));
    } else if ("MM" === DateFormat.substring(0, date.indexOf("-"))) {
      mm = date.substring(0, date.indexOf("-"));
      yyyy = date.substring(date.indexOf("-") + 1, date.lastIndexOf("-"));
      dd = date.substring(date.lastIndexOf("-") + 1, date.lastIndexOf(" "));
    } else if ("DD" === DateFormat.substring(0, date.indexOf("-"))) {
      dd = date.substring(0, date.indexOf("-"));
      mm = date.substring(date.indexOf("-") + 1, date.lastIndexOf("-"));
      yyyy = date.substring(date.lastIndexOf("-") + 1, date.lastIndexOf(" "));
    }

    time = date.substring(date.lastIndexOf(" "), date.length);

    const tempdat = new Date();
    const curdat = new Date(tempdat.getFullYear(), tempdat.getMonth(), tempdat.getDate());
    const seldat = new Date(yyyy, mm - 1, dd);
    if (seldat > curdat) {
      errorMessage = `${text} ${t("modules.Generic.errorMsg.chkDateTimeWithCurDate")}`;
      return false;
    }

    return true;
  };
  checkDate();
  return errorMessage;
};

export const validateFromDateTimeAndToDateTimeWithDateFormat = (fromDate,fromDateText,toDate,toDtText1,DateFormat, t) => {
   let errorMessage = "";
   let curDate = new Date();
   let yyyy="";
   let yyyy1="";
   let mm="";
   let mm1="";
   let dd="";
   let dd1="";

   if("YYYY"==DateFormat.substring(0,fromDate.indexOf("-")))
    {
           yyyy=fromDate.substring(0,fromDate.indexOf("-"));
          if("MM"==DateFormat.substring(fromDate.indexOf("-")+1,fromDate.lastIndexOf("-")))
          {
              mm=fromDate.substring(fromDate.indexOf("-")+1,fromDate.lastIndexOf("-"));
              dd=fromDate.substring(fromDate.lastIndexOf("-")+1,fromDate.lastIndexOf(" "));
          }
          else
          {
              dd=fromDate.substring(fromDate.indexOf("-")+1,fromDate.lastIndexOf("-"));
              mm=fromDate.substring(fromDate.lastIndexOf("-")+1,fromDate.lastIndexOf(" "));
          }
    }

    else if("MM"==DateFormat.substring(0,fromDate.indexOf("-")))
    {
           mm=fromDate.substring(0,fromDate.indexOf("-"));
          if("DD"==DateFormat.substring(fromDate.indexOf("-")+1,fromDate.lastIndexOf("-")))
          {
              dd=fromDate.substring(fromDate.indexOf("-")+1,fromDate.lastIndexOf("-"));
              yyyy=fromDate.substring(fromDate.lastIndexOf("-")+1,fromDate.lastIndexOf(" "));
          }
                   else
         {
             yyyy=fromDate.substring(fromDate.indexOf("-")+1,fromDate.lastIndexOf("-"));
             dd=fromDate.substring(fromDate.lastIndexOf("-")+1,fromDate.lastIndexOf(" "));
         }
   }

   else if("DD"==DateFormat.substring(0,fromDate.indexOf("-")))
   {
          dd=fromDate.substring(0,fromDate.indexOf("-"));
         if("MM"==DateFormat.substring(fromDate.indexOf("-")+1,fromDate.lastIndexOf("-")))
         {
             mm=fromDate.substring(fromDate.indexOf("-")+1,fromDate.lastIndexOf("-"));
             yyyy=fromDate.substring(fromDate.lastIndexOf("-")+1,fromDate.lastIndexOf(" "));
         }
         else
         {
             yyyy=fromDate.substring(fromDate.indexOf("-")+1,fromDate.lastIndexOf("-"));
             mm=fromDate.substring(fromDate.lastIndexOf("-")+1,fromDate.lastIndexOf(" "));
         }
   }

   let hh=fromDate.substring(fromDate.indexOf(" ")+1,fromDate.indexOf(":"));
   let min=fromDate.substring(fromDate.indexOf(":")+1,fromDate.lastIndexOf(":"));
   let ss=fromDate.substring(fromDate.lastIndexOf(":")+1,fromDate.length);

   if("YYYY"==DateFormat.substring(0,toDate.indexOf("-")))
    {
           yyyy1=toDate.substring(0,toDate.indexOf("-"));
          if("MM"==DateFormat.substring(toDate.indexOf("-")+1,toDate.lastIndexOf("-")))
          {
              mm1=toDate.substring(toDate.indexOf("-")+1,toDate.lastIndexOf("-"));
              dd1=toDate.substring(toDate.lastIndexOf("-")+1,toDate.lastIndexOf(" "));
          }
          else
          {
              dd1=toDate.substring(toDate.indexOf("-")+1,toDate.lastIndexOf("-"));
              mm1=toDate.substring(toDate.lastIndexOf("-")+1,toDate.lastIndexOf(" "));
          }
    }

    else if("MM"==DateFormat.substring(0,toDate.indexOf("-")))
    {
           mm1=toDate.substring(0,toDate.indexOf("-"));
          if("DD"==DateFormat.substring(toDate.indexOf("-")+1,toDate.lastIndexOf("-")))
          {
              dd1=toDate.substring(toDate.indexOf("-")+1,toDate.lastIndexOf("-"));
              yyyy1=toDate.substring(toDate.lastIndexOf("-")+1,toDate.lastIndexOf(" "));
          }
                   else
         {
             yyyy1=toDate.substring(toDate.indexOf("-")+1,toDate.lastIndexOf("-"));
             dd1=toDate.substring(toDate.lastIndexOf("-")+1,toDate.lastIndexOf(" "));
         }
   }

   else if("DD"==DateFormat.substring(0,toDate.indexOf("-")))
   {
          dd1=toDate.substring(0,toDate.indexOf("-"));
         if("MM"==DateFormat.substring(toDate.indexOf("-")+1,toDate.lastIndexOf("-")))
         {
             mm1=toDate.substring(toDate.indexOf("-")+1,toDate.lastIndexOf("-"));
             yyyy1=toDate.substring(toDate.lastIndexOf("-")+1,toDate.lastIndexOf(" "));
         }
         else
         {
             yyyy1=toDate.substring(toDate.indexOf("-")+1,toDate.lastIndexOf("-"));
             mm1=toDate.substring(toDate.lastIndexOf("-")+1,toDate.lastIndexOf(" "));
         }
   }

   let hh1=toDate.substring(toDate.indexOf(" ")+1,toDate.indexOf(":"));
   let min1=toDate.substring(toDate.indexOf(":")+1,toDate.lastIndexOf(":"));
   let ss1=toDate.substring(toDate.lastIndexOf(":")+1,toDate.length);

   let fromDt = new Date(yyyy,mm-1,dd,hh,min,ss);
   let toDt = new Date(yyyy1,mm1-1,dd1,hh1,min1,ss1);

   if(toDt < fromDt)
   {
      return(`${toDtText1} ${t("modules.Generic.errorMsg.shldBeGreater")} ${fromDateText}`);
   }
   return errorMessage;
};

