import { DocumentReference } from "firebase-admin/firestore";
import { BaseEntity } from "./common/base.entity";
import { Voucher } from "./employee.entity";

export class PaymentEntity extends BaseEntity {
  funcionario_ref: string | DocumentReference;
  restaurante_ref: string | DocumentReference;
  valor_pago: number;
  salario_atual: number;
  vales: Voucher[];
  incentivo?: [];
  assinatura?: string;
  data_pagamento: Date;
}
