import { Transaction } from "firebase-admin/firestore";
import { db } from "../../config/firebase";
import { InternUserEntity } from "../../entities/internUser.entity";
import { COLLECTIONS } from "../../enum/collections.enum";
import { criptografarSenha } from "../../util/bcrypt.util";
import { docToObject, idToDocumentRef } from "../../util/firebase.util";
import { hashService } from "../auth/hash.service";
import { PatternService } from "../common/pattern.service";
import { CreateInternUserDto } from "./dto/createInternUser.dto";
import { UpdateInternUserDto } from "./dto/updateInternUser.dto";
import { InternUserResponseDto } from "./dto/responseInternUser.dto";

class InternUserService extends PatternService {
  constructor() {
    super(COLLECTIONS.GERENTES);
  }

  protected setup(
    idRestaurante?: string,
  ): FirebaseFirestore.CollectionReference<
    FirebaseFirestore.DocumentData,
    FirebaseFirestore.DocumentData
  > {
    if (idRestaurante)
      return db
        .collection(COLLECTIONS.RESTAURANTES)
        .doc(idRestaurante)
        .collection(this.COLLECTION_NAME);
    return db.collection(this.COLLECTION_NAME);
  }

  protected getRef(
    id: string,
    idEmpresa?: string,
  ): FirebaseFirestore.DocumentReference<
    FirebaseFirestore.DocumentData,
    FirebaseFirestore.DocumentData
  > {
    return this.setup(idEmpresa).doc(id);
  }

  public async listByEnterprise(enterpriseId: string) {
    const query = await this.setup(enterpriseId)
      .where(
        "restaurante_ref",
        "==",
        idToDocumentRef(enterpriseId, COLLECTIONS.RESTAURANTES),
      )
      .get();
    if (query.empty) return [];

    const internUsersFounded = query.docs.map((doc) => {
      const { senha, ...data } = doc.data();
      return docToObject<InternUserResponseDto>(doc.id, data);
    });

    return internUsersFounded;
  }

  public async autenticate(
    enterpriseId: string,
    internUserId: string,
    password: string,
  ) {
    const result = await this.getRef(internUserId, enterpriseId).get();
    if (!result.exists)
      throw new Error(`Usuário de id ${internUserId} não encontrado`);

    const doc = docToObject<InternUserEntity>(result.id, result.data()!);

    let obj: {
      resultado: boolean;
      mensagem: string;
      usuario?: InternUserResponseDto;
    } = {
      mensagem: "",
      resultado: false,
    };

    // verificando se as senhas batem
    if (!hashService.verifyMatch(password, doc.senha)) {
      obj = { mensagem: "Senha incorreta", resultado: false };
    } else {
      const { senha, ...internUserResponse } = doc;
      obj = {
        mensagem: "Autenticado com sucesso",
        resultado: true,
        usuario: internUserResponse,
      };
    }

    return obj;
  }

  public async find(enterpriseId: string, internUserId: string) {
    const result = await this.setup(enterpriseId).doc(internUserId).get();
    if (!result.exists)
      throw new Error(`Usuário de id ${internUserId} não encontrado`);

    return docToObject<InternUserResponseDto>(result.id, result.data()!);
  }

  public async create(enterpriseId: string, body: CreateInternUserDto) {
    const internUserToSave: InternUserEntity = {
      ...body,
      senha: criptografarSenha(body.senha),
      restaurante_ref: idToDocumentRef(enterpriseId, COLLECTIONS.RESTAURANTES),
      data_criacao: new Date(),
      ativo: true,
    };

    await this.setup(enterpriseId).add(internUserToSave);
  }

  public async createInTransaction(
    transaction: Transaction,
    enterpriseId: string,
    body: CreateInternUserDto,
  ) {
    const internUserToSave: InternUserEntity = {
      ...body,
      senha: hashService.encode(body.senha),
      restaurante_ref: idToDocumentRef(enterpriseId, COLLECTIONS.RESTAURANTES),
      data_criacao: new Date(),
      ativo: true,
    };
    transaction.set(this.setup(enterpriseId).doc(), internUserToSave);
  }

  public async delete(enterpriseId: string, internUserId: string) {
    await this.setup(enterpriseId).doc(internUserId).delete();
  }

  public async update(
    enterpriseId: string,
    internUserId: string,
    payload: Partial<UpdateInternUserDto>,
  ) {
    await this.setup(enterpriseId)
      .doc(internUserId)
      .update({
        ...payload,
      });

    if (payload.senha) {
      await this.setup(enterpriseId)
        .doc(internUserId)
        .update({
          senha: criptografarSenha(payload.senha),
        });
    }
  }
}

export const internUserService = new InternUserService();
