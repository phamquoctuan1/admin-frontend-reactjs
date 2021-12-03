export interface Size {
  name: 'S' | 'M' | 'L' | 'XL' | 'XXL';
}

export interface Color {
  name?: string;
  code: 'white' | 'pink' | 'black' | 'yellow' | 'orange' | 'blue' | 'red';
}
export interface Promote {
  status?: boolean;
  id?: number;
  name?: string;
  discount_percentage?: string;
  date_start?: Date | string;
  date_end?: Date | string;
  discount_amount?: number;
}
export interface Image {
  url: string;
}

export interface Product {
  id?: number;
  name?: string;
  price?: number;
  quantity?: number;
  discount_percentage?: string;
  description?: string;
  imageInfo: Image[] ;
  sizeInfo: Size[] ;
  colorInfo: Color[] ;
  promoteInfo?: Promote[];
  isPromoted?: boolean;
  slug?: string;
  status?: boolean;
  categoryId?: number;
  createdBy?: string;
}
