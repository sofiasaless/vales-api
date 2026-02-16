import { DocumentReference } from "firebase-admin/firestore"
import { Vale } from "./funcionario.model"
import { GanhosIncentivo } from "./incentivo.model"

export type Pagamento = {
  id: string,
  funcionario_ref: string,
  restaurante_ref: string,
  valor_pago: number,
  salario_atual: number,
  vales: Vale[],
  incentivo: GanhosIncentivo[],
  assinatura?: string,
  data_pagamento: Date
}

export type PagamentoFirestorePostRequestBody = Omit<Pagamento, "id" | "funcionario_ref" | "restaurante_ref"> & {
  funcionario_ref: DocumentReference,
  restaurante_ref: DocumentReference
}

export interface PagamentosFiltroData {
  data_inicio: string,
  data_fim: string
}