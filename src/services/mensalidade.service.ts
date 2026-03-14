import { Transaction } from "firebase-admin/firestore";
import { COLLECTIONS } from "../enum/collections.enum";
import {
  Mensalidade,
  MensalidadeFirestorePostRequestBody,
  MensalidadePostRequestBody,
} from "../model/mensalidade.model";
import { docToObject, idToDocumentRef } from "../util/firebase.util";
import { PatternService } from "./pattern.service";

class MensalidadeService extends PatternService {
  constructor() {
    super(COLLECTIONS.MENSALIDADES);
  }

  public async listar(empresaId: string) {
    const snapShot = await this.setup()
      .where(
        "restaurante_ref",
        "==",
        idToDocumentRef(empresaId, COLLECTIONS.RESTAURANTES),
      )
      .orderBy("data_vencimento", "desc")
      .get();

    if (snapShot.empty) return [];

    const resultado: Mensalidade[] = snapShot.docs.map((item) => {
      return docToObject<Mensalidade>(item.id, item.data()!);
    });

    return resultado;
  }

  public async criar(empresaId: string, body: MensalidadePostRequestBody) {
    const mensalidadeParaSalvar: MensalidadeFirestorePostRequestBody = {
      ...body,
      status: "PENDENTE",
      restaurante_ref: idToDocumentRef(empresaId, COLLECTIONS.RESTAURANTES),
      data_pagamento: null,
      data_vencimento: new Date(body.data_vencimento),
      data_criacao: new Date(),
    };

    await this.setup().add(mensalidadeParaSalvar);
  }

  public async criar_EmTransacao(transaction: Transaction, empresaId: string, body: MensalidadePostRequestBody) {
    const mensalidadeParaSalvar: MensalidadeFirestorePostRequestBody = {
      ...body,
      status: "PENDENTE",
      restaurante_ref: idToDocumentRef(empresaId, COLLECTIONS.RESTAURANTES),
      data_pagamento: null,
      data_vencimento: new Date(body.data_vencimento),
      data_criacao: new Date(),
    };

    transaction.set(this.setup().doc(), mensalidadeParaSalvar);
  }

  public async atualizar(mensalidadeId: string, payload: Mensalidade) {
    await this.setup().doc(mensalidadeId).update({
      ...payload
    });
  }

  public async confirmarPagamento(id: string) {
    await this.setup().doc(id).update(<Mensalidade>{
      status: 'PAGO',
      data_pagamento: new Date()
    })
  }
}

export const mensalidadeService = new MensalidadeService();
