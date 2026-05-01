import axios from "axios";
import dotenv from "dotenv";
import { COLLECTIONS } from "../../enum/collections.enum";
import { CreateAuthUserDto } from "../auth/dto/authUserDto";
import { FirebaseAuthService } from "../auth/firebaseAuth.service";
import { PatternService } from "../common/pattern.service";
import { enterpriseService } from "../enterprise/enterprise.service";
import {
  CreateAuthEnterpriseDto,
  CreateEnterpriseDto,
} from "../enterprise/dto/createEnterpriseDto";
dotenv.config();

class AuthService extends PatternService {
  private readonly firebaseAuthService = new FirebaseAuthService();

  constructor() {
    super(COLLECTIONS.RESTAURANTES);
  }

  async createEnterprise(body: CreateAuthEnterpriseDto) {
    const userRecord = await this.firebaseAuthService.createAuthUser({
      email: await this.firebaseAuthService.generateEmailByName(
        body.nome_fantasia,
      ),
      password: body.senha,
      name: body.nome_fantasia,
    });

    await this.firebaseAuthService.setUserClaims(userRecord.uid, {
      role: "manager",
    });

    const enterpriseToSave: CreateEnterpriseDto = {
      nome_fantasia: body.nome_fantasia,
      email: userRecord.email || "",
      valor_plano: body.valor_plano,
      dia_pagamento: body.dia_pagamento,
      link_padrao: body.link_padrao,
    };

    await enterpriseService.create(enterpriseToSave, userRecord.uid);
  }

  async createAdminUser(body: CreateAuthUserDto) {
    const result = await this.firebaseAuthService.createAuthUser(body);
    await this.firebaseAuthService.setUserClaims(result.uid, { role: "admin" });
  }

  async updateEnterpriseStatus(uid: string, status: boolean) {
    await this.firebaseAuthService.updateUser(uid, { disabled: status });
  }

  public async generateAdminToken({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const API_KEY = process.env.FIREBASE_API_KEY;
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

    const response = await axios.post(url, {
      email: email,
      password: password,
      returnSecureToken: true,
    });

    return response.data.idToken;
  }
}

export const authService = new AuthService();
