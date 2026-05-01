import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../enum/collections.enum";
import {
  Incentivo,
  IncentivoFirestorePostRequestBody,
} from "../../model/incentivo.model";
import { docToObject, idToDocumentRef } from "../../util/firebase.util";
import { funcionarioIncentivoService } from "./funcionario.incentivo.service";
import { PatternService } from "../common/pattern.service";
import { employeeService } from "../employee/employee.service";

class IncentivoService extends PatternService {
  constructor() {
    super(COLLECTIONS.INCENTIVOS);
  }

  public async criar(idEmpresa: string, body: Incentivo) {
    const incentivoParaSalvar: IncentivoFirestorePostRequestBody = {
      ...body,
      restaurante_ref: idToDocumentRef(idEmpresa, COLLECTIONS.RESTAURANTES),
      data_expiracao: new Date(body.data_expiracao),
      data_adicao: new Date(),
    };

    // transação para criar o incentivo e os funcionários que farão parte dele
    await db.runTransaction(async (transaction) => {
      const incentivoRef = this.setup().doc();
      transaction.set(incentivoRef, incentivoParaSalvar);

      // criando os documentos dos funcionários
      const funcionarios = await employeeService.list(idEmpresa);
      funcionarios.map((f) => {
        funcionarioIncentivoService.criar(transaction, incentivoRef, f);
      });
    });
  }

  public async listar(idEmpresa: string) {
    const snapShot = await this.setup()
      .where(
        "restaurante_ref",
        "==",
        idToDocumentRef(idEmpresa, COLLECTIONS.RESTAURANTES),
      )
      .orderBy("data_adicao", "desc")
      .get();

    if (snapShot.empty) return [];

    const resultados = snapShot.docs.map((doc) => {
      docToObject<Incentivo>(doc.id, doc.data());
    });

    return resultados;
  }
}

export const incentivoService = new IncentivoService();
