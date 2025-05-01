import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchOrderById } from '../../api/api'
import './OrderDetailsPage.css'

const OrderDetailsPage = () => {
  const { num } = useParams(); 
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const basicAuthToken = localStorage.getItem('basicAuthToken');

    const loadOrder = async () => {
      try {
        const data = await fetchOrderById(token, basicAuthToken, num);
        setOrder(data);
      } catch (err) {
        setError('Error loading order data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [num]);

  if (loading) return (
		<div className="loading-container">
			<div className="loading-text">Загрузка...</div>
		</div>
	);
  if (error) return <div>{error}</div>;
  if (!order) return <div>Заказ не найден.</div>;
	
  return (
    <div className="order-details">
      <h2>Заказ №{order.num}</h2> 
    </div>
  );
};

export default OrderDetailsPage;