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
  price: 1,
  description: "",
  categoryId: 0,
  images: []
}
