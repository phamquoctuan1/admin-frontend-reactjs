
import axiosClient from './axiosClient';

const userApi = {
  getAll(): Promise<any>{
     const url = `/user`;
      return axiosClient.get(url);
  },
  getUserById(id: number): Promise<any> {
    const url = `/user/${id}`;
    return axiosClient.get(url);
  },
};

export default userApi;
