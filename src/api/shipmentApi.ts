import { ListParams, ListResponse, Shipment } from 'models';
import axiosClient from './axiosClient';

const shipmentApi = {
  getAll(params: ListParams): Promise<ListResponse<Shipment>> {
    const url = '/shipment';
    return axiosClient.get(url, { params });
  },
  getById(id: number): Promise<Shipment> {
    const url = `/shipment/${id}`;
    return axiosClient.get(url);
  },
  update(id: number): Promise<Shipment> {
    const url = `/shipment/update/${id}`;
    return axiosClient.get(url);
  },
};

export default shipmentApi;
