import { DocumentReference, Transaction } from "firebase-admin/firestore";
import { COLLECTIONS } from "../../enum/collections.enum";
import { PatternService } from "../common/pattern.service";
import { Funcionario } from "../../model/funcionario.model";
import { FuncionarioIncentivoFirestorePostRequestBody } from "../../model/funcionario_incentivo.model";
import { idToDocumentRef } from "../../util/firebase.util";

class FuncionarioIncentivoService extends PatternService {
  constructor() {
    super(COLLECTIONS.FUNCIONARIOS_INCENTIVO);
  }

  public async criar(
    transaction: Transaction,
    incentivoRef: DocumentReference,
    body: Funcionario,
  ) {
    const paraSalvar: FuncionarioIncentivoFirestorePostRequestBody = {
      contador: 0,
      funcinoario_ref: idToDocumentRef(body.id, COLLECTIONS.FUNCIONARIOS),
      ganhador: false,
      funcionario_obj: body,
      incentivo_ref: incentivoRef,
      data_criacao: new Date(),
    };

    transaction.set(this.setup().doc(), paraSalvar);
  }
}

export const funcionarioIncentivoService = new FuncionarioIncentivoService();
