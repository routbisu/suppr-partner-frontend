import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import LeftNav from '../LeftNav/LeftNav';
import { withRouter } from 'react-router-dom';
import { navItems } from '../LeftNav/LeftNav';
import './Layout.scss';

const Layout = ({ children, location }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenuOpen = () => {
    setMenuOpen(current => !current);
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="layout-container">
      <Header toggleMenuOpen={toggleMenuOpen} />
      <LeftNav menuOpen={menuOpen} />
      <div className={`page-name ${menuOpen && 'page-name-open'}`}>
        {navItems.find(item => item.path === location.pathname).label}
      </div>
      <div
        className={`layout-children-container ${menuOpen ? 'menu-open-view' : 'menu-close-view'}`}
      >
        {children}
      </div>
    </div>
  );
};

export default withRouter(Layout);
