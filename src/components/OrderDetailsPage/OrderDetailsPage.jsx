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

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div>{error}</div>;
  if (!order) return <div>Заказ не найден.</div>;

  const {
    num: orderNum,
    create_date,
    type,
    region,
    ext_num,
    barcode,
    urgency,
    status,
    status_date,
    status_comment,
    weight,
    volume,
    v_weight,
    height,
    length,
    width,
    places,
    courier,
    Client,
    Sender,
    Storage,
    Payments,
    Goods
  } = order;

console.log(order)

  const deliveryTypeMap = {
    '1': 'Склад-Двери',
    '4': 'Самовывоз',
    '5': 'Двери-Склад',
    '6': 'Склад-Склад'
  };

  const statusMap = {
    'registered': 'Подготовлен',
    'planned': 'Планируется доставкой',
    'assigned': 'Назначено на курьера',
    'on_way': 'В пути',
    'on_way_(no_connection)': 'В пути, не дозвонился',
    'on_place_(no_connection)': 'На месте, не дозвонился',
    'delivered': 'Доставлено получателю',
    'canceled': 'Отменен (отказ получателя)',
    'part_delivered': 'Частично доставлено',
    'delivery_date_change': 'Перенесен',
    'customer_cancel': 'Отменен заказчиком'
  };

  return (
    <div className="order-details">
      <h2>Заказ №{orderNum}</h2>

      {/* Основная информация */}
      <section className="section">
        <h3>Основная информация</h3>
        <p><strong>Дата создания:</strong> {new Date(create_date).toLocaleString()}</p>
        <p><strong>Тип доставки:</strong> {deliveryTypeMap[type] || type}</p>
        <p><strong>Регион:</strong> {region}</p>
        <p><strong>Статус:</strong> {statusMap[status] || status}</p>
        <p><strong>Комментарий к статусу:</strong> {status_comment || '-'}</p>
        <p><strong>Дата изменения статуса:</strong> {new Date(status_date).toLocaleString()}</p>
        <p><strong>Вес:</strong> {weight} кг</p>
        <p><strong>Объем:</strong> {volume} м³</p>
        <p><strong>Объемный вес:</strong> {v_weight} кг</p>
        <p><strong>Габариты:</strong> {width}x{height}x{length} м</p>
        <p><strong>Количество мест:</strong> {places}</p>
        <p><strong>Штрихкод:</strong> {barcode}</p>
        <p><strong>Внешний номер:</strong> {ext_num || '-'}</p>
        <p><strong>Срочность:</strong> {urgency}</p>
        <p><strong>Курьер:</strong> {courier || '-'}</p>
      </section>

      {/* Получатель */}
      <section className="section">
        <h3>Получатель</h3>
        {Client ? (
          <>
            <p><strong>Имя:</strong> {Client.name}</p>
            <p><strong>Контакт:</strong> {Client.contact || '-'}</p>
            <p><strong>Телефон:</strong> {Client.phone}</p>
            <p><strong>Адрес:</strong> {Client.address}</p>
            <p><strong>Дата доставки:</strong> {new Date(Client.send_date).toLocaleDateString()}</p>
            <p><strong>Интервал доставки:</strong> с {new Date(Client.send_date_from).toLocaleTimeString()} до {new Date(Client.send_date_to).toLocaleTimeString()}</p>
            <p><strong>Интервал сдачи:</strong> {new Date(Client.order_delivery_interval).toLocaleTimeString()}</p>
            <p><strong>Комментарий:</strong> {Client.comment || '-'}</p>
          </>
        ) : (
          <p>Не указан</p>
        )}
      </section>

      {/* Отправитель */}
      <section className="section">
        <h3>Отправитель</h3>
        {Sender && Object.keys(Sender).some(key => Sender[key]) ? (
          <>
            <p><strong>Имя:</strong> {Sender.name || '-'}</p>
            <p><strong>Контакт:</strong> {Sender.contact || '-'}</p>
            <p><strong>Телефон:</strong> {Sender.phone || '-'}</p>
            <p><strong>Адрес:</strong> {Sender.address || '-'}</p>
          </>
        ) : (
          <p>Не указан</p>
        )}
      </section>

      {/* Склад */}
      <section className="section">
        <h3>Склад</h3>
        {Storage && Object.keys(Storage).some(key => Storage[key]) ? (
          <>
            <p><strong>Наименование:</strong> {Storage.name || '-'}</p>
            <p><strong>Код:</strong> {Storage.code || '-'}</p>
            <p><strong>Адрес:</strong> {Storage.address || '-'}</p>
          </>
        ) : (
          <p>Не указан</p>
        )}
      </section>

      {/* Оплата */}
      <section className="section">
        <h3>Оплата</h3>
        {Payments ? (
          <>
            <p><strong>Сумма наложенного платежа:</strong> {Payments.cod_sum} ₽</p>
            <p><strong>Стоимость доставки:</strong> {Payments.delivery_price} ₽</p>
            <p><strong>Объявленная стоимость:</strong> {Payments.declared_price || 0} ₽</p>
            <p><strong>Предоплачен:</strong> {Payments.prepaid ? 'Да' : 'Нет'}</p>
          </>
        ) : (
          <p>Не указано</p>
        )}
      </section>

      {/* Товар */}
      <section className="section">
        <h3>Товар</h3>
        {Goods && Goods.length > 0 ? (
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
              {Goods.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.sku || '-'}</td>
                  <td>{item.barcode || '-'}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price} ₽</td>
                  <td>{item.quantity * item.price} ₽</td>
                  <td>{item.weight} кг</td>
                  <td>{item.dangerous ? 'Да' : 'Нет'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Товаров нет</p>
        )}
      </section>

    </div>
  );
};

export default OrderDetailsPage;