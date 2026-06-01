import React, { useState,useEffect,useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { setAuthentication } from '@app/modules/common/default/store/reducers/auth';
import {showToast} from '@app/modules/common/default/components/TssFunction';
import {checkPasswordValidation} from '@app/modules/common/default/js/validate.js';
import {
  addWindowClass,
  setWindowClass,
  calculateWindowSize,
  removeWindowClass,
} from '@app/modules/common/default/utils/helpers';
import * as Yup from 'yup';
import { authLogin,changePassword } from '@app/modules/common/default/utils/oidc-providers';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined  } from '@ant-design/icons';
import TssConf from '@modules/conf/TssGui.json';
import { v4 as uuidv4 } from 'uuid';
import Carousel from 'react-bootstrap/Carousel';
import OtpInput from 'react-otp-input';


const prodId = TssConf.PRODUCT_ID
const Login = () => {
  let intervalId: string | number | NodeJS.Timeout | undefined; 
  const [isAuthLoading, setAuthLoading] = useState(false);
  const [showChangePasswordFirstLogin, setShowChangePasswordFirstLogin] = useState(false);
  const [loginMethod, setLoginMethod] = useState('password');
  const [otpUsername, setOtpUsername] = useState('');
  const [generateOtpDiv, setGenerateOtpDiv] = useState(true);
  const [enterOtpDiv, setEnterOtpDiv] = useState(false);
  const [otp, setOtp] = React.useState('')
  const [otpError, setOtpError] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [hideResendOtpBtn,setHideResendOtpBtn] = useState(false);
  const [showResendOTPInterval, setShowResendOTPInterval] = useState(false);
  const [acctIdOtpLogin,setAcctIdOtpLogin] = useState('');

  const dispatch = useDispatch();
  const sessionId =  uuidv4();
  const navigate = useNavigate();
  const [t] = useTranslation();
  const otp_resend_Interval = TssConf.OTP_Resend_Interval_Attempts;
  const numberOfRetries=TssConf.OTP_Max_Retries; 
  var defaultCountDownResendOTP =0;
 localStorage.setItem('productId',TssConf.PRODUCT_ID.toString());
 
 const [imagesLoaded, setImagesLoaded] = useState(false);
  const [imagesCount, setImagesCount] = useState(0);

  useEffect(() => {
    setImagesCount(TssConf.LOGIN_LOGO.length);
  }, [TssConf.LOGIN_LOGO]);

  const handleImageLoad = () => {
    setImagesCount((prevCount) => prevCount - 1);
  };

  useEffect(() => {
    if (imagesCount === 0) {
      setImagesLoaded(true);
    }
  }, [imagesCount]);

 
  const login = async (username: string, password: string) => {

    try {
      setAuthLoading(true);
      const requestBody = {
        "i_server_ip": localStorage.getItem("serverIP"),
        "i_product_id": TssConf.PRODUCT_ID,
        "i_username": username,
        "i_passwd": password,
        "i_client_ip": localStorage.getItem("clientIP"),
        "i_session_id": localStorage.getItem("sessionID"),
        "i_ldap_support": "0",
        "i_ldap_flag": 0,
        "i_ldap_grp_id": "",
        "i_ldap_emp_id": "123222"
      };
      const response = await authLogin(requestBody);
      if(response == 8) {
         setShowChangePasswordFirstLogin(true);
          setAuthLoading(false);
      } else {
      const landingPage = localStorage.getItem("landingPage");
      
    if(landingPage == "SiteMap"){
       localStorage.setItem("modulePath","");
       localStorage.setItem("moduleVersionType","0");
       localStorage.setItem("moduleHeading","Sitemap");
    }else{
       localStorage.setItem("modulePath","");
       localStorage.setItem("moduleVersionType","0");
       localStorage.setItem("moduleHeading","Dashboard");
     }


      dispatch(setAuthentication(response as any));
      setAuthLoading(false);
    }

  
    } catch (error: any) {
      setAuthLoading(false);
      showToast('error', error.message); 
    }
  };

  const initialValues = {
    username: '',
    password: '',
    remember: false 
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Invalid Username').required('Username is required'),
    password: Yup.string().required('Password is required').min(TssConf.MAX_PWD_LENGTH, `Password must be at least ${TssConf.MAX_PWD_LENGTH} characters`),
  });

  const onSubmit = (values: { username: any; password: any; }, { resetForm }: any) => {
    login(values.username, values.password);
  };
  
  const formik = useFormik({
    initialValues,
 //   validationSchema,
    onSubmit,
  });

 
  const changePass = async (oldPassword: string, newPassword: string,reNewPassword: string) => {
    try {
      setAuthLoading(true);
      const requestBody = {
        "clientIp":localStorage.getItem("clientIP"),
        "httpSessionId":localStorage.getItem("sessionID"),
        "acctId":localStorage.getItem("acctID"),
        "oldPassword":oldPassword,
        "acctName":localStorage.getItem("username"),
        "newPassword":newPassword,
        "changePasswordFlag":1,
        "productId":prodId
      }
      const response = await changePassword(requestBody);
      if(response == 0) {
         setShowChangePasswordFirstLogin(false);
         setAuthLoading(false);
         showToast('success', 'Password Changed Successfully');
      } else {
      setAuthLoading(false);
    }
      
    }
     catch (error: any) {
      setAuthLoading(false);
      showToast('error', error.message);
    }

  }

  const changePasswordFormik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      reNewPassword: '',
    },
  /*  validationSchema: Yup.object({
      oldPassword: Yup.string().required('Old Password is required'),
      newPassword: Yup.string().required('New Password is required'),
      reNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), undefined], 'Passwords must match')
    .required('Confirm Password is required'),
    }),*/
    onSubmit: (values) => {
      changePass(values.oldPassword,values.newPassword,values.reNewPassword);
    },
  });

  const handleClick = (linkName: React.SetStateAction<string>) => {
    setLoginMethod(linkName);
    setGenerateOtpDiv(true);
    setEnterOtpDiv(false);
     setOtp('');
  }

  const handleUsername = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setOtpUsername(event.target.value)
   }
  
 const sendOTP = async (username) => {
    try {
        const response = await fetch(`${TssConf.SERVER_JS_API_URI}/sendOtpLogin?username=${otpUsername}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        const result = await response.json();

        if (result.status === 'success') {
            const message = result.message;
            setAcctIdOtpLogin(result.acct_id); 
            showToast('success', message);  
            setGenerateOtpDiv(false);
            setEnterOtpDiv(true);
        } else {
            const errorMessage = result.message;  
            console.error(errorMessage);
            showToast('error', errorMessage);  
        }
    } catch (error) {
        console.error("An unexpected error occurred while sending OTP", error);
        showToast('error', 'An unexpected error occurred. Please try again later.'); 
    }
};




 const resendOtp = () => {
    const otpResendAttempt = parseInt(localStorage.getItem('otpResendAttempt') || '0', 10);
    let newresendAttempt = otpResendAttempt+1;
    localStorage.setItem('otpResendAttempt',newresendAttempt.toString());
    if(newresendAttempt <= numberOfRetries) {
      defaultCountDownResendOTP = getResendInterval(newresendAttempt);
      setShowResendOTPInterval(true);
      setCountdown(defaultCountDownResendOTP);
      clearInterval(intervalId);
      intervalId = setInterval(updateResendCountDown, 1000);
    } else {
        setHideResendOtpBtn(true);
    }
    sendOTP();
}

 const getResendInterval = (ResendAttempt: number) => {
    const configItem = otp_resend_Interval.find((item: { attempt: string | null }) => item.attempt == ResendAttempt.toString());
    return configItem ? parseInt(configItem.interval, 10) : 30;
 };
 
function updateResendCountDown() {
    const otpResendAttempt = parseInt(localStorage.getItem('otpResendAttempt') || '0', 10);
      defaultCountDownResendOTP--;

    if(defaultCountDownResendOTP == 0 && otpResendAttempt < numberOfRetries) {
        setShowResendOTPInterval(false);
        clearInterval(intervalId);
    } else if (defaultCountDownResendOTP == 0 && otpResendAttempt == numberOfRetries) {
      clearInterval(intervalId);
      setShowResendOTPInterval(false);
      setHideResendOtpBtn(true);
    }
    setCountdown(defaultCountDownResendOTP);
 }

const handleChangeOTP = (newValue) => {
  setOtp(newValue)
}


const handleOtpLogin = async () => {
  if (otp === "") {
    showToast("error", "Please enter the OTP sent to Your Mobile Number");
    return false;
  }

  try {
    setAuthLoading(true);
     const requestBody = {
        "i_server_ip": localStorage.getItem("serverIP"),
        "i_product_id": TssConf.PRODUCT_ID,
        "i_username": otpUsername,
        "i_passwd": "",
        "i_client_ip": localStorage.getItem("clientIP"),
        "i_session_id": localStorage.getItem("sessionID"),
        "i_ldap_support": "0",
        "i_ldap_flag": 0,
        "i_ldap_grp_id": "",
        "i_ldap_emp_id": "123222",
        "otp":otp,
        "acct_id":acctIdOtpLogin,
        "i_is_otp_login":1,
      };

    const response = await fetch(`${TssConf.SERVER_JS_API_URI}/verifyOtpLogin`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log(JSON.stringify(data));
    if (response.ok) {
     if(data.status == 0) { 
      localStorage.setItem('authentication', JSON.stringify({ profile: { email: data.acctDisplay } }));
      localStorage.setItem('acctName', data.acctDisplay);
      localStorage.setItem('acctID', data.acctId);
      localStorage.setItem('username', otpUsername);
     // localStorage.setItem('password', btoa(requestBody.i_passwd));
      localStorage.setItem('landingPage',data.landingPage);
       

      if(data.landingPage == "SiteMap"){
        localStorage.setItem("modulePath","");
        localStorage.setItem("moduleVersionType","0");
        localStorage.setItem("moduleHeading","Sitemap");
      }else{
        localStorage.setItem("modulePath","");
        localStorage.setItem("moduleVersionType","0");
        localStorage.setItem("moduleHeading","Dashboard");
      }

      const modulesResponse = await fetch(
        `${TssConf.SERVER_JS_API_URI}/get/productModules?productId=${TssConf.PRODUCT_ID}&moduleId=0&accessType=${data.accessType}`
      );

      if (!modulesResponse.ok) {
        throw new Error('Failed to fetch product modules');
      }

      const modulesData = await modulesResponse.json();
      localStorage.setItem('productModules', JSON.stringify(modulesData));

      dispatch(setAuthentication({ profile: { email: data.acctDisplay } } as any));
     } else {
       showToast("error", "Failed to verify OTP");     
     } 
    } else {
      setOtp('');
      showToast("error", "Failed to verify OTP"); 
    }

  } catch (error: any) {
    showToast("error", "Failed to verify OTP");
  } finally {
    setAuthLoading(false);
  }
};




 const returnToLogin = () => {

 }

  return (
<>
    <div className="tsslogin-page" >
    {imagesLoaded ? (
    <div className="tsslogin-box">
      <div className="illustration-wrapper">
      <img src={`/images/${TssConf.PRODUCT_LOGO}`} alt="Logo" style={{ width: '120px', height: 'auto' }} className='mt-4'/>
      {/* <img src={`/images/${TssConf.LOGIN_LOGO}`}  alt="Logo"/> */}
      <Carousel interval={2000}>
       {TssConf.LOGIN_LOGO.map((image, index) => (
        <Carousel.Item key={index}>
          <img src={`/images/${image}`} alt={`Slide ${index + 1}`} onLoad={handleImageLoad} />
        </Carousel.Item>
      ))}
     </Carousel>

      </div>
     
     {!showChangePasswordFirstLogin && loginMethod === 'password' &&
      <Form
        name="tsslogin-form"
        initialValues={{ remember: true }}
        onFinish={formik.handleSubmit}
        onFinishFailed={formik.handleBlur}
       
      >
        <p className="form-title">{TssConf.PRODUCT_NAME}</p>
        <p className="tss-paragraph">Hey please Login into your account!</p> 
        {TssConf.ENABLE_OTP_LOGIN == 1 && 
        <div style={{ textAlign: 'center' ,marginBottom:'10px'}}>
        <ul style={{ display: 'inline-flex', listStyleType: 'none', padding: 0 }}>
          <li style={{ marginRight: '20px' }}>
            <a
                className="tss-paragraph"
                href="#"
                style={{
                    textDecoration: 'none',
                    fontWeight: loginMethod === 'password' ? 'bold' : 'normal',
                    borderBottom: loginMethod === 'password' ? '2px solid #200E74' : '',
                    paddingBottom: '5px',
                    transition: 'border-color 0.3s'
                }}
                onClick={() => handleClick('password')}>
                Login with Password
            </a>
          </li>
          <li>
          <a
              className="tss-paragraph"
              href="#"
              style={{
                  textDecoration: 'none',
                  fontWeight: loginMethod === 'otp' ? 'bold' : 'normal',
                  borderBottom: loginMethod === 'otp' ? '2px solid #200E74' : '',
                  paddingBottom: '5px',
                  transition: 'border-color 0.3s'
              }}
              onClick={() => handleClick('otp')}>
              Login with OTP
          </a>
          </li>
        </ul>
       </div>
      }
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please enter your username!' }]}
        >
          <Input
            placeholder="Username"
            name='username'
            value={formik.values.username}
            onChange={formik.handleChange}
            suffix={<UserOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
    { required: true, message: 'Please enter your password!' },
    { min: TssConf.MIN_PWD_LENGTH, message: `Password must be at least ${TssConf.MIN_PWD_LENGTH} characters!` }
  ]}
          >
          <Input.Password 
            placeholder="Password"
            name='password'
            value={formik.values.password}
            onChange={formik.handleChange}
           
          />
        </Form.Item>
{/*
       <Form.Item>
      <a href="/forgot-password"  className="tsslogin-anchor">Forgot password?</a>
       </Form.Item>
*/}
       <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button" loading={isAuthLoading}  >
          {isAuthLoading ? 'Loading' : 'LOGIN'}
          </Button>
        </Form.Item>

        <div className='tsslogin-footer'>
            {TssConf.LINKS.map((link, index) => (
        <React.Fragment key={index}>
          <a href={link.url}  className='tsslogin-anchor'>
            {link.name}
          </a>
          {index < TssConf.LINKS.length - 1 && <span style={{ margin: '0 10px' }}>|</span>}
        </React.Fragment>
         ))}
          </div>
      </Form>
      }
 
      {loginMethod === 'otp' &&
      <Form
        name="tsslogin-form"
        initialValues={{ remember: true }}
       // onFinish={formik.handleOTP}
        onFinishFailed={formik.handleBlur}>
        <p className="form-title">{TssConf.PRODUCT_TITLE}</p>
        <p className="tss-paragraph">Hey please Login into your account!</p>
        {TssConf.ENABLE_OTP_LOGIN == 1 &&
        <div style={{ textAlign: 'center' ,marginBottom:'10px'}}>
        <ul style={{ display: 'inline-flex', listStyleType: 'none', padding: 0 }}>
          <li style={{ marginRight: '20px' }}>
              <a
                  className="tss-paragraph"
                  href="#"
                  style={{
                      textDecoration: 'none',
                      fontWeight: loginMethod === 'password' ? 'bold' : 'normal',
                      borderBottom: loginMethod === 'password' ? '2px solid #200E74' : '',
                      paddingBottom: '5px',
                      transition: 'border-color 0.3s'
                  }}
                  onClick={() => handleClick('password')}>
                  Login with Password
              </a>
          </li>
          <li>
              <a
                  className="tss-paragraph"
                  href="#"
                  style={{
                      textDecoration: 'none',
                      fontWeight: loginMethod === 'otp' ? 'bold' : 'normal',
                      borderBottom: loginMethod === 'otp' ? '2px solid #200E74' : '',
                      paddingBottom: '5px',
                      transition: 'border-color 0.3s'
                  }}
                  onClick={() => handleClick('otp')}
              >
                  Login with OTP
              </a>
          </li>
        </ul>
    </div>
    }
    {generateOtpDiv &&
    <>
       <Form.Item
      name="username"
      rules={[{ required: true, message: 'Please enter your username!' }]}
    >
      <Input
        placeholder="Username"
        name='username'
        value={formik.values.username}
        onChange={handleUsername}
        suffix={<UserOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
      />
    </Form.Item>
   <Form.Item>
      <Button type="primary" htmlType="submit" className="login-form-button"  onClick={sendOTP}>
        Generate OTP
      </Button>
    </Form.Item>
    </>

    }
    {enterOtpDiv &&
    <>
     <div className="otp-input-container gap-3" style={{ display: 'flex', justifyContent: 'center', marginBottom:'30px',gap:'1em'}}>
       <OtpInput value={otp} onChange={setOtp} numInputs={TssConf.OTP_LENGTH_LOGIN} renderSeparator={<span style={{ margin: '0 8px' }}></span>}  renderInput={(props) => (<input{...props} style={{ width: '40px', height: '40px', textAlign: 'center', border: '1px solid #ccc',borderRadius: '4px',outline: 'none', }}/>)} />
 
    </div>
     <Form.Item>
     <Button type="primary" htmlType="submit" className="login-form-button"  onClick={handleOtpLogin}>
       Login
     </Button>
   </Form.Item>

      {!showResendOTPInterval && !hideResendOtpBtn &&
         <p>
            Didnt recieve the code? <span style={{ fontWeight: 'bold',cursor:'pointer' }} onClick={resendOtp}>Resend</span>
        </p>
      }
      {showResendOTPInterval &&
         <p style={{color:"red"}}> Resend Code in {countdown} seconds</p>
      }
      <p style={{ cursor: 'pointer',fontWeight: 'bold' }}  onClick={returnToLogin}> Return To Login</p>
    </>
    }
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
          {TssConf.LINKS.map((link, index) => (
          <React.Fragment key={index}>
        <a href={link.url}  className='tsslogin-anchor'>
          {link.name}
        </a>
        {index < TssConf.LINKS.length - 1 && <span style={{ margin: '0 10px' }}>|</span>}
      </React.Fragment>
        ))}
        </div>
      </Form>
      }


      {showChangePasswordFirstLogin && (
          <Form
          name="tsslogin-form"
          initialValues={{ remember: true }}
          onFinish={changePasswordFormik.handleSubmit}
          onFinishFailed={changePasswordFormik.handleBlur}
        >
          <p className="form-title">{TssConf.PRODUCT_NAME}</p>
          <p className="tss-paragraph">Please Change the Password!</p>

          <Form.Item
            name="oldPassword"
            rules={[{ required: true, message: 'Mandatory' }]}>
            <Input.Password
              placeholder="Enter Old Password"
              name="oldPassword"
              value={changePasswordFormik.values.oldPassword}
              onChange={changePasswordFormik.handleChange}
            />
          </Form.Item>

          <Form.Item
          name="newPassword"
          rules={[
			  {
        validator: (_, value) => {
		   const complexity = TssConf.PWD_COMPLEXITY; 
		   const minLen = TssConf.MIN_PWD_LENGTH; 
		   const maxLen = TssConf.MAX_PWD_LENGTH;
                   const oldPassword = changePasswordFormik.values.oldPassword;
		   const validationError = checkPasswordValidation(value, oldPassword,complexity, minLen, maxLen, t);

		   if (validationError) {
			   return Promise.reject(new Error(validationError)); 
		   }

		   if (value && value === changePasswordFormik.values.oldPassword) {
			   return Promise.reject(new Error('New password cannot be the same as the old password'));
		   }

		   return Promise.resolve();
	        },
               },]} >
           <Input.Password
	          placeholder="Enter New Password"
           name="newPassword"
	         value={changePasswordFormik.values.newPassword}
	         onChange={changePasswordFormik.handleChange} />
            </Form.Item>


          <Form.Item
            name="reNewPassword"
            rules={[{ required: true, message: 'Mandatory' },
             {
            validator: (_, value) => {
              if (!value || value === changePasswordFormik.values.newPassword) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords must match'));
            },
          },
            ]}>
            <Input.Password
              placeholder="Re-enter New Password"
              name="reNewPassword"
              value={changePasswordFormik.values.reNewPassword}
              onChange={changePasswordFormik.handleChange}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" loading={isAuthLoading}>
              {isAuthLoading ? 'Loading' : 'Change Password'}
            </Button>
          </Form.Item>

          <div className="tsslogin-footer">
            {TssConf.LINKS.map((link, index) => (
              <React.Fragment key={index}>
                <a href={link.url} className="tsslogin-anchor">
                  {link.name}
                </a>
                {index < TssConf.LINKS.length - 1 && <span style={{ margin: '0 10px' }}>|</span>}
              </React.Fragment>
            ))}
          </div>
        </Form> 
     )}    

    </div>
    )   : (
      <div style={{marginTop:"-70px"}} >
        <img src={`/src/modules/common/default/img/${TssConf.PRODUCT_LOGO}`} alt="Logo" style={{ width: '200px', height: 'auto' }} />
      </div>
 
)}
  </div>
  </>
  );
};

export default Login;
