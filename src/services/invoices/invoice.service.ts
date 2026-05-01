import { Transaction } from "firebase-admin/firestore";
import { COLLECTIONS } from "../../enum/collections.enum";
import {
  Mensalidade,
  MensalidadeFirestorePostRequestBody,
  MensalidadePostRequestBody,
} from "../../model/mensalidade.model";
import { docToObject, idToDocumentRef } from "../../util/firebase.util";
import { PatternService } from "../common/pattern.service";
import { InvoiceEntity } from "../../entities/invoice.entity";
import { CreateInvoiceDto } from "./dto/createInvoice.dto";
import { InvoiceStatus } from "../../enum/invoice.enum";
import { UpdateInvoiceDto } from "./dto/updateInvoice.dto";

class InvoiceService extends PatternService {
  constructor() {
    super(COLLECTIONS.MENSALIDADES);
  }

  public async list(enterpriseId: string) {
    const snapShot = await this.setup()
      .where(
        "restaurante_ref",
        "==",
        idToDocumentRef(enterpriseId, COLLECTIONS.RESTAURANTES),
      )
      .orderBy("data_vencimento", "desc")
      .get();

    if (snapShot.empty) return [];

    const result: InvoiceEntity[] = snapShot.docs.map((item) => {
      return docToObject<InvoiceEntity>(item.id, item.data()!);
    });

    return result;
  }

  public async create(enterpriseId: string, body: CreateInvoiceDto) {
    const invoiceToSave: InvoiceEntity = {
      ...body,
      status: InvoiceStatus.PENDING,
      restaurante_ref: idToDocumentRef(enterpriseId, COLLECTIONS.RESTAURANTES),
      data_pagamento: null,
      data_vencimento: new Date(body.data_vencimento),
      data_criacao: new Date(),
    };

    await this.setup().add(invoiceToSave);
  }

  public async createInTransaction(
    transaction: Transaction,
    enterpriseId: string,
    body: CreateInvoiceDto,
  ) {
    const invoiceToSave: InvoiceEntity = {
      ...body,
      status: InvoiceStatus.PENDING,
      restaurante_ref: idToDocumentRef(enterpriseId, COLLECTIONS.RESTAURANTES),
      data_pagamento: null,
      data_vencimento: new Date(body.data_vencimento),
      data_criacao: new Date(),
    };

    transaction.set(this.setup().doc(), invoiceToSave);
  }

  public async update(invoiceId: string, payload: UpdateInvoiceDto) {
    await this.setup()
      .doc(invoiceId)
      .update({
        ...payload,
      });
  }

  public async confirmPayment(id: string) {
    await this.setup().doc(id).update({
      status: InvoiceStatus.PAID,
      data_pagamento: new Date(),
    });
  }
}

export const invoiceService = new InvoiceService();
