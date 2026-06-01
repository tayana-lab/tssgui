import React,{useState,useEffect} from 'react';
import { faBox } from '@fortawesome/free-solid-svg-icons';
import TssIcon from '@app/modules/common/default/components/TssIcon';
import TssConf from "@app/modules/conf/TssGui.json";
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const ProductsDropdown=()=>{

  const [t]= useTranslation();
  const [productDetails, setProductDetails] = useState([]);
  const darkMode = useSelector((state) => state.ui.darkMode);
  const username= localStorage.getItem("username");
  const password = atob(localStorage.getItem("password"));
  const acctId = localStorage.getItem("acctID");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
   
    
    const fetchProductDetails = async () => {
      
      try {
        const response = await fetch(`${TssConf.SERVER_JS_API_URI}/productDetails?acctId=${acctId}&tenantCode=${localStorage.getItem("tenantCode")} `);
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        const data = await response.json();
        setProductDetails(data);
        
      } catch (error) {
    
      }
    };

    fetchProductDetails();
  }, []);
    
    const handleRedirect = async (Url,productId) => {

   var productUrl="";

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
        
      if (productId == 70 || productId == 90) {
          productUrl = `${Url}`;
         window.open(productUrl, '_blank');
      }else{
	 productUrl = `${Url}?token=${token}`;     
         window.location.href = productUrl;
      }

	} catch (error) {
       }
      };

const desiredOrder = [0,50, 10, 20, 60, 70, 80,90,100];

return (

 <li>
      <div
        className="dropdown"
        style={{ position: 'relative' }} 
        onMouseEnter={() => setIsHovered(true)}  
        onMouseLeave={() => setIsHovered(false)} 
      >
        <a slot="head" 
          style={{ fontWeight: 'normal', cursor: 'pointer' }} 
          title="Hover to view products"
        >
          <div className="mt-2">
            <TssIcon iconKey="tss_productDropdown" title={t('topnavi.title.product')} />
          </div>
        </a>

        {/* Dropdown menu: show/hide based on isHovered */}
        <div
          className="dropdown-menu dropdown-menu-right"
          style={{
            position: "absolute",
            top: "20px",
            right: "-4px",
            left: "auto",
            minWidth: "285px",
            background: "linear-gradient(180deg, #FFFFFF 0%, #DFE8F9 100%)",
            boxShadow: "0px 0px 4px 0px #00000040",
            //borderRadius: "15px",
            padding: "10px",
            display: isHovered ? "block" : "none", 
            zIndex: 9999,
          }}
        >
          <div
            className="fw-bold text-center"
            style={{
              fontSize: "1rem",
              color: "#3C5A94",
              paddingBottom: "5px",
              borderBottom: "2px solid #3C5A94",
            }}
          >
            Products
          </div>

          <div
            className="d-flex flex-wrap text-center"
            style={{
              marginTop: "10px",
            }}
          >
            {productDetails
              .filter(product => product.product_id !== TssConf.PRODUCT_ID)
              .map((product, index, array) => {
                const isLastRow = index >= array.length - (array.length % 2 || 2);
                 const isDisabled = product.status == 0;
                return (
                  <div
                    key={product.product_id}
                    className="w-50 p-2"
                    onClick={() => handleRedirect(product.product_url, product.product_id)}
                    style={{
                         borderRight: index % 2 === 0 ? "0.1px solid #3c5a942e" : "none",
                         borderBottom: isLastRow ? "none" : "0.1px solid #3c5a942e",
                         cursor: isDisabled ? "not-allowed" : "pointer",
                         opacity: isDisabled ? 0.5 : 1, // <-- gray out disabled ones
                         pointerEvents: isDisabled ? "none" : "auto", // <-- prevent click

                     }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#cce4ff'} 
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'} 
                  >
                    <img src={product.logo} alt={product.alias} style={{ width: "40px", height: "40px" }} />
                    <p className="mb-0" style={{ fontWeight: "bold", color: "#3C5A94" }}>
                      {product.alias}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </li>

)

}

export default ProductsDropdown; 
