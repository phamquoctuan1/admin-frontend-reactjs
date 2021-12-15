import axiosClient from './axiosClient';

const dashBoardApi = {
  getTopProduct(): Promise<any> {
    const url = `/product/analytics/product/top`;
    return axiosClient.get(url);
  },
  getAmountOrder(): Promise<any> {
    const url = `/product/analytics/amount/top`;
    return axiosClient.get(url);
  },
  getUserById(id: number): Promise<any> {
    const url = `/user/${id}`;
    return axiosClient.get(url);
  },
};

export default dashBoardApi;
