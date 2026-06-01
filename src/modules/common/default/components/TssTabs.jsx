import React,{useState,useRef,useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
const TssTabs = ({ tabsList = [] , defaultTab }) => {

	const [activeTab, setActiveTab] = useState(defaultTab || (tabsList.length > 0 ? tabsList[0].Name : ''));

        const handleTssTabClick = (tabName) => {
                setActiveTab(tabName);
		localStorage.setItem('activeTab', tabName);	
        };

	const tabListItems = tabsList.map((tab, index) => (
			
    		<li key={index} className="nav-item" >
        	  <a
			className={`nav-link tss-tab-link  ${activeTab === tab.Name ? 'active active-tab' : ''} `} 
          		title ={tab.Name}
          		onClick={() => handleTssTabClick(tab.Name)}
        	  >
           		{tab.Name}
        	  </a>
    		</li>
	));


	const selectedTabComponent = tabsList.find(tab => tab.Name === activeTab)?.Component;
	const darkMode = useSelector((state) => state.ui.darkMode);
  return (
	<>
		<ul className='nav nav-tabs tss-tabs' role="tablist" style={{backgroundColor:"white"}}>	
			{tabListItems}	
			
	  	</ul>
	  	
	   <div className="tss-tab-body">
                {selectedTabComponent}
            </div>
	</>
  );
};

export default TssTabs;

