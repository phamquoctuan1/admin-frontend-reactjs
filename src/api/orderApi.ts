import { ListParams, ListResponse, Order } from 'models';
import axiosClient from './axiosClient';

const orderApi = {
  getAll(params: ListParams): Promise<ListResponse<Order>> {
    const url = '/order';
    return axiosClient.get(url,{params});
  },
  getById(id: number): Promise<Order> {
    const url = `/order/${id}`;
    return axiosClient.get(url);
  },
  update(id: number): Promise<Order> {
    const url = `/order/update/${id}`;
    return axiosClient.get(url);
  },
};

export default orderApi;
