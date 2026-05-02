import { EnterpriseEntity } from "../../entities/enterprise.entity";
import { COLLECTIONS } from "../../enum/collections.enum";
import { InternUserTypes } from "../../enum/internUser.enum";
import { docToObject } from "../../util/firebase.util";
import { PatternService } from "../common/pattern.service";
import { invoiceService } from "../invoices/invoice.service";
import { internUserService } from "../users/internUser.service";
import { CreateEnterpriseDto } from "./dto/createEnterpriseDto";

class EnterpriseService extends PatternService {
  constructor() {
    super(COLLECTIONS.RESTAURANTES);
  }

  async create(body: CreateEnterpriseDto, uid: string) {
    const toSave: EnterpriseEntity = {
      ...body,
      ativo: true,
      data_criacao: new Date(),
      pushTokens: [],
    };

    await this.firestore_db().runTransaction(async (transaction) => {
      const newEnterpriseRef = this.setup().doc(uid);
      transaction.set(newEnterpriseRef, toSave);

      // create first invoice and manager user
      await invoiceService.createInTransaction(transaction, uid, {
        data_vencimento: new Date().toISOString(),
        valor: body.valor_plano,
        link: body.link_padrao,
      });

      await internUserService.createInTransaction(transaction, uid, {
        nome: "Gerente1",
        senha: "1234",
        tipo: InternUserTypes.MANAGER,
        img_perfil: "",
      });
    });
  }

  public async find(id: string) {
    const result = await this.setup().doc(id).get();
    if (!result.exists) throw new Error("Empresa não encontrada");

    return docToObject<EnterpriseEntity>(result.id, result.data()!);
  }

  public async list() {
    const result = await this.setup().get();
    if (result.empty) throw new Error("Nenhuma empresa encontrada");

    const enterprises = result.docs.map((doc) => {
      return docToObject<EnterpriseEntity>(doc.id, doc.data()!);
    });

    return enterprises;
  }
}

export const enterpriseService = new EnterpriseService();
