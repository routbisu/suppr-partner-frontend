import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
// import io from 'socket.io-client';
import { apiDetails, pollingDuration } from '../../config';
import './Dashboard.scss';
import OrderCard from '../../components/OrderCard/OrderCard';
import {
  faCheck,
  faCheckCircle,
  faTimesCircle,
  faRupeeSign,
  faSyncAlt
} from '@fortawesome/free-solid-svg-icons';
import { orderStatus } from '../../config/appConfig';
import {
  getCurrentOrders,
  updateOrderStatus,
  getArchivedOrders
} from '../../services/orderService';
// import auth from '../../services/authService';
import OrderGroups from './OrderGroups';
import Checkbox from '../../components/ui-toolkit/Checkbox/Checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Dashboard = () => {
  const { baseUrl } = apiDetails;
  const [newOrders, setNewOrders] = useState(null);
  const [btnRefreshLoading, setBtnRefreshLoading] = useState(false);
  const [currentOrders, setCurrentOrders] = useState(null);
  const [billedOrders, setBilledOrders] = useState(null);
  const [completedOrders, setCompletedOrders] = useState(null);
  const [rejectedOrders, setRejectedOrders] = useState(null);

  const [showArchivedOrders, setShowArchivedOrders] = useState({
    [orderStatus.COMPLETED]: true,
    [orderStatus.REJECTED]: false
  });
  const [archivedOrdersLoading, setArchivedOrdersLoading] = useState({
    [orderStatus.COMPLETED]: false,
    [orderStatus.REJECTED]: false
  });
  const [archivedOrdersDays, setArchivedOrdersDays] = useState({
    [orderStatus.COMPLETED]: 1,
    [orderStatus.REJECTED]: 1
  });

  const refreshOrders = async () => {
    const { data, status } = await getCurrentOrders();
    if (status === 'success' && data && data.length) {
      const newOrders = data.filter(order => order.status === orderStatus.NEW);
      const currentOrders = data.filter(
        order => order.status !== orderStatus.NEW && order.status !== orderStatus.BILLED
      );
      const billedOrders = data.filter(order => order.status === orderStatus.BILLED);
      setNewOrders(newOrders);
      setCurrentOrders(currentOrders);
      setBilledOrders(billedOrders);
    } else {
      setNewOrders(null);
      setCurrentOrders(null);
      setBilledOrders(null);
    }
  };

  const setLoading = (ordStatus, status) => {
    setArchivedOrdersLoading(current => {
      const curr = { ...current };
      curr[ordStatus] = status;
      return curr;
    });
  };

  const refreshArchivedOrders = async (ordStatus, days) => {
    setLoading(ordStatus, true);
    const { data, status } = await getArchivedOrders(ordStatus, days);
    if (status === 'success' && data && data.length) {
      if (ordStatus === orderStatus.COMPLETED) {
        setCompletedOrders(data);
      }
      if (ordStatus === orderStatus.REJECTED) {
        setRejectedOrders(data);
      }
    } else {
      if (ordStatus === orderStatus.COMPLETED) {
        setCompletedOrders(null);
      }
      if (ordStatus === orderStatus.REJECTED) {
        setRejectedOrders(null);
      }
    }
    setLoading(ordStatus, false);
  };

  const refreshCompletedOrders = days => {
    refreshArchivedOrders(orderStatus.COMPLETED, days || archivedOrdersDays[orderStatus.COMPLETED]);
  };

  const refreshRejectedOrders = days => {
    refreshArchivedOrders(orderStatus.REJECTED, days || archivedOrdersDays[orderStatus.REJECTED]);
  };

  ////// TEMP FIX for socket - start
  const pollForOrderRefresh = async () => {
    const subscribe = async () => {
      await refreshOrders();
      setTimeout(() => {
        subscribe();
      }, pollingDuration);
    };
    subscribe();
  };
  ////// TEMP FIX for socket - End

  useEffect(() => {
    refreshOrders();
    refreshCompletedOrders();
    refreshRejectedOrders();

    pollForOrderRefresh();

    // let socket = io.connect(
    //   baseUrl,
    //   { transports: ['websocket'], upgrade: false },
    //   { 'force new connection': true }
    // );

    // socket.emit('login', { authToken: auth.getAuthToken() });

    // socket.on('connect', () => {
    //   console.log('Connected to Suppr Service');
    // });

    // socket.on('new_order', () => {
    //   console.log('New order');
    //   refreshOrders();
    // });

    // socket.on('bill_request', () => {
    //   console.log('bill_request');
    //   refreshOrders();
    // });

    // socket.on('disconnect', () => {
    //   console.log('Disconnected from Suppr Service');
    // });

    // return () => {
    //   socket.disconnect();
    // };
    // const restaurantId = auth.getRestaurantId();
    // const eventSource = new EventSource(`${baseUrl}/sse-endpoint/${restaurantId}`);
    // eventSource.onmessage = event => {
    //   console.log('event', event);
    //   refreshOrders();
    // };
    // return () => {
    //   eventSource.close();
    // };
  }, []);

  const changeOrderStatus = async (orderDetails, newStatus, totalAmount) => {
    const { _id: orderId } = orderDetails;
    const { status } = await updateOrderStatus(orderId, newStatus, totalAmount);

    if (status === 'success') {
      refreshOrders();
      if (newStatus === orderStatus.COMPLETED) {
        refreshCompletedOrders();
      }
      if (newStatus === orderStatus.REJECTED) {
        refreshRejectedOrders();
      }
    }
  };

  const toggleOrdersVisibility = status => {
    setShowArchivedOrders(current => {
      const curr = { ...current };
      curr[status] = !curr[status];
      return curr;
    });
  };

  const changeArchivedOrderDays = (days, status) => {
    setArchivedOrdersDays(current => {
      const curr = { ...current };
      curr[status] = days;
      return curr;
    });
    if (status === orderStatus.COMPLETED) {
      refreshCompletedOrders(days);
    }
    if (status === orderStatus.REJECTED) {
      refreshRejectedOrders(days);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="btn-section-right">
        <Checkbox
          value={showArchivedOrders[orderStatus.COMPLETED]}
          onChange={() => toggleOrdersVisibility(orderStatus.COMPLETED)}
        />{' '}
        <span>Completed</span>
        <Checkbox
          value={showArchivedOrders[orderStatus.REJECTED]}
          onChange={() => toggleOrdersVisibility(orderStatus.REJECTED)}
        />{' '}
        <span>Rejected</span>
        <button
          className="btn-refresh"
          disabled={btnRefreshLoading}
          onClick={async () => {
            setBtnRefreshLoading(true);
            await Promise.all([refreshOrders(), refreshCompletedOrders(), refreshRejectedOrders()]);
            setBtnRefreshLoading(false);
          }}
        >
          <div className="content">
            <FontAwesomeIcon icon={faSyncAlt} />
            {btnRefreshLoading ? 'Refreshing...' : 'Refresh Orders'}
          </div>
        </button>
      </div>

      {newOrders && newOrders.length ? (
        <div className="order-cards">
          {newOrders.map(orderDetails => (
            <div className="order-card-holder" key={orderDetails._id}>
              <OrderCard orderDetails={orderDetails} changeStatus={changeOrderStatus} />
            </div>
          ))}
        </div>
      ) : null}

      {currentOrders && currentOrders.length > 0 && (
        <OrderGroups
          orderType="Accepted"
          orders={currentOrders}
          changeOrderStatus={changeOrderStatus}
          faIcon={faCheck}
        />
      )}

      {billedOrders && billedOrders.length > 0 && (
        <OrderGroups
          orderType="Billed"
          orders={billedOrders}
          changeOrderStatus={changeOrderStatus}
          faIcon={faRupeeSign}
        />
      )}

      {showArchivedOrders[orderStatus.COMPLETED] && (
        <OrderGroups
          orderType="Completed"
          orders={completedOrders}
          changeOrderStatus={changeOrderStatus}
          faIcon={faCheckCircle}
          changeNDays={days => changeArchivedOrderDays(days, orderStatus.COMPLETED)}
          loading={archivedOrdersLoading[orderStatus.COMPLETED]}
          lastNDays={archivedOrdersDays[orderStatus.COMPLETED]}
        />
      )}

      {showArchivedOrders[orderStatus.REJECTED] && (
        <OrderGroups
          orderType="Rejected"
          orders={rejectedOrders}
          changeOrderStatus={changeOrderStatus}
          faIcon={faTimesCircle}
          changeNDays={days => changeArchivedOrderDays(days, orderStatus.REJECTED)}
          loading={archivedOrdersLoading[orderStatus.REJECTED]}
          lastNDays={archivedOrdersDays[orderStatus.REJECTED]}
        />
      )}
    </div>
  );
};

export default withRouter(Dashboard);
