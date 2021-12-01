
import { User } from 'models';
import axiosClient from './axiosClient';

const authApi = {
  getUser(data: any): Promise<any> {
    const url = '/auth/user';
    return axiosClient.get(url, {
      headers: {
        authorization: `Bearer ${data} `,
      },
    });
  },
  refreshToken(data: any): Promise<any> {
    const url = '/auth/refreshtoken';
    return axiosClient.post(url, data);
  },
  updateUser(data: Partial<User>): Promise<any> {
    const url = '/user/update';
    return axiosClient.patch(url, data);
  },
  login(data: User): Promise<User> {
    const url = '/auth/admin/login';
    return axiosClient.post(url, data);
  },

};

export default authApi;
