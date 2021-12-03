export interface Category {
  id?: number;
  parentId?: number;
  name: string;
  slug: string;
  status?: boolean;
  createdAt?: Date | string;
  createdBy?: string;
  children?: Category[];
}
