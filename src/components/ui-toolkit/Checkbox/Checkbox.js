import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import './Checkbox.scss';

const Checkbox = ({ onChange, value, defaultValue = false }) => {
  const [checked, setChecked] = useState(defaultValue);

  const clickHandler = () => {
    if (onChange) onChange(!checked);
    if (value === undefined) {
      setChecked(current => !current);
    }
  };

  useEffect(() => {
    setChecked(value);
  }, [value]);

  return (
    <div className="checkbox-container">
      <FontAwesomeIcon icon={checked ? faCheckSquare : faSquare} onClick={clickHandler} />
    </div>
  );
};

export default Checkbox;
