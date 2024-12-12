import { Brand } from "./brand.model";
import { Category } from "./category.model";
import { Estate } from "./estate.model";

export interface Product {
  id: number;
  name: string;
  descripction: string;
  price: number;
  quantity: number;
  sku: string;
  estate: Estate;
  image : string;
  brand : Brand;
  category : Category;
}
