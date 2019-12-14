// Get auth token from localstorage
export const getAuthTokenFromLS = () => {
  if (localStorage) {
    return localStorage.getItem('supprAuth');
  }
};

// set auth token in localstorage
export const setAuthTokenInLS = (token, name) => {
  if (localStorage) {
    localStorage.setItem('supprAuth', token);
    return true;
  }
};

// Remove auth token from localstorage
export const removeAuthTokenFromLS = () => {
  if (localStorage) {
    localStorage.removeItem('supprAuth');
    return true;
  }
};

// Generate customer order number
export const generateCustomerOrderNumber = (tableCode, orderId) => {
  if (tableCode && orderId) {
    return `${tableCode}-${orderId.slice(orderId.length - 6)}`;
  }
};
