import React,{useState,useEffect} from 'react';
import TssConf from "@app/modules/conf/TssGui.json";
import { useDispatch, useSelector } from 'react-redux';
//import LastOneMinuteLicense from '@modules/smsc/mis/Online_LastOneMinuteLicense';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto'; 
const Dashboard = () => {

  const [productDetails, setProductDetails] = useState([]);

 const username= localStorage.getItem("username");
 const password = atob(localStorage.getItem("password"));
 const acctId = localStorage.getItem("acctID");
const [nodeNos, setNodeNos] = useState("1");
  
 useEffect(() => {

  localStorage.setItem("modulePath","");
  localStorage.setItem("moduleVersionType","0");
  localStorage.setItem("moduleHeading","Dashboard");	  
  const fetchProductDetails = async () => {
      
    try {
      const response = await fetch(`${TssConf.SERVER_JS_API_URI}/productDetails?acctId=${acctId}&tenantCode=${localStorage.getItem("tenantCode")}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }
      const data = await response.json();
      setProductDetails(data);
      
    } catch (error) {
     // console.log("Error", error);
    }
  };

  fetchProductDetails();
}, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${TssConf.SERVER_JS_API_URI}/online/getNode`);

        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        const data = await response.json();
        const nodeIds = data.map(item => item.nodeId).join(',');
        setNodeNos(nodeIds)

        Log('Online - Node', 'INFO', 'Data fetched successfully : ' + JSON.stringify(data));
      } catch (error) {
        Log('Online -  Node', 'ERROR', 'Error fetching data : ' + error);
      }
    };
    if(TssConf.PRODUCT_ID != '0'){
    //fetchData();
   }
  }, []);


    const handleRedirect = async (Url,productId) => {

        try {
          const response = await fetch(`${TssConf.SERVER_JS_API_URI}/generateToken`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, productId })
          });

          if (!response.ok) {
            throw new Error('Failed to authenticate');
          }
          const data = await response.json();
          const { token } = data;
          // Redirect to the product server with the JWT token
         // console.log(token)
          const productUrl = `${Url}?token=${token}`;
          window.location.href = productUrl;
        } catch (error) {
         // console.error('Error during authentication', error);
        }
      };
const data = {
  labels: [
    'Red',
    'Blue',
    'Yellow'
  ],
  datasets: [{
    label: 'My First Dataset',
    data: [200, 150, 100],
    backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 205, 86)'
    ],
    hoverOffset: 4
  }]
};

  return (
    <div>
      {/* <ContentHeader title="Dashboard" /> */}
      {/* <div className='p-3' style={{justifyContent:'right', alignItems:'right'}}>
        <SelectedModule />        
      </div> */}

{TssConf.PRODUCT_ID != '0' ? (
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <section className="col-lg-7 connectedSortable">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <i className="fas fa-chart-pie mr-1"></i>
                    MDA License Graph
                  </h3>
                </div>
                <div className="card-body">
                 {/* <LastOneMinuteLicense nodeNos={nodeNos} /> */}
                </div>
              </div>
            </section>
          {/*
            <section className="col-lg-5 connectedSortable">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <i className="fas fa-chart-pie mr-1"></i>
                    Clients
                  </h3>
                </div>
                <div className="card-body">
                  <Doughnut data={data} />
                </div>
              </div>
            </section>
        */}
          </div> 
        </div>
      </section>
    ) : (
      <div className="col-12" style={{ textAlign: "center" }}>
        <h5 className="text-muted"> Dashboard is in Progress...</h5>
      </div>
    )}

    </div>
  );
};

export default Dashboard;
