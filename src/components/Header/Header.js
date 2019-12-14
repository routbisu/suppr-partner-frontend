import React, { useState, useEffect } from 'react';
import Logo from '../../images/logo.svg';
import Icon from '../../images/logo-icon.png';
import './Header.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import auth from '../../services/authService';
import Switch from '../ui-toolkit/Switch/Switch';
import { getOrderingStatus, changeOrderingStatus } from '../../services/restaurantService';

const Header = ({ toggleMenuOpen }) => {
  const restaurantName = auth.getRestaurantName();
  const [orderingOpen, setOrderingOpen] = useState();

  useEffect(() => {
    (async () => {
      const { data } = await getOrderingStatus();
      setOrderingOpen(data === true);
    })();
  }, []);

  const toggleOrderingStatus = async () => {
    const newStatus = orderingOpen ? 'closed' : 'open';
    const { data, status } = await changeOrderingStatus(newStatus);
    if (status === 'success' && data) {
      const { orderingOpen } = data;
      console.log('orderingOpen', orderingOpen);
      setOrderingOpen(orderingOpen);
    }
  };

  return (
    <div className="header-container">
      <div className="logo-container">
        <span onClick={toggleMenuOpen}>
          <FontAwesomeIcon icon={faBars} />
        </span>
        <img src={Logo} alt="Suppr Logo" className="desktop-only" />
        <img src={Icon} alt="Suppr Logo" className="mobile-only" />

        <span className="ordering-switch-holder restaurant-open">
          <Switch onChange={toggleOrderingStatus} value={orderingOpen} />
        </span>

        {restaurantName && (
          <span className="restaurant-name restaurant-open desktop-only">{restaurantName}</span>
        )}
      </div>
      <div className="right-section">
        <FontAwesomeIcon
          icon={faSignOutAlt}
          onClick={() => {
            auth.logout(() => {
              window.location = '/login';
            });
          }}
        />
      </div>
    </div>
  );
};

export default Header;
