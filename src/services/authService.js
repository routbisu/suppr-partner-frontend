import axios from 'axios';
import { apiDetails } from '../config';
import { removeAuthTokenFromLS } from './commonService';
const { baseUrl } = apiDetails;

class Auth {
  authenticated = '';
  restaurantId = '';
  restaurantName = '';

  login = async (username, password) => {
    const url = `${baseUrl}/login`;
    const { data } = await axios.post(url, { username, password });
    return data;
  };

  validateToken = async token => {
    const url = `${baseUrl}/auth`;
    const { data } = await axios.get(url, {
      headers: { Authorization: 'Bearer ' + token }
    });
    return data;
  };

  setAuth(token, name, restaurantId) {
    this.authenticated = token;
    this.restaurantId = restaurantId;
    this.restaurantName = name;
  }

  logout(cb) {
    this.authenticated = false;
    removeAuthTokenFromLS();
    cb();
  }

  getAuthToken() {
    return this.authenticated;
  }

  getRestaurantName() {
    return this.restaurantName;
  }

  getRestaurantId() {
    return this.restaurantId;
  }

  isAuthenticated() {
    return !!this.authenticated;
  }
}

export default new Auth();
