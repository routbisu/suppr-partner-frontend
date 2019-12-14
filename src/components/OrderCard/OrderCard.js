import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faTimesCircle,
  faUtensils,
  faCheck,
  faFire,
  faUser,
  faRupeeSign,
  faUtensilSpoon
} from '@fortawesome/free-solid-svg-icons';
import './OrderCard.scss';
import { orderStatus } from '../../config/appConfig';
import { generateCustomerOrderNumber } from '../../services/commonService';
import Moment from 'react-moment';

const OrderCard = ({ orderDetails, changeStatus }) => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(null);
  const [amountError, setAmountError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const clickHandler = status => {
    setLoading(true);
    changeStatus(orderDetails, status);
    setLoading(false);
  };

  const generateBill = () => {
    // Develop logic for billing
    if (amount) {
      changeStatus(orderDetails, orderStatus.BILLED, amount);
    } else {
      setAmountError('Please enter the bill amount!');
    }
  };

  const amountChangeHandler = evt => {
    setAmount(evt.target.value);
  };

  const rejectOrder = () => {
    setShowConfirmation(true);
  };

  const getButtons = status => {
    switch (status) {
      case orderStatus.NEW:
        return (
          <>
            <button className="btn-accept" onClick={() => clickHandler(orderStatus.ACCEPTED)}>
              <FontAwesomeIcon icon={faCheckCircle} /> {loading ? 'Loading' : 'Accept'}
            </button>
            <button className="btn-reject" onClick={rejectOrder}>
              <FontAwesomeIcon icon={faTimesCircle} /> Reject
            </button>
          </>
        );

      case orderStatus.ACCEPTED:
        return (
          <>
            <div className="order-message">
              <FontAwesomeIcon icon={faCheck} /> Accepted
            </div>
            <button className="btn-prepare" onClick={() => clickHandler(orderStatus.PREPARING)}>
              <FontAwesomeIcon icon={faFire} />
              {loading ? 'Loading' : 'Prepare'}
            </button>
          </>
        );

      case orderStatus.PREPARING:
        return (
          <>
            <div className="order-message">
              <FontAwesomeIcon icon={faUtensils} /> Preparing
            </div>
            <button className="btn-serve" onClick={() => clickHandler(orderStatus.SERVING)}>
              <FontAwesomeIcon icon={faUser} />
              {loading ? 'Loading' : 'Serve'}
            </button>
          </>
        );

      case orderStatus.SERVING:
        return (
          <button
            className="btn-bill"
            style={{ width: '100%' }}
            onClick={() => clickHandler(orderStatus.DINING)}
          >
            <FontAwesomeIcon icon={faUtensilSpoon} />
            {loading ? 'Loading' : 'Complete Serving'}
          </button>
        );
      case orderStatus.DINING:
      case orderStatus.BILL_REQUESTED:
        return (
          <>
            <div
              className={`bill-amount-holder ${amountError && 'error'}`}
              style={{ width: '40%' }}
            >
              <input type="number" placeholder="Amount" onChange={amountChangeHandler} />
            </div>
            <button className="btn-bill" style={{ width: '60%' }} onClick={generateBill}>
              <FontAwesomeIcon icon={faRupeeSign} />
              {loading ? 'Loading' : 'Generate Bill'}
            </button>
          </>
        );

      case orderStatus.BILLED:
        return (
          <button className="btn-complete" onClick={() => clickHandler(orderStatus.COMPLETED)}>
            {loading ? 'Loading' : 'Complete Order'}
          </button>
        );

      default:
        return null;
    }
  };

  const getCustomizations = customization => {
    const addOnCodes = customization && Object.keys(customization);

    return (
      addOnCodes &&
      addOnCodes.length && (
        <div className="customization">
          {addOnCodes.map((addOnCode, i) => {
            const addOnDetails = customization[addOnCode];
            return (
              <div className="addon-container" key={i}>
                +{' '}
                {addOnDetails.map(({ code, name }, j) => (
                  <span key={j}>
                    {name}
                    {i < addOnDetails.length - 1 && ', '}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      )
    );
  };

  useEffect(() => {
    setLoading(false);
  }, [orderDetails]);

  if (orderDetails) {
    const {
      chefNotes,
      items,
      status,
      tableCode,
      orderTime,
      internalTableNumber,
      _id
    } = orderDetails;

    return (
      <div
        className={`order-card ${(status === orderStatus.REJECTED ||
          status === orderStatus.COMPLETED) &&
          'order-card-no-buttons'}`}
      >
        <div className="card-header">
          <FontAwesomeIcon
            icon={faUtensils}
            className="fa-table"
            onClick={() => clickHandler(orderStatus.REJECTED)}
          />
          Table {internalTableNumber}
          <FontAwesomeIcon icon={faTimesCircle} className="fa-close" onClick={rejectOrder} />
        </div>

        {showConfirmation && (
          <div className="confirm">
            <span>Reject order?</span>
            <div className="btn-section">
              <button className="yes" onClick={() => clickHandler(orderStatus.REJECTED)}>
                Yes
              </button>
              <button className="no" onClick={() => setShowConfirmation(false)}>
                No
              </button>
            </div>
            <div className="clearfix"></div>
          </div>
        )}

        {status === orderStatus.BILL_REQUESTED && (
          <div className="confirm">
            <span>Customer has requested billing.</span>
          </div>
        )}

        {amountError && (
          <div className="confirm">
            <span>{amountError}</span>
          </div>
        )}

        <div className="card-sub-header">
          <span className="order-number"># {generateCustomerOrderNumber(tableCode, _id)}</span>
          <span className="order-time">
            <Moment format="DD-MMM-YY &bull; hh:mm A">{orderTime}</Moment>
          </span>
        </div>
        <div className="items-section">
          {items &&
            items.map(({ quantity, itemCode, name, customization }, i) => (
              <div className="item-details" key={i}>
                <span className="quantity">{quantity}</span> {name}
                {customization && getCustomizations(customization)}
              </div>
            ))}
        </div>
        {chefNotes && <div className="notes">{chefNotes}</div>}
        <div className="card-footer">{getButtons(status)}</div>
      </div>
    );
  } else {
    return null;
  }
};

OrderCard.propTypes = {
  orderDetails: PropTypes.any.isRequired,
  changeStatus: PropTypes.func
};

export default OrderCard;
