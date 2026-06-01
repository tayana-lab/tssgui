import React ,{useState} from 'react'
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { useDispatch, useSelector } from 'react-redux';

const TssButtonGroup = ({ buttonArray=[],
                          onClick =()=>{}, 
                          activeBtn={}}) => {

                     

  const [activeButton, setActiveButton] = useState(activeBtn.label);
const darkMode = useSelector((state) => state.ui.darkMode);
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName.label);
    onClick(buttonName);
  };

  return (
    <>
    <div className='card tss-btnGroup-bg'    style={{boxShadow: '0 0 1px rgba(230, 230, 250, 0.5), 0 1px 3px rgba(230, 230, 250, 0.3)'}}>
      {buttonArray.length > 0 && (
        <ButtonGroup aria-label="Severity levels" style={{ width: '100%' }}>
          {buttonArray.map(element => (
            <Button className="btn-primary" 
              key={element.label}
              id={activeButton === element.label ? 'actvBtn' : 'inactvBtn'} 
              style={{
                backgroundColor: activeButton === element.label ? '#fff' : 'lavender',
                color: activeButton === element.label ? '#5C3DA4' : '#666',
                fontWeight: activeButton === element.label ? 'bold' : 'normal',
                flex: 1,
                borderColor: 'lavender',
                padding: '6px',
                borderRadius: '8px',
              }}
              onClick={() => handleButtonClick(element)}
            >
              {element.label}
            </Button>
          ))}
        </ButtonGroup>
      )}

    </div> 
    </>
  )
}

export default TssButtonGroup
