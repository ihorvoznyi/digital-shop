import { useEffect, useState } from 'react';

import { userStore } from '../../../../store';
import { getOrders } from '../../../../store/order/services/OrderService';
import { Format } from '../../../../utils';
import { IOrder } from './interfaces/IOrder';

import './Orders.scss';

const Orders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    getOrders(userStore.user.id).then((data) => setOrders(data));
  }, []);

  return (
    <div className='cabinet-orders'>
      <div className='cabinet-orders__container'>
        <h2 className='cabinet-orders__title'>
          Список замовлень
        </h2>

        <div className="cabinet-orders__list">
          {!orders.length
            ? <div>У вас ще не було замовлень</div>
            :
            orders.map((order) => {
              const types = ['pending', 'delivered', 'canceled'];
              const status = types.find((type) => type === order.status);

              return (
                <div className="cabinet-orders__order" key={order.id}>
                  <div className="cabinet-orders__order-header">
                    <div className="cabinet-orders__order-details">
                      <div className="cabinet-orders__order-id">
                        Замовлення
                        <span> #{order.id.slice(0, 8)} </span>
                        від
                        <span> {order.date}</span>
                      </div>
                      <div className={`cabinet-orders__order-status ${status}`} />
                    </div>

                    <div className="cabinet-orders__order-header-total">
                      <p>На суму:</p>
                      <span>{Format.format(order.total)} грн.</span>
                    </div>
                  </div>

                  <div className="cabinet-orders__order-body">
                    <div className="cabinet-orders__order-customer">
                      <div className="cabinet-orders__order-shipping">
                        <div>Доставка: <span>{order.shipping.method}</span></div>
                        <div className="cabinet-orders__order-address">
                          Адреса:
                          <span>
                            {order.shipping.city}, {order.shipping.address}
                          </span>
                        </div>
                      </div>

                      <div className="cabinet-orders__order-contact">
                        <span>Отримувач: </span>
                        <div>
                          <span>{order.contact.name}</span>
                          <span>{order.contact.phoneNumber}</span>
                          <span>{order.contact.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="cabinet-orders__order-products">
                      <h2>Ви замовили:</h2>

                      <div className="cabinet-orders__order-products-list">
                        {order.products.map((product) => (
                          <div className="cabinet-order__order-product">
                            <img src={''} alt={''} />
                            <div className="cabinet-order__order-product-details">
                              <p>{product.name}</p>
                              <span>{Format.format(product.price)} грн.</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          };
        </div>
      </div>
    </div>
  );
};

export default Orders;
