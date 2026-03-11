import { DocumentReference } from "firebase-admin/firestore"

export type Incentivo = {
  id: string,
  valor_incentivo: number,
  descricao: string,
  meta: number,
  restaurante_ref: string,
  status: boolean,
  data_expiracao: string,
  ganhador_nome?: string,
  ganhador_ref?: string,
  data_adicao: Date
}

export type IncentivoFirestorePostRequestBody = Omit<Incentivo, "id" | "ganhador_nome" | "ganhador_ref" | "restaurante_ref" | "data_expiracao"> & {
  restaurante_ref: DocumentReference,
  data_expiracao: Date
}

export type IncentivoFirestoreUpdateRequestBody = Pick<Incentivo, "valor_incentivo" | "meta" | "descricao" | "ganhador_nome" | "status"> & {
  ganhador_ref: DocumentReference,
  data_expiracao: Date
}

// POR PARTE DO FUNCIONÁRIO
// atributos que ficará salvo no funcionário incentivo
export type IncentivoFuncionario = {
  contador: number,
  incentivo_ref: string,
  ganhador: boolean
}

export type IncentivoFuncionarioFirestorePostRequestBody = Omit<IncentivoFuncionario, "incentivo_ref"> & {
  incentivo_ref: DocumentReference
}

// atributos que ficará salvo no funcionário
export type GanhosIncentivo = {
  valor: number;
  incentivo_ref: string;
}

export type GanhoIncentivoFirestorePostResquestBody = Omit<GanhosIncentivo, "incentivo_ref"> & {
  incentivo_ref: DocumentReference
}