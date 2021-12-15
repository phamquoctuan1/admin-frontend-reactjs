import { Category, CategoryResponse, ListResponse } from 'models';
import axiosClient from './axiosClient';

const categoryApi = {
  getAll(): Promise<ListResponse<Category>> {
    const url = '/category';
    return axiosClient.get(url);
  },
  getWithoutParent(): Promise<ListResponse<Category>> {
    const url = '/category/parent';
    return axiosClient.get(url);
  },
  getById(id: number): Promise<CategoryResponse> {
    const url = `/category/${id}`;
    return axiosClient.get(url);
  },
  add(data: Category): Promise<Category> {
    const url = '/category';
    return axiosClient.post(url, data);
  },
  update(data: Partial<Category>): Promise<Category> {
    const url = `/category/${data.id}`;
    return axiosClient.patch(url, data);
  },
  remove(id: number): Promise<any> {
    const url = `/category/${id}`;
    return axiosClient.delete(url);
  },
};

export default categoryApi;
