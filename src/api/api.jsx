import axios from 'axios'

// base url
const api = axios.create({
  baseURL: '/api/tms/hs/es-api', 
  headers: {
    'Content-Type': 'application/json',
  }
});

//auth LoginForm
export const login = async(userName, password) => {
	const authString = `${userName}:${password}`; 
  const basicAuthToken = btoa(authString);  // conversion to base64

	const requestBody = { login: userName, password };

  try {
    const response = await api.post('auth', requestBody, {
      headers: {
        Authorization: `Basic ${basicAuthToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Login failed: ${error.message}`);
  }
};

// get orders OrdersPage
export const fetchOrders = async (token, basicAuthToken, fromDate, toDate) => {
  const url = `docs/orders?from_date=${encodeURIComponent(fromDate)}&to_date=${encodeURIComponent(toDate)}`;
  
  try {
    const response = await api.get(url, {
      headers: {
        Authorization: `Basic ${basicAuthToken}`,
        token,
      },
    });
    return response.data.orders || [];
  } catch (error) {
    throw new Error(`Error loading orders: ${error.message}`);
  }
};