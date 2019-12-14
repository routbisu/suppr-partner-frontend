import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronUp,
  faChevronDown,
  faPlusCircle,
  faMinusCircle
} from '@fortawesome/free-solid-svg-icons';
import OrderCard from '../../components/OrderCard/OrderCard';
import Loader from '../../images/loader.svg';
import Equalizer from 'react-equalizer';

const OrderGroups = ({
  orderType,
  orders,
  changeOrderStatus,
  faIcon,
  lastNDays,
  changeNDays,
  loading,
  defaultVisibilty = true
}) => {
  const [visible, setVisible] = useState(defaultVisibilty);

  const toggleVisibility = () => {
    setVisible(current => !current);
  };

  return (
    <>
      <h2 onClick={toggleVisibility}>
        <FontAwesomeIcon icon={faIcon} />
        {orderType} Orders{' '}
        {orders && orders.length === 0 && <span className="num-orders">{orders.length}</span>}
        {orders && orders.length > 0 && (
          <div className="right-section">
            <FontAwesomeIcon className="chevron" icon={visible ? faChevronUp : faChevronDown} />
          </div>
        )}
      </h2>

      {lastNDays && (
        <div className="day-chooser">
          <span className="label">Last </span>
          <span className="buttons">
            {lastNDays > 1 && (
              <FontAwesomeIcon icon={faMinusCircle} onClick={() => changeNDays(lastNDays - 1)} />
            )}{' '}
            {lastNDays}{' '}
            <FontAwesomeIcon icon={faPlusCircle} onClick={() => changeNDays(lastNDays + 1)} />{' '}
          </span>
          <span className="label"> day{lastNDays > 1 && 's'}</span>
        </div>
      )}

      {orders && orders.length > 0 ? (
        visible && (
          <div className="order-cards animated fadeIn">
            <Equalizer>
              {orders.map(orderDetails => (
                <div className="order-card-holder" key={orderDetails._id}>
                  <OrderCard orderDetails={orderDetails} changeStatus={changeOrderStatus} />
                </div>
              ))}
            </Equalizer>
          </div>
        )
      ) : loading ? (
        <div style={{ textAlign: 'center' }}>
          <img src={Loader} alt="Loading" />
        </div>
      ) : (
        <div className="error-message" style={{ marginBottom: 10 }}>
          No {orderType} Orders
        </div>
      )}
    </>
  );
};

export default OrderGroups;
