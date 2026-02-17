import { FieldValue, Transaction } from "firebase-admin/firestore";
import { db } from "../config/firebase";
import { COLLECTIONS } from "../enum/collections.enum";
import { Vale, ValeFirestorePostRequestBody } from "../model/funcionario.model";
import { Pagamento, PagamentoFirestorePostRequestBody, PagamentosFiltroData } from "../model/pagamento.model";
import { docToObject, idToDocumentRef } from "../util/firebase.util";
import { PatternService } from "./pattern.service";

class PagamentoService extends PatternService {
  constructor() {
    super(COLLECTIONS.PAGAMENTOS);
  }

  public async criar(idEmpresa: string, idFuncionario: string, pagamento: Pagamento) {
    const valesFormatados: ValeFirestorePostRequestBody[] = pagamento.vales.map((v) => {
      return {
        ...v,
        data_adicao: new Date(v.data_adicao),
        produto_ref: v.produto_ref ? idToDocumentRef(v.produto_ref, COLLECTIONS.MENU) : null
      }
    })

    const pagamentoParaSalvar: PagamentoFirestorePostRequestBody = {
      ...pagamento,
      vales: valesFormatados as Vale[],
      valor_pago: (pagamento.valor_pago < 0) ? 0 : pagamento.valor_pago,
      funcionario_ref: idToDocumentRef(idFuncionario, COLLECTIONS.FUNCIONARIOS),
      restaurante_ref: idToDocumentRef(idEmpresa, COLLECTIONS.RESTAURANTES),
      data_pagamento: new Date()
    }


    const funcionarioRef = idToDocumentRef(idFuncionario, COLLECTIONS.FUNCIONARIOS);

    await db.runTransaction(async (transaction) => {
      transaction.set(this.setup().doc(), pagamentoParaSalvar);
      transaction.update(funcionarioRef, {
        vales: [],
        incentivo: []
      })

      if (pagamento.valor_pago < 0) {
        const valeParaSalvar: Vale = {
          id: crypto.randomUUID(),
          descricao: 'Negativo última quinzena',
          quantidade: 1,
          preco_unit: pagamento.valor_pago * -1,
          data_adicao: new Date()
        }

        transaction.update(funcionarioRef, {
          vales: FieldValue.arrayUnion(valeParaSalvar),
        })
      }
    })
  }

  public async listarFiltrado(idFuncionario: string, filtro: PagamentosFiltroData) {
    const dataInicio = new Date(filtro.data_inicio);
    const dataFim = new Date(filtro.data_fim);

    const snapShot = await this.setup()
      .where("funcionario_ref", "==", idToDocumentRef(idFuncionario, COLLECTIONS.FUNCIONARIOS))
      .where("data_pagamento", ">=", dataInicio)
      .where("data_pagamento", "<=", dataFim)
      .orderBy("data_pagamento", "desc")
    .get()

    if (snapShot.empty) return [];

    const pagamentos = snapShot.docs.map((doc) => {
      return docToObject<Pagamento>(doc.id, doc.data()!)
    })

    return pagamentos
  }

  public async listar(idFuncionario: string) {
    const snapShot = await this.setup().where("funcionario_ref", "==", idToDocumentRef(idFuncionario, COLLECTIONS.FUNCIONARIOS)).get()

    if (snapShot.empty) return [];

    const pagamentos = snapShot.docs.map((doc) => {
      return docToObject<Pagamento>(doc.id, doc.data()!)
    })

    return pagamentos
  }

}

export const pagamentoService = new PagamentoService()