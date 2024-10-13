import { ICategory } from "./category.models";

export interface IProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  creationAt: string;
  updatedAt: string;
  category: ICategory;
}


// initProduct = {
//   id: 0,
//   title: "",
//   price: 0,
//   description: "",
//   images: []
// }

export class IProduct implements IProduct {

}