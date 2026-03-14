import { CreateRequest, getAuth } from "firebase-admin/auth";
import { COLLECTIONS } from "../enum/collections.enum";
import { Restaurante, RestaurantePostRequestBody } from "../model/restaurante.model";
import { PatternService } from "./pattern.service";
import { Role } from "../types/roles.type";
import { mensalidadeService } from "./mensalidade.service";
import { gerenteService } from "./gerente.service";

class EmpresaAuthService extends PatternService {
  
  constructor() {
    super(COLLECTIONS.RESTAURANTES)
  }

  async criar(body: RestaurantePostRequestBody){
    const userToSave: CreateRequest = {
      disabled: false,
      displayName: body.nome_fantasia,
      email: await this.gerarEmail(body.nome_fantasia),
      password: body.senha
    }

    await getAuth().createUser(userToSave)
    .then(async (userRecord) => {
      await this.setClaims(userRecord.uid, 'manager');

      // criando o documento do restaurante no firestore
      const restauranteParaSalvar: Restaurante = {
        nome_fantasia: body.nome_fantasia,
        email: userRecord.email || '',
        ativo: true,
        data_criacao: new Date(),
        pushTokens: [],
        valor_plano: body.valor_plano,
        dia_pagamento: body.dia_pagamento,
        link_padrao: body.link_padrao
      }

      await this.firestore_db().runTransaction(async (transaction) => {
        const restRef = this.setup().doc(userRecord.uid)
        transaction.set(restRef, restauranteParaSalvar);
        // criar primeira mensalidade em transação
        // ....
        mensalidadeService.criar_EmTransacao(transaction, restRef.id, {
          data_vencimento: new Date().toISOString(),
          valor: body.valor_plano,
          link: body.link_padrao
        })

        gerenteService.criar_EmTransacao(transaction, restRef.id, {
          nome: 'Usuario1',
          senha: '1234',
          tipo: 'GERENTE'
        })
      })
    })

  }

  public async setClaims(uid: string, role: Role, ativo: boolean = true) {
    await getAuth().setCustomUserClaims(uid, {
      role,
      active: ativo
    });
    return { success: true };
  }

  private async gerarEmail(nome_fantasia: string): Promise<string> {
    const baseNome = nome_fantasia
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");

    const email = `${baseNome}@upbusiness.com`;
    try {
      await getAuth().getUserByEmail(email);

      // se chegou aqui, o email JÁ EXISTE
      const sufixo = Math.floor(Math.random() * 1000);
      return this.gerarEmail(`${nome_fantasia}${sufixo}`);

    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        return email;
      }
      throw error;
    }
  }

}

export const empresaAuthService = new EmpresaAuthService()