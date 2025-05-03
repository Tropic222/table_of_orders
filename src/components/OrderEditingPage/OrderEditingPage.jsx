import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchOrderById, updateOrder } from '../../api/api'
import './OrderEditingPage.css'

const OrderEditingPage = () => {
  const { num } = useParams(); // Получаем номер заказа из URL
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const deliveryTypes = [
    { value: '1', label: 'Склад-Двери' },
    { value: '4', label: 'Самовывоз' },
    { value: '5', label: 'Двери-Склад' },
    { value: '6', label: 'Склад-Склад' },
    { value: '11', label: 'Двери-Двери (Межгород)' }
  ];

  const regions = [
    { value: 'msk', label: 'Москва' },
    { value: 'spb', label: 'Санкт-Петербург' },
    { value: 'nn', label: 'Нижний Новгород' },
    { value: 'kzn', label: 'Казань' },
    { value: 'sam', label: 'Самара' },
    { value: 'vrn', label: 'Воронеж' }
  ];

  

  // Загрузка данных
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const basicAuthToken = localStorage.getItem('basicAuthToken');

    const loadOrder = async () => {
      try {
        const data = await fetchOrderById(token, basicAuthToken, num);
        setOrder(data);
      } catch (err) {
        setError('Ошибка загрузки данных заказа');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [num]);

  // Обработчики изменений
  const handleChange = (e, field) => {
    const { value } = e.target;
    setOrder((prev) => ({ ...prev, [field]: value }));
  };

  const handleClientChange = (e, field) => {
    const { value } = e.target;
    setOrder((prev) => ({
      ...prev,
      Client: {
        ...prev.Client,
        [field]: value
      }
    }));
  };

  const handleSenderChange = (e, field) => {
    const { value } = e.target;
    setOrder((prev) => ({
      ...prev,
      Sender: {
        ...prev.Sender,
        [field]: value
      }
    }));
  };

  const handlePaymentChange = (e, field) => {
    const { value } = e.target;
    setOrder((prev) => ({
      ...prev,
      Payments: {
        ...prev.Payments,
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const handleStorageChange = (e) => {
    const { value } = e.target;
    setOrder((prev) => ({
      ...prev,
      Storage: {
        ...prev.Storage,
        code: value
      }
    }));
  };

  const handleGoodsChange = (e, index, field) => {
    const { value } = e.target;
    const updatedGoods = [...order.Goods];

    if (field === 'quantity' || field === 'price') {
      updatedGoods[index][field] = parseInt(value) || 0;
      updatedGoods[index].cod = updatedGoods[index].quantity * updatedGoods[index].price;
    } else if (field === 'dangerous') {
      updatedGoods[index].dangerous = e.target.checked;
    } else {
      updatedGoods[index][field] = value;
    }

    setOrder((prev) => ({ ...prev, Goods: updatedGoods }));
  };

;

  const validateForm = () => {
    if (!order.type || !order.region || !order.weight) {
      alert('Заполните обязательные поля: тип, регион, вес');
      return false;
    }
    if (!order.Client?.name || !order.Client.phone || !order.Client.address) {
      alert('Укажите имя, телефон и адрес получателя');
      return false;
    }
    if (!order.Payments?.cod_sum || !order.Payments?.delivery_price) {
      alert('Укажите сумму наложенного платежа и стоимость доставки');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    const token = localStorage.getItem('authToken');
    const basicAuthToken = localStorage.getItem('basicAuthToken');

    try {
      const response = await updateOrder(token, basicAuthToken, order);
      alert(`Заказ ${response.num} успешно сохранён`);
      navigate(`/orders/${response.num}/view`);
    } catch (err) {
      setError(`Ошибка при сохранении: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const toHHMM = (isoDateTime) => {
    if (!isoDateTime) return '';
    const date = new Date(isoDateTime);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const toDateInput = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toISOString().split('T')[0]; 
  };

  const toDateTimeLocal = (isoString) => {
    if (!isoString) return '';
    
    const date = new Date(isoString);
  
    // Проверка на валидность даты
    if (isNaN(date.getTime())) return '';
  
    const year = String(date.getFullYear()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  if (loading)
    return (
      <div className="loading">Загрузка...</div>
    );
  if (error) return <div>{error}</div>;
  if (!order) return <div>Заказ не найден</div>;

  const client = order.Client || {};
  const sender = order.Sender || {};
  const payments = order.Payments || {};
  const storage = order.Storage || {};
  const goods = order.Goods || [];
  

  
  const sendDate = toDateInput(client.send_date); 
  const pickupDate = toDateInput(sender.pickup_date);
  const sendDateFrom = toDateTimeLocal(client.send_date_from); 
  const sendDateTo = toDateTimeLocal(client.send_date_to);
  const pickupDateFrom = toDateTimeLocal(sender.pickup_date_from);
  const pickupDateTo = toDateTimeLocal(sender.pickup_date_to);

  const deliveryIntervalTime = toHHMM(client.order_delivery_interval);

  return (
    <div className="order-details">
      <h2>Редактирование заказа №{order.num}</h2>

      {/* Основные данные */}
      <section className="section">
        <h3>Основные данные</h3>
        <label>
          Тип доставки:
          <select value={order.type} onChange={(e) => handleChange(e, 'type')}>
            {deliveryTypes.map((dt) => (
              <option key={dt.value} value={dt.value}>
                {dt.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Регион:
          <select value={order.region} onChange={(e) => handleChange(e, 'region')}>
            {regions.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Вес (кг):
          <input type="number" value={order.weight || ''} onChange={(e) => handleChange(e, 'weight')} />
        </label>

        <label>
          Количество мест:
          <input type="number" value={order.places || ''} onChange={(e) => handleChange(e, 'places')} />
        </label>

      

        <label>
          Штрихкод:
          <input type="text" value={order.barcode || ''} onChange={(e) => handleChange(e, 'barcode')} />
        </label>
      </section>

      {/* Получатель */}
      <section className="section">
        <h3>Получатель</h3>
        <label>
          Имя:
          <input type="text" value={client.name || ''} onChange={(e) => handleClientChange(e, 'name')} />
        </label>

        <label>
          Телефон:
          <input type="text" value={client.phone || ''} onChange={(e) => handleClientChange(e, 'phone')} />
        </label>

        <label>
          Адрес:
          <input type="text" value={client.address || ''} onChange={(e) => handleClientChange(e, 'address')} />
        </label>

        <label>
          Дата доставки:
          <input
            type="date"
            value={sendDate}
            onChange={(e) => handleClientChange(e, 'send_date')}
          />
        </label>

        <label>
          Интервал доставки с:
          <input
            type="datetime-local"
            value={sendDateFrom}
            onChange={(e) => handleClientChange(e, 'send_date_from')}
          />
        </label>

        <label>
          Интервал доставки по:
          <input
            type="datetime-local"
            value={sendDateTo}
            onChange={(e) => handleClientChange(e, 'send_date_to')}
          />
        </label>

        <label>
          Интервал сдачи:
          <input
            type="time"
            value={deliveryIntervalTime}
            onChange={(e) => handleClientChange(e, 'order_delivery_interval')}
          />
        </label>

        <label>
          Комментарий:
          <input type="text" value={client.comment || ''} onChange={(e) => handleClientChange(e, 'comment')} />
        </label>
      </section>

      {/* Отправитель */}
      <section className="section">
        <h3>Отправитель</h3>
        <label>
          Имя:
          <input type="text" value={sender.name || ''} onChange={(e) => handleSenderChange(e, 'name')} />
        </label>

        <label>
          Телефон:
          <input type="text" value={sender.phone || ''} onChange={(e) => handleSenderChange(e, 'phone')} />
        </label>

        <label>
          Адрес:
          <input type="text" value={sender.address || ''} onChange={(e) => handleSenderChange(e, 'address')} />
        </label>

        <label>
          Дата забирания:
          <input
            type="date"
            value={pickupDate}
            onChange={(e) => handleSenderChange(e, 'pickup_date')}
          />
        </label>

        <label>
          Интервал забирания с:
          <input
            type="datetime-local"
            value={pickupDateFrom}
            onChange={(e) => handleSenderChange(e, 'pickup_date_from')}
          />
        </label>

        <label>
          Интервал забирания по:
          <input
            type="datetime-local"
            value={pickupDateTo}
            onChange={(e) => handleSenderChange(e, 'pickup_date_to')}
          />
        </label>
      </section>

      {/* Платежи */}
      <section className="section">
        <h3>Оплата</h3>
        <label>
          Сумма наложенного платежа:
          <input
            type="number"
            value={payments.cod_sum || ''}
            onChange={(e) => handlePaymentChange(e, 'cod_sum')}
          />
        </label>

        <label>
          Стоимость доставки:
          <input
            type="number"
            value={payments.delivery_price || ''}
            onChange={(e) => handlePaymentChange(e, 'delivery_price')}
          />
        </label>

        <label>
          Предоплачен:
          <input
            type="checkbox"
            checked={!!payments.prepaid}
            onChange={(e) =>
              setOrder({
                ...order,
                Payments: {
                  ...payments,
                  prepaid: e.target.checked
                }
              })
            }
          />
        </label>
      </section>

      {/* Склад (для Самовывоза) */}
      {order.type === '4' && (
        <section className="section">
          <h3>Склад</h3>
          <label>
            Код склада:
            <input
              type="text"
              value={storage.code || ''}
              onChange={handleStorageChange}
            />
          </label>
        </section>
      )}

      {/* Товары */}
      <section className="section">
        <h3>Товары</h3>
        {goods.length > 0 ? (
          <table className="goods-table">
            <thead>
              <tr>
                <th>Наименование</th>
                <th>Артикул</th>
                <th>Штрихкод</th>
                <th>Кол-во</th>
                <th>Цена</th>
                <th>Сумма</th>
                <th>Вес</th>
                <th>Опасный?</th>
              </tr>
            </thead>
            <tbody>
              {goods.map((item, index) => (
                <tr key={index}>
                  <td><input type="text" value={item.name} onChange={(e) => handleGoodsChange(e, index, 'name')} /></td>
                  <td><input type="text" value={item.sku || ''} onChange={(e) => handleGoodsChange(e, index, 'sku')} /></td>
                  <td><input type="text" value={item.barcode || ''} onChange={(e) => handleGoodsChange(e, index, 'barcode')} /></td>
                  <td><input type="number" value={item.quantity || ''} onChange={(e) => handleGoodsChange(e, index, 'quantity')} /></td>
                  <td><input type="number" value={item.price || ''} onChange={(e) => handleGoodsChange(e, index, 'price')} /></td>
                  <td>{(item.quantity * item.price).toFixed(2)} ₽</td>
                  <td><input type="number" value={item.weight || ''} onChange={(e) => handleGoodsChange(e, index, 'weight')} /></td>
                  <td>
                    <input
                      type="checkbox"
                      checked={!!item.dangerous}
                      onChange={(e) => handleGoodsChange(e, index, 'dangerous')}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Нет товаров</p>
        )}
      </section>

      {/* Управление */}
      <div className="action-buttons">
        <button
          onClick={() => navigate(-1)}
          className="action-button back-button"
          disabled={saving}
          type="button"
        >
          Отмена
        </button>

        <button
          onClick={handleSave}
          className="action-button edit-button"
          disabled={saving}
          type="button"
        >
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
};

export default OrderEditingPage;