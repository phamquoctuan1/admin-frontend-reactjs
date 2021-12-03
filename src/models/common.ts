import { Category, Product } from "models";

export interface PaginationParams {
  _limit: number;
  _page: number;
  _totalRows: number;
}
export interface UserRespone {
  accessToken: string;
  refreshToken?: string;
}
export interface ListResponse<T> {
  data: T[];
  pagination: PaginationParams;
}
export interface ProductResponse {
  data: Product;
  status: string;
}
export interface CategoryResponse {
  data: Category;
  status: string;
}
export interface ListParams {
  _page?: number;
  _limit?: number;
  _sort?: string;
  _order?: 'asc' | 'desc';
  [key: string]: any;
}
