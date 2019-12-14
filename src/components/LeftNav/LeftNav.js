import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faTruckMoving, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Link, withRouter } from 'react-router-dom';
import './LeftNav.scss';

export const navItems = [
  { path: '/', icon: faUtensils, label: 'Orders' },
  { path: '/inventory', icon: faTruckMoving, label: 'Inventory' },
  { path: '/analytics', icon: faChartLine, label: 'Analytics' }
];

const LeftNav = ({ menuOpen, location: { pathname } }) => {
  return (
    <div className="left-nav-container">
      <ul className={menuOpen ? 'menu-open' : 'menu-closed'}>
        {navItems.map(({ path, icon, label, disabled }) => (
          <Link to={path} key={path}>
            <li className={path === pathname ? 'active' : ''}>
              <div className="menu-item-content">
                <FontAwesomeIcon icon={icon} />
                <span>{label}</span>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default withRouter(LeftNav);
