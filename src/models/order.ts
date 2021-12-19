import { User } from "models";

export interface OrderDetails {
  id: number;
  productName: string
  quantity: number
  price: number
  color: string
  size: string
  createdAt: string
  updatedAt: string
  productId: number
  orderId: number
}
export interface Shipment {
  id?: number;
  ship_method: 'ghtk';
  ship_cost: number;
  status: boolean;
  ship_date: string;
  estimated_time: string;
  address: string;
  phone: string;
  name_customer: string;
  email: string;
  deletedAt?: Date;
  orderInfo: Order;
}

export interface Order {
  id?: string | number;
  name: string;
  amount: number;
  orderType: string;
  status: boolean;
  comfirmedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: number;
  userInfo: User;
  OrderDetails:OrderDetails[];
  shipmentInfo:Shipment;
  deletedAt?: Date;
}
