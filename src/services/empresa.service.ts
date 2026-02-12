import { CreateRequest, getAuth } from "firebase-admin/auth";
import { COLLECTIONS } from "../enum/collections.enum";
import { Restaurante, RestaurantePostRequestBody } from "../model/restaurante.model";
import { PatternService } from "./pattern.service";
import { Role } from "../types/roles.type";

class RestauranteService extends PatternService {
  
  constructor() {
    super(COLLECTIONS.RESTAURANTES)
  }

  async criar(body: RestaurantePostRequestBody, senha: string){
    const userToSave: CreateRequest = {
      disabled: false,
      displayName: body.nome_fantasia,
      email: await this.gerarEmail(body.nome_fantasia),
      password: senha
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
        pushTokens: []
      }

      await this.setup().add(restauranteParaSalvar);

      // criar primeira mensalidade em transação
      // ....

      
      // criar cliente no abacate pay e primeira cobrança de mensalidade....
      // ...EM BREVE
    })

  }

  private async setClaims(uid: string, role: Role, ativo: boolean = true) {
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

export const restauranteService = new RestauranteService()