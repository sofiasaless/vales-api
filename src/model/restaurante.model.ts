export type Restaurante = {
  id?: string,
  nome_fantasia: string,
  email: string,
  ativo: boolean,
  pushTokens?: string[],
  data_criacao: Date,
  link_padrao: string,
  dia_pagamento: number,
  valor_plano: number,
}

export type RestaurantePostRequestBody = Omit<Restaurante, "id" | "data_criacao" | "ativo" | "email"> & {
  senha: string;
}
