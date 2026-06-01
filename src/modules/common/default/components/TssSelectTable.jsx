import React, { useState, useEffect, useRef } from 'react';
import CustomTooltipFeildSet from './CustomToolTipForFeildSet';
import TssIcon from '@modules/common/default/components/TssIcon';

const TssSelectTableBox = () => {

  return (
    <div style={{ position: 'relative' }} className='selectForm'>
      <fieldset className="p-2" id="TSSGUI_SelectFieldLabelStyle">
        <legend className="w-auto" style={{ position: 'relative', zIndex: 1 }}>
          <p className="mb-0" id="TSSGUI_LabelStyles">
            &nbsp;&nbsp;Sample&nbsp;&nbsp;<span className='mandatory'>*</span>
          </p>
        </legend>

        <select className='TSSGUI_SelectOption' style={{ position: "absolute", transform: "translateY(-50%)", marginTop: "-5px", background: "none", border: "none", width: "96%", outline: "none" }}>
          <option >1</option>
          <option >2</option>
          <option >3</option>
          <option >4</option>
        </select>
      </fieldset>

    </div>
  );
};

export default TssSelectTableBox;
