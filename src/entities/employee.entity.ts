import { DocumentReference } from "firebase-admin/firestore";
import { EmployeeTypes } from "../enum/employee.enum";
import { BaseEntity } from "./common/base.entity";
import { InternUserEntity } from "./internUser.entity";

export type Voucher = {
  id: string;
  quantidade: number;
  descricao: string;
  data_adicao: Date;
  preco_unit: number;
  produto_ref?: DocumentReference | string | null;
  criadoPor?: InternUserEntity;
};

export type IncentiveBonus = {
  valor: number;
  incentivo_ref?: string;
};

export interface AssinaturasContrato {
  contratante: string;
  contratado: string;
}
export type EmployeeContract = {
  contratacao_regime_ctl: boolean;
  descricao_servicos: string;
  assinaturas?: AssinaturasContrato;
};

export class EmployeeEntity extends BaseEntity {
  nome: string;
  salario: number;
  cpf?: string;
  cargo: string;
  tipo: EmployeeTypes;
  dias_trabalhados_semanal?: number;
  foto_url?: string;
  data_nascimento?: Date | null;
  data_admissao: Date;
  vales: Voucher[];
  incentivo: IncentiveBonus[];
  primeiro_dia_pagamento: number;
  segundo_dia_pagamento: number;
  restaurante_ref: string | DocumentReference;
  data_cadastro: Date;
  contrato?: EmployeeContract;
}
