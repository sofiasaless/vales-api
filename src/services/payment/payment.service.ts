import { FieldValue, Transaction } from "firebase-admin/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../enum/collections.enum";
import { Pagamento } from "../../model/pagamento.model";
import { docToObject, idToDocumentRef } from "../../util/firebase.util";
import { PatternService } from "../common/pattern.service";
import { CreatePaymentDto } from "./dto/createPayment.dto";
import { Voucher } from "../../entities/employee.entity";
import { PaymentEntity } from "../../entities/payment.entity";
import { ListPaymentsWithFilterDto } from "./dto/listPaymentsWithFilter.dto";

class PaymentService extends PatternService {
  constructor() {
    super(COLLECTIONS.PAGAMENTOS);
  }

  public async create(
    enterpriseId: string,
    employeeId: string,
    pagamento: CreatePaymentDto,
  ) {
    const formattedVocuhers: Voucher[] = pagamento.vales.map((v) => {
      return {
        ...v,
        data_adicao: new Date(v.data_adicao),
        produto_ref: v.produto_ref
          ? idToDocumentRef(v.produto_ref as string, COLLECTIONS.MENU)
          : null,
      };
    });

    const paymentToSave: PaymentEntity = {
      ...pagamento,
      vales: formattedVocuhers,
      valor_pago: pagamento.valor_pago < 0 ? 0 : pagamento.valor_pago,
      funcionario_ref: idToDocumentRef(employeeId, COLLECTIONS.FUNCIONARIOS),
      restaurante_ref: idToDocumentRef(enterpriseId, COLLECTIONS.RESTAURANTES),
      data_pagamento: new Date(),
    };

    const employeeRef = idToDocumentRef(employeeId, COLLECTIONS.FUNCIONARIOS);

    await db.runTransaction(async (transaction) => {
      transaction.set(this.setup().doc(), paymentToSave);
      transaction.update(employeeRef, {
        vales: [],
        incentivo: [],
      });

      if (pagamento.valor_pago < 0) {
        const pendingVoucherToSave: Voucher = {
          id: crypto.randomUUID(),
          descricao: "Negativo último pagamento",
          quantidade: 1,
          preco_unit: pagamento.valor_pago * -1,
          data_adicao: new Date(),
        };

        transaction.update(employeeRef, {
          vales: FieldValue.arrayUnion(pendingVoucherToSave),
        });
      }
    });
  }

  public async listWithFilter(
    employeeId: string,
    filter: ListPaymentsWithFilterDto,
  ) {
    const startDate = new Date(filter.data_inicio);
    const endDate = new Date(filter.data_fim);

    const snapShot = await this.setup()
      .where(
        "funcionario_ref",
        "==",
        idToDocumentRef(employeeId, COLLECTIONS.FUNCIONARIOS),
      )
      .where("data_pagamento", ">=", startDate)
      .where("data_pagamento", "<=", endDate)
      .orderBy("data_pagamento", "desc")
      .get();

    if (snapShot.empty) return [];

    const paymentsFound = snapShot.docs.map((doc) => {
      return docToObject<PaymentEntity>(doc.id, doc.data()!);
    });

    return paymentsFound;
  }

  public async list(employeeId: string) {
    const snapShot = await this.setup()
      .where(
        "funcionario_ref",
        "==",
        idToDocumentRef(employeeId, COLLECTIONS.FUNCIONARIOS),
      )
      .get();

    if (snapShot.empty) return [];

    const paymnets = snapShot.docs.map((doc) => {
      return docToObject<PaymentEntity>(doc.id, doc.data()!);
    });

    return paymnets;
  }
}

export const paymentService = new PaymentService();
