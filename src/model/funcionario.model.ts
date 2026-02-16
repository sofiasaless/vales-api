import { DocumentReference } from "firebase-admin/firestore";
import { GanhosIncentivo } from "./incentivo.model";

export type TipoFuncionario = 'DIARISTA' | 'FIXO'

export interface AssinaturasContrato {
  contratante: string,
  contratado: string
}

export type ContratoFuncionario = {
  contratacao_regime_ctl: boolean,
  descricao_servicos: string,
  assinaturas?: AssinaturasContrato
}

export type Funcionario = {
  id: string,
  nome: string,
  salario: number,
  cpf?: string,
  cargo: string,
  tipo: TipoFuncionario,
  dias_trabalhados_semanal?: number;
  foto_url?: string,
  data_nascimento?: string | null,
  data_admissao: string,
  vales: Vale[],
  incentivo: GanhosIncentivo[],
  primeiro_dia_pagamento: number,
  segundo_dia_pagamento: number,
  restaurante_ref: string,
  data_cadastro: Date,
  contrato?: ContratoFuncionario
}

export type FuncionarioFirestorePostRequestBody = Omit<Funcionario, "id" | "restaurante_ref" | "data_nascimento" | "data_admissao"> & {
  restaurante_ref: DocumentReference,
  data_admissao: Date,
  data_nascimento?: Date | null
}

export type FuncionarioUpdateRequestBody = Pick<
  Funcionario,
  "nome" | "cargo" | 'cpf' | 'data_admissao' | 'data_nascimento' | 'primeiro_dia_pagamento' | 'segundo_dia_pagamento' | 'tipo' | 'salario' | 'foto_url' | 'dias_trabalhados_semanal'
>

// tipos auxiliares
export type Vale = {
  id: string,
  quantidade: number,
  descricao: string,
  data_adicao: Date,
  preco_unit: number;
  produto_ref?: string;
}

export type ValeFirestorePostRequestBody = Omit<Vale, "produto_ref"> & {
  produto_ref?: DocumentReference | null
}