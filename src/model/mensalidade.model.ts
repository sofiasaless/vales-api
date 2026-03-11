import { DocumentReference } from "firebase-admin/firestore";

export type Mensalidade = {
  id?: string;
  status: StatusMensalidade;
  data_vencimento: string;
  data_pagamento: Date | null;
  valor: number;
  link: string;
  restaurante_ref: string;
  data_criacao: Date;
};

export type MensalidadeFirestorePostRequestBody = Omit<
  Mensalidade,
  "id" | "restaurante_ref" | "data_vencimento"
> & {
  data_vencimento: Date;
  restaurante_ref: DocumentReference;
};

export type StatusMensalidade = "PENDENTE" | "PAGO" | "VENCIDO";

export type MensalidadePostRequestBody = Pick<Mensalidade, "valor" | "link" | "data_vencimento">;