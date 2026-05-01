import { DocumentReference } from "firebase-admin/firestore";
import { InvoiceStatus } from "../enum/invoice.enum";
import { BaseEntity } from "./common/base.entity";

export class InvoiceEntity extends BaseEntity {
  status: InvoiceStatus;
  data_vencimento: Date | string;
  data_pagamento: Date | string | null;
  valor: number;
  link: string;
  restaurante_ref: string | DocumentReference;
  comprovante?: string;
  data_criacao: Date;
}
