import React, { useRef, useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useNavigate } from 'react-router-dom'; 
import { useDispatch } from 'react-redux';
import { setAuthentication } from '@app/modules/common/default/store/reducers/auth';
import TssConf from '@app/modules/conf/TssGui.json';
import {showLoginWarning} from '@app/modules/common/default/components/TssFunction';

//import Swal from 'sweetalert2';
const SessionTimeout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const idleTimerRef = useRef(null);
  const timeout = 1000 * 60 * TssConf.SESSION_TIMEOUT ; 
 
  /*const showAlert = () => {  
    var Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 10000,
      showCloseButton: true
    });

  Toast.fire({
    icon: 'warning',
    title: 'Session Expired! Please login again.',
    width: '500px'
  })
};*/
 
 
  const onIdle = () => {
    //showAlert();
  showLoginWarning('warning','Session Expired! Please login again.');
    dispatch(setAuthentication(undefined));
    navigate('/login'); 
    localStorage.removeItem('authentication');
  };

  const handleOnActive = (event) => {
    // console.log('User is active', event);
    // console.log('Time remaining', getRemainingTime());
  };

  const handleOnAction = (event) => {
    // console.log('User did something', event);
  };

  const { getRemainingTime, getLastActiveTime, reset, resume } = useIdleTimer({
    ref: idleTimerRef,
    timeout,
    onIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500
  });

  useEffect(() => {
    const storedTimestamp = localStorage.getItem('lastActiveTimestamp');
    if (storedTimestamp) {
      const elapsed = Date.now() - parseInt(storedTimestamp, 10);
      if (elapsed > timeout) {
  //	      showAlert();
  //       showLoginWarning('warning','Session Expired! Please login again.');
        dispatch(setAuthentication(undefined));
        navigate('/login'); 
        localStorage.removeItem('authentication');
      } else {
        resume();
        reset(timeout - elapsed);
      }
    } else {
      resume();
    }
  }, [reset, timeout, resume, dispatch]);

  useEffect(() => {
    const handleUnload = () => {
      localStorage.setItem('lastActiveTimestamp', Date.now().toString());
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  return (
    <></>
  ); // This component does not render anything visible
};

export default SessionTimeout;
