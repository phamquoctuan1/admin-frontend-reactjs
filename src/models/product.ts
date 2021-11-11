export interface Product {
  id?: number;
  name: string;
  originalPrice: number;
  salePrice: number;
  slug: string;
  description: string;
  size: 's' | 'm' | 'l' | 'xl';
  status: number;
  createdBy: string;
  deletedAt: string;
  createdAt?: number;
  updatedAt?: number;
}
