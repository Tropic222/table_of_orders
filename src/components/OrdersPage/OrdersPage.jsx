import React, { useEffect, useState } from 'react'
import { fetchOrders } from '../../api/api.jsx'
import './OrdersPage.css'

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fromDate, setFromDate] = useState('2024-01-01');
  const [toDate, setToDate] = useState('2024-12-31');

  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const handleFromDateChange = (e) => setFromDate(e.target.value);
  const handleToDateChange = (e) => setToDate(e.target.value);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
      const basicAuthToken = localStorage.getItem('basicAuthToken');

      try {
        const ordersData = await fetchOrders(token, basicAuthToken, fromDate, toDate);
        setOrders(ordersData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fromDate, toDate]);

  if (loading) return <div className="loading">Загрузка заказов...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="orders-page">
      <h1>Список заказов</h1>

      
      <div className="filter">
        <label>
          с:
           <input
            type="date"
            value={fromDate}
            onChange={handleFromDateChange}
          />
        </label>
        <label>
          по:
          <input
            type="date"
            value={toDate}
            onChange={handleToDateChange}
          />
        </label>
        
      </div>

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
