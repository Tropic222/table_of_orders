import axios from 'axios'
import React, { useEffect, useState } from 'react'

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    const token = localStorage.getItem('authToken');
    const basicAuthToken = localStorage.getItem('basicAuthToken');

    const fromDate = '2000-01-01T00:00:00';
    const toDate = '2025-12-31T23:59:59';

    const url = `/api/tms/hs/es-api/docs/orders`;

    try {
      const response = await axios.get(url, {
        params: {
          from_date: fromDate,
          to_date: toDate,
        },
        headers: {
          Authorization: `Basic ${basicAuthToken}`,
          token: token,
        },
      });

      console.log('Order:', response.data);

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error when receiving orders:', error);
      if (axios.isAxiosError(error) && error.response) {
        setError(`Ошибка: ${error.response.status} - ${error.response.statusText}`);
      } else {
        setError('Ошибка при загрузке заказов');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div>Загрузка заказов...</div>;
  }

  if (error) {
    return <div>{error}</div>;
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
              <strong>Дата:</strong> {order.create_date} <br />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersPage;
