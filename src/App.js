import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.scss';
import Loading from './images/loader.svg';
import Logo from './images/logo.svg';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Layout from './components/Layout/Layout';
import Inventory from './pages/Inventory/Inventory';
import ComingSoon from './pages/ComingSoon/ComingSoon';
import auth from './services/authService';
import { getAuthTokenFromLS, removeAuthTokenFromLS } from './services/commonService';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // Check if token is still valid
      try {
        const authToken = getAuthTokenFromLS();
        if (authToken) {
          const { status, data } = await auth.validateToken(authToken);
          if (status === 'success' && data) {
            const { token, name, restaurantId } = data;
            auth.setAuth(token, name, restaurantId);
          }
        }
      } catch (ex) {
        removeAuthTokenFromLS();
        setLoading(false);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="app-container">
      {loading ? (
        <div className="app-loading">
          <div className="images-section">
            <img src={Logo} className="logo" alt="Suppr Logo" />
            <img src={Loading} className="loader" alt="App loading" />
          </div>
        </div>
      ) : (
        <Router>
          <Switch>
            <Route exact path="/login">
              <Login />
            </Route>
            <Layout>
              <ProtectedRoute exact path="/" component={Dashboard} />
              <ProtectedRoute exact path="/inventory" component={Inventory} />
              <ProtectedRoute exact path="/analytics" component={ComingSoon} />
            </Layout>
          </Switch>
        </Router>
      )}
    </div>
  );
}

export default App;
