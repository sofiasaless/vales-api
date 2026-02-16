import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { COLLECTIONS } from "../enum/collections.enum";
import { Funcionario, FuncionarioFirestorePostRequestBody, Vale, ValeFirestorePostRequestBody } from "../model/funcionario.model";
import { docToObject, idToDocumentRef } from "../util/firebase.util";
import { PatternService } from "./pattern.service";

class FuncionarioService extends PatternService {
  constructor() {
    super(COLLECTIONS.FUNCIONARIOS)
  }

  public async criar(idEmpresa: string, funcionario: Funcionario) {
    const funcionarioParaSalvar: FuncionarioFirestorePostRequestBody = {
      ...funcionario,
      restaurante_ref: idToDocumentRef(idEmpresa, COLLECTIONS.RESTAURANTES),
      data_admissao: new Date(funcionario.data_admissao),
      data_nascimento: funcionario.data_nascimento?new Date(funcionario.data_nascimento):null,
      data_cadastro: new Date()
    }

    await this.setup().add(funcionarioParaSalvar);
  }

  public async listar(idEmpresa: string) {
    const snapShot = await this.setup().where("restaurante_ref", "==", idToDocumentRef(idEmpresa, COLLECTIONS.RESTAURANTES))
      .orderBy("nome", "asc")
      .get();

    const funcionarios = snapShot.docs.map((doc) => {
      return docToObject<Funcionario>(doc.id, doc.data()!)
    })

    return funcionarios;
  }

  public async encontrar(idFuncioario: string) {
    const encontrado = await this.setup().doc(idFuncioario).get();
    if (!encontrado.exists) throw new Error(`Funcionário de ID ${idFuncioario} não encontrado`);

    return docToObject<Funcionario>(encontrado.id, encontrado.data()!);
  }

  public async adicionarVale(idFuncionario: string, valeBody: Vale) {
    const valeParaSalvar: ValeFirestorePostRequestBody = {
      ...valeBody,
      data_adicao: new Date(),
      produto_ref: valeBody.produto_ref ? idToDocumentRef(valeBody.produto_ref, COLLECTIONS.MENU) : null
    }

    await this.setup().doc(idFuncionario).update({
      vales: FieldValue.arrayUnion(valeParaSalvar)
    })
  }

  public async adicionarMultiplosVales(idFuncioario: string, valesBody: Vale[]) {
    const valesParaSalvar: ValeFirestorePostRequestBody[] = valesBody.map((v) => {
      return {
        ...v,
        data_adicao: new Date(),
        produto_ref: v.produto_ref ? idToDocumentRef(v.produto_ref, COLLECTIONS.MENU) : null
      }
    })

    await this.setup().doc(idFuncioario).update({
      vales: FieldValue.arrayUnion(...valesParaSalvar)
    })
  }

  public async removerVale(idFuncioario: string, vale: Vale) {
    let valeParaRemover = {
      ...vale,
      produto_ref: (vale.produto_ref)?idToDocumentRef(vale.produto_ref, COLLECTIONS.MENU):null,
      data_adicao: Timestamp.fromDate(new Date(vale.data_adicao))
    }

    await this.setup().doc(idFuncioario).update({
      vales: FieldValue.arrayRemove(valeParaRemover)
    })
  }

  public async atualizar(idFuncioario: string, payload: Partial<Funcionario>) {
    await this.setup().doc(idFuncioario).update({
      ...payload
    })
  }

  public async excluir(idFuncioario: string) {
    await this.setup().doc(idFuncioario).delete()
  }

}

export const funcionarioService = new FuncionarioService()