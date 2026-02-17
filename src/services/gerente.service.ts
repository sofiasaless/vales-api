import { db } from "../config/firebase";
import { COLLECTIONS } from "../enum/collections.enum";
import { Gerente, GerenteFirestorePostRequestBody } from "../model/gerente.model";
import { criptografarSenha, verificarSenha } from "../util/bcrypt.util";
import { docToObject, idToDocumentRef } from "../util/firebase.util";
import { PatternService } from "./pattern.service";

class GerenteService extends PatternService {
  constructor() {
    super(COLLECTIONS.GERENTES)
  }

  protected setup(idRestaurante?: string): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData> {
    if (idRestaurante) return db.collection(COLLECTIONS.RESTAURANTES).doc(idRestaurante).collection(this.COLLECTION_NAME);
    return db.collection(this.COLLECTION_NAME)
  }

  protected getRef(id: string, idEmpresa?: string): FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData> {
    return this.setup(idEmpresa).doc(id);
  }

  public async listarPorEmpresa(idEmpresa: string) {
    const query = await this.setup(idEmpresa).where("restaurante_ref", "==", idToDocumentRef(idEmpresa, COLLECTIONS.RESTAURANTES)).get()
    if (query.empty) return []

    const encontrados = query.docs.map((doc) => {
      return docToObject<Gerente>(doc.id, doc.data());
    })

    return encontrados;
  }

  public async autenticar(idEmpresa: string, idGerente: string, senha: string) {
    const resultado = await this.getRef(idGerente, idEmpresa).get()
    if (!resultado.exists) throw new Error(`Usuário de id ${idGerente} não encontrado`);

    const doc = docToObject<Gerente>(resultado.id, resultado.data()!);
    
    let obj: { resultado: boolean, mensagem: string, usuario?: Gerente } = {
      mensagem: "",
      resultado: false
    }

    // verificando se as senhas batem
    if (!verificarSenha(senha, doc.senha)) {
      obj = { mensagem: "Senha incorreta", resultado: false }
    } else {
      obj = { mensagem: "Autenticado com sucesso", resultado: true, usuario: doc }
    }

    return obj
  }

  public async encontrar(idEmpresa: string, idGerente: string) {
    const resultado = await this.setup(idEmpresa).doc(idGerente).get();
    if (!resultado.exists) throw new Error(`Usuário de id ${idGerente} não encontrado`);

    return docToObject<Gerente>(resultado.id, resultado.data()!);
  }

  public async criar(idEmpesa: string, body: Gerente) {
    const gerenteParaSalvar: GerenteFirestorePostRequestBody = {
      ...body,
      senha: criptografarSenha(body.senha),
      restaurante_ref: idToDocumentRef(idEmpesa, COLLECTIONS.RESTAURANTES),
      data_criacao: new Date(),
      ativo: true
    }

    await this.setup(idEmpesa).add(gerenteParaSalvar);
  }

  public async excluir(idEmpresa: string, idGerente: string) {
    await this.setup(idEmpresa).doc(idGerente).delete()
  }

  public async atualizar(idEmpesa: string, idGerente: string, payload: Partial<Gerente>) {
    await this.setup(idEmpesa).doc(idGerente).update({
      ...payload
    })
  }
}

export const gerenteService = new GerenteService()