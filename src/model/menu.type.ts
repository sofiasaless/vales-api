import { DocumentReference } from "firebase-admin/firestore"

export type ItemMenu = {
  id: string,
  descricao: string,
  preco: number,
  restaurante_ref: string,
  data_criacao: Date
}

export type ItemMenuFirestorePostRequestBody = Omit<ItemMenu, "id" | "restaurante_ref"> & {
  restaurante_ref: DocumentReference
}