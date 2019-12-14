import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import './Switch.scss';

const Switch = ({ onChange, value, defaultValue = false }) => {
  const [open, setOpen] = useState(defaultValue);

  const clickHandler = () => {
    if (onChange) onChange(!open);
    if (value === undefined) {
      setOpen(current => !current);
    }
  };

  useEffect(() => {
    setOpen(value);
  }, [value]);

  return (
    <div className="switch-container">
      <FontAwesomeIcon icon={open ? faToggleOn : faToggleOff} onClick={clickHandler} />
    </div>
  );
};

export default Switch;
