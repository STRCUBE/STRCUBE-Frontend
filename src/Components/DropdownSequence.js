import React, { useState, useEffect } from 'react';

import {CiCircleRemove} from 'react-icons/ci';
const DropdownSequence = ({ options, onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [availableOptions, setAvailableOptions] = useState(options);

  useEffect(() => {
    setAvailableOptions(options.filter(option => !selectedOptions.includes(option)));
  }, [selectedOptions, options]);

  const handleSelectOption = (option) => {
    setSelectedOptions([...selectedOptions, option]);
    onChange([...selectedOptions, option]);
  }

  const handleRemoveOption = (option) => {
    setSelectedOptions(selectedOptions.filter(selectedOption => selectedOption !== option));
    onChange(selectedOptions.filter(selectedOption => selectedOption !== option));
  }

//   const handleAddDropdown = () => {
//     setAvailableOptions(options.filter(option => !selectedOptions.includes(option)));
//   }

  return (
    <div className='mx-auto'>
      {availableOptions.length > 0 && (
        <div className='input-group'>
          <label for="dim" style={{marginRight: "15px", color:"navy"}}>Add Dimension: </label>
          <select id='dm' onChange={(event) => handleSelectOption(event.target.value)} className='form-select'>
            <option value="">Select an option</option>
            {availableOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      )}
      <br/>
      {selectedOptions.map(option => (
        <div key={option} className='my-1'>
          <span>{option}</span>
          {/* <button onClick={() => handleRemoveOption(option)}>Remove</button> */}
          <CiCircleRemove size={15} style={{color:"red", position:"relative", top:"-10px"}} onClick={() => handleRemoveOption(option)}/>
        </div>
      ))}
      
      {/* <button onClick={handleAddDropdown}>Add dropdown</button> */}
    </div>
  );
};

export default DropdownSequence;
