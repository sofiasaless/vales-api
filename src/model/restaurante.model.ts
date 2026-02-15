export type Restaurante = {
  id?: string,
  nome_fantasia: string,
  email: string,
  ativo: boolean,
  pushTokens?: string[],
  data_criacao: Date,
}

export type RestaurantePostRequestBody = Omit<Restaurante, "id" | "data_criacao" | "ativo" | "email">