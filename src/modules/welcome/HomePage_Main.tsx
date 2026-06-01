import { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebarMenu } from '@app/modules/common/default/store/reducers/ui';
import { addWindowClass, removeWindowClass, sleep } from '@app/modules/common/default/utils/helpers';
//import ControlSidebar from '@app/modules/main/control-sidebar/ControlSidebar';
import Header from '@app/modules/welcome/HomePage_topnav';
import MenuSidebar from '@app/modules/main/menu-sidebar/MenuSidebar';
import Footer from '@app/modules/welcome/HomePage_footer';
import { Image } from '@profabric/react-components';
import HomePage_leftbar from '@app/modules/welcome/HomePage_leftbar';
//import Explore from '@app/modules/welcome/explore/Explore';
import TssContentHeader from '@app/modules/common/default/components/TssContentHeader';
import TssConf from '@app/modules/conf/TssGui.json';
import { useTranslation } from 'react-i18next';
const Main = () => {

//const [currentModule, setCurrentModule] = useState("Dashboard");
  const {i18n} = useTranslation();
  const dispatch = useDispatch();
  const menuSidebarCollapsed = useSelector(
    (state: any) => state.ui.menuSidebarCollapsed
  );
  const controlSidebarCollapsed = useSelector(
    (state: any) => state.ui.controlSidebarCollapsed
  );
  const screenSize = useSelector((state: any) => state.ui.screenSize);
  const authentication = useSelector((state: any) => state.auth.authentication);
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [showButton,setShowButton] =useState(false);


  const handleToggleMenuSidebar = () => {
    dispatch(toggleSidebarMenu());
  };

  useEffect(() => {
    setIsAppLoaded(Boolean(authentication));
  }, [authentication]);

  useEffect(() => {
    removeWindowClass('register-page');
    removeWindowClass('login-page');
    removeWindowClass('hold-transition');

    addWindowClass('sidebar-mini');
    addWindowClass('layout-fixed'); 
   // fetchProfile();
    return () => {
      removeWindowClass('sidebar-mini');
      removeWindowClass('layout-fixed');
    };
  }, []);

  useEffect(() => {
    removeWindowClass('sidebar-closed');
    removeWindowClass('sidebar-collapse');
    removeWindowClass('sidebar-open');
    if (menuSidebarCollapsed && screenSize === 'lg') {
      addWindowClass('sidebar-collapse');
    } else if (menuSidebarCollapsed && screenSize === 'xs') {
      addWindowClass('sidebar-open');
    } else if (!menuSidebarCollapsed && screenSize !== 'lg') {
      addWindowClass('sidebar-closed');
      addWindowClass('sidebar-collapse');
    }
  }, [screenSize, menuSidebarCollapsed]);

  useEffect(() => {
    if (controlSidebarCollapsed) {
      removeWindowClass('control-sidebar-slide-open');
    } else {
      addWindowClass('control-sidebar-slide-open');
    }
  }, [screenSize, controlSidebarCollapsed]);



  useEffect(() => {
    const acctName = localStorage.getItem('acctName');
    const acctID = localStorage.getItem('acctID');
    const username = localStorage.getItem('username');
    const productId = localStorage.getItem('productId');
    const serverIP = localStorage.getItem('serverIP');
    const clientIP = localStorage.getItem("clientIP");
    const sessionID = localStorage.getItem("sessionID"); 
   
    localStorage.setItem('acctName',acctName);
    localStorage.setItem('acctID',acctID);
    localStorage.setItem('username',username);
    localStorage.setItem('productId',productId);
    localStorage.setItem('serverIP',serverIP);
    localStorage.setItem('clientIP',clientIP);
    localStorage.setItem('sessionID',sessionID);

    const languageDetails = async () =>{
        try {
      var language="";
      var acctId = localStorage.getItem("acctID");
       const languageData = await fetch(`${TssConf.SERVER_JS_API_URI}/tssgui/get/account/details?accountId=${acctId}`);
      const data = await languageData.json();
      const languageId = data[0].languageId;
      if(languageId == "1"){
         language = "en"
      }else{
         language="in"
      }
       i18n.changeLanguage(language);
    }catch(error){
     //  console.error("Error fetching language details:", error);
    }
};

languageDetails(); 
}, []);




  const getAppTemplate = useCallback(() => {
   {/* if (!isAppLoaded) {
      return (
        <div className="preloader flex-column justify-content-center align-items-center">
          <Image
            className="animation__shake"
            src="/img/logo.png"
            alt="AdminLTELogo"
            height={60}
            width={60}
          />
        </div>
      );
    }  */}
    return (
      <>
        <Header />
         <HomePage_leftbar/> {/*passCurrentModule={passCurrentModule} */}

        <div className="content-wrapper" id="rightSectionDiv">
          {/* <div className="pt-3" /> */}
          <section className="content">
            <TssContentHeader />
            <div className="content-body">
            <Outlet />
            </div>
            {/* <Explore/> */}
         </section>
          
        </div>
        <Footer />
      {/*  <ControlSidebar /> */}
        <div
          id="sidebar-overlay"
          role="presentation"
          onClick={handleToggleMenuSidebar}
          onKeyDown={() => {}}
        />
      </>
    );
  }, [isAppLoaded]);

  return <div className="wrapper">{getAppTemplate()}</div>;
};

export default Main;
