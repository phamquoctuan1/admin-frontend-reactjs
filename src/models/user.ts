import { Order } from "models";

export interface User {
  id?: number | string;
  name?: string;
  email?: string;
  userName?: string;
  phone?: string;
  password?: string;
  token?: string;
  orderInfo?: Order[];
}
