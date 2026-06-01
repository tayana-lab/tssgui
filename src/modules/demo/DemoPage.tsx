import React,{useState} from 'react'
import DemoHomePage from './DemoHomePage';
import AccountsMain from './Demo';
//import './GenericCss.css'
import ContentHeader from '@app/modules/common/default/components/TssContentHeader';
import { Navigate, useNavigate } from 'react-router-dom';
import SelectedModule from '../main/selected-module/SelectedModule';
import TssTabs from '@modules/common/default/components/TssTabs';

const DemoPage = () => {
  const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState('Home');

	const handleTabClick = (tabName: React.SetStateAction<string>) => {
		setActiveTab(tabName);
	};

  localStorage.setItem("activeTab", activeTab )
const TABLIST = [
{
        "Name": "Tab1",
        "Component": <DemoHomePage key="tab1" pointOfCall="0"/>,
	"endPoint" :"/tbrTab1"
    },
    {
        "Name": "Home",
        "Component": <DemoHomePage   key="home"  pointOfCall="1" />,
	"endPoint" :"/tbrHome"
    }

];

	return (
<TssTabs tabsList={TABLIST} defaultTab="Home"/>

  )
}

export default DemoPage
