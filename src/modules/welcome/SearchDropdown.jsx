import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchMenu } from '@app/modules/common/default/components/TssDropDownMenus';
import { useDispatch, useSelector } from 'react-redux';
const SearchDropdown = () => {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState("");

  const countries = [
    { name: "Belgium", continent: "Europe" },
    { name: "India", continent: "Asia" },
    { name: "Bolivia", continent: "South America" },
    { name: "Ghana", continent: "Africa" },
    { name: "Japan", continent: "Asia" },
    { name: "Canada", continent: "North America" },
    { name: "New Zealand", continent: "Australasia" },
    { name: "Italy", continent: "Europe" },
    { name: "South Africa", continent: "Africa" },
    { name: "China", continent: "Asia" },
    { name: "Paraguay", continent: "South America" },
    { name: "Usa", continent: "North America" },
    { name: "France", continent: "Europe" },
    { name: "Botswana", continent: "Africa" },
    { name: "Spain", continent: "Europe" },
    { name: "Senegal", continent: "Africa" },
    { name: "Brazil", continent: "South America" },
    { name: "Denmark", continent: "Europe" },
    { name: "Mexico", continent: "North America" },
    { name: "Australia", continent: "Australasia" },
    { name: "Tanzania", continent: "Africa" },
    { name: "Bangladesh", continent: "Asia" },
    { name: "Portugal", continent: "Europe" },
    { name: "Pakistan", continent: "Asia" },
  ];

  const handleChange = (event) => {
    setSearchInput(event.target.value);
  };
const darkMode = useSelector((state) => state.ui.darkMode);

  const filteredCountries = countries.filter((country) => {
    return country.name.toLowerCase().includes(searchInput.toLowerCase());
  });

  const handleIconClick = () => {
    setSearchInput('');
  };

  return (
    <SearchMenu hideArrow>
      <div slot="head" className='nav-link tss-topnav-icons' style={{marginLeft:"15px"}}>
       <div className="icon-container">
        <i className='fas fa-search' />
       </div>
      </div>
      <div slot="body" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <div className='input-color-dark'>
          <div className="input-group p-2">
            <input
              className='form-control form-control-sidebar input-text'
              type="text"
              placeholder={t('Search')}
              aria-label="Search"
              value={searchInput}
              onChange={handleChange}
            />
            <div className="input-group-append" >
              <button
                type="button"
                className= "btn btn-sidebar"
                onClick={handleIconClick}
              >
                <i
className={`fas ${searchInput.length === 0  ? 'fa-search' : 'fa-times'} fa-fw`}
 />
              </button>
            </div>
          </div>

          {filteredCountries.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredCountries.map((country, index) => (
                  <tr key={index} className='dropdown-items'>
                    <td className='pl-3 pt-2 pb-2'>{country.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className='pl-3 pb-2'>{t('No matching options')}</div>
          )}
        </div>
      </div>
    </SearchMenu>
  );
};

export default SearchDropdown;
