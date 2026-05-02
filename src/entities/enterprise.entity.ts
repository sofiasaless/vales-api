import { BaseEntity } from "./common/base.entity";

export class EnterpriseEntity extends BaseEntity {
  nome_fantasia: string;
  email: string;
  ativo: boolean;
  pushTokens?: string[];
  data_criacao: Date;
  link_padrao: string;
  dia_pagamento: number;
  valor_plano: number;
}
