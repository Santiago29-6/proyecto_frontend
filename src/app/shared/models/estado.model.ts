import { Pais } from "./pais.model";

export interface Estado{
  id: number;
  nombre: string;
  pais: Pais;
}