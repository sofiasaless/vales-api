import { DocumentReference } from "firebase-admin/firestore";
import { InternUserTypes } from "../enum/internUser.enum";
import { BaseEntity } from "./common/base.entity";

export class InternUserEntity extends BaseEntity {
  nome: string;
  tipo: InternUserTypes;
  senha: string;
  restaurante_ref: string | DocumentReference;
  ativo: boolean;
  img_perfil?: string;
  data_ultimo_acesso?: Date;
  data_criacao: Date;
}
