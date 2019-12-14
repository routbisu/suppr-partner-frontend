import React, { useState, useEffect } from 'react';
import Logo from '../../images/logo.svg';
import Ripples from 'react-ripples';
import auth from '../../services/authService';
import { withRouter } from 'react-router-dom';

import './Login.scss';
import { setAuthTokenInLS } from '../../services/commonService';

const Login = ({ history }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (auth.isAuthenticated()) {
      history.push('/');
    }
  }, []);

  const submitForm = async evt => {
    evt.preventDefault();
    const { username, password } = credentials;
    const { status, code, data } = await auth.login(username, password);
    if (status === 'success' && data) {
      const { token, name, restaurantId } = data;
      if (token) {
        auth.setAuth(token, name, restaurantId);
        setAuthTokenInLS(token);
        history.push('/');
      }
    } else {
      if (code === 'INCORRECT_CREDENTIALS') {
        setError('Incorrect username or password.');
      }
    }
  };

  const changeHandler = evt => {
    evt.persist();
    setCredentials(current => {
      const creds = { ...current };
      creds[evt.target.name] = evt.target.value;
      return creds;
    });
  };

  return (
    <div className="login-container">
      <div className="dark-filter"></div>
      <div className="login-form">
        <div className="logo-container">
          <img src={Logo} alt="Suppr Logo" />
        </div>

        <form onSubmit={submitForm}>
          <input type="text" name="username" placeholder="Username" onChange={changeHandler} />
          <input type="password" name="password" placeholder="Password" onChange={changeHandler} />
          {error && <div className="error-message">{error}</div>}
          <Ripples className="mt-1">
            <button type="submit" className="btn-submit">
              Login
            </button>
          </Ripples>
        </form>

        <div className="forgot-password">
          <a href="/">
            <span>Forgot password?</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Login);
