import { DocumentReference } from "firebase-admin/firestore";
import { BaseEntity } from "./common/base.entity";

export class MenuItemEntity extends BaseEntity {
  descricao: string;
  preco: number;
  restaurante_ref: string | DocumentReference;
  data_criacao: Date;
}
