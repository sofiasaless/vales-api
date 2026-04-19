import { COLLECTIONS } from "../../enum/collections.enum";
import { Restaurante } from "../../model/restaurante.model";
import { docToObject } from "../../util/firebase.util";
import { gerenteService } from "../gerente.service";
import { mensalidadeService } from "../mensalidade.service";
import { PatternService } from "../pattern.service";
import { CreateEnterpriseDto } from "./dto/createEnterpriseDto";

class EmpresaService extends PatternService {
  constructor() {
    super(COLLECTIONS.RESTAURANTES);
  }

  async create(body: CreateEnterpriseDto, uid: string) {
    const toSave: Restaurante = {
      ...body,
      ativo: true,
      data_criacao: new Date(),
      pushTokens: [],
    };

    await this.firestore_db().runTransaction(async (transaction) => {
      const newEnterpriseRef = this.setup().doc(uid);
      transaction.set(newEnterpriseRef, toSave);

      // create first invoice and manager user
      await mensalidadeService.criar_EmTransacao(transaction, uid, {
        data_vencimento: new Date().toISOString(),
        valor: body.valor_plano,
        link: body.link_padrao,
      });

      await gerenteService.criar_EmTransacao(transaction, uid, {
        nome: "Gerente1",
        senha: "1234",
        tipo: "GERENTE",
      });
    });
  }

  public async encontrar(id: string) {
    const resultado = await this.setup().doc(id).get();
    if (!resultado.exists) throw new Error("Empresa não encontrada");

    return docToObject<Restaurante>(resultado.id, resultado.data()!);
  }

  public async listar() {
    const resultado = await this.setup().get();
    if (resultado.empty) throw new Error("Nenhuma empresa encontrada");

    const empresas = resultado.docs.map((doc) => {
      return docToObject<Restaurante>(doc.id, doc.data()!);
    });

    return empresas;
  }
}

export const empresaService = new EmpresaService();
