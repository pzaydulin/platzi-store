import { ICategory } from "./category.models";

export interface IProduct {
  id?: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  creationAt?: string;
  updatedAt?: string;
  categoryId?: number;
  category?: ICategory;
}


export const initProduct = {
  title: "",
  price: 0,
  description: "",
  categoryId: 0,
  images: []
}

export class IProduct implements IProduct {
  
}