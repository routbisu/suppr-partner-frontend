import { httpGet, httpPatch } from './httpService';

export const getOrderingStatus = async () => {
  const { data, status } = await httpGet(`get-ordering-status`);
  if (status === 200) {
    return data;
  }
};

export const changeOrderingStatus = async newStatus => {
  const { data, status } = await httpGet(`/ordering?status=${newStatus}`);
  if (status === 200) {
    return data;
  } else {
    alert('Connection with server lost!');
  }
};

export const getAllItems = async () => {
  const { data, status } = await httpGet(`/get-full-menu`);
  if (status === 200) {
    return data;
  }
};

export const saveInventoryStatus = async inventoryStatus => {
  const { data, status } = await httpPatch(`/inventory`, inventoryStatus);
  if (status === 200) {
    return data;
  }
};
