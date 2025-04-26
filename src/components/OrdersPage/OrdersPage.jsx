import React, { useEffect, useState } from 'react'
import './OrdersPage.css'

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    const token = localStorage.getItem('authToken');
    const basicAuthToken = localStorage.getItem('basicAuthToken');

    const fromDate = '2024-01-01T00:00:00';
    const toDate = '2024-12-31T23:59:59';

    let url = `/api/tms/hs/es-api/docs/orders?from_date=${encodeURIComponent(fromDate)}&to_date=${encodeURIComponent(toDate)}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${basicAuthToken}`,
          'token': token
        }
      });

      if (!response.ok) {
        throw new Error(`Error order loading: ${response.status}`);
      }

      const data = await response.json();
      // console.log('Order:', data);

      setOrders(data.orders || []); 
      setLoading(false);
    } catch (error) {
      console.error('Error when receiving orders:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU'); 
  };

  if (loading) {
    return <div>Загрузка заказов...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div>
      <h1>Список заказов</h1>

      {orders.length === 0 ? (
        <p>Заказы не найдены.</p>
      ) : (
        <ul>
          {orders.map((order, index) => (
            <li key={index}>
              <strong>№ заказа:</strong> {order.num} <br />
              <strong>Дата:</strong> {formatDate(order.create_date)} <br />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersPage;