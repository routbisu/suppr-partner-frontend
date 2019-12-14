import { httpGet, httpPatch } from './httpService';

export const getCurrentOrders = async () => {
  const { data, status } = await httpGet('/orders');
  if (status === 200) {
    return data;
  }
};

export const getArchivedOrders = async (ordStatus, days) => {
  const { data, status } = await httpGet(`/all-orders?status=${ordStatus}&days=${days}`);
  if (status === 200) {
    return data;
  }
};

export const updateOrderStatus = async (orderId, status, totalAmount) => {
  const { data, status: opStatus } = await httpPatch('/order', { orderId, status, totalAmount });
  if (opStatus === 200) {
    return data;
  }
};
