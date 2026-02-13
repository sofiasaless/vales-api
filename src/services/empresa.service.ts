import { COLLECTIONS } from "../enum/collections.enum";
import { Restaurante } from "../model/restaurante.model";
import { docToObject } from "../util/firebase.util";
import { PatternService } from "./pattern.service";

class EmpresaService extends PatternService {

  constructor() {
    super(COLLECTIONS.RESTAURANTES);
  }

  public async encontrar(id: string){
    const resultado = await this.setup().doc(id).get()
    if (!resultado.exists) throw new Error("Empresa não encontrada");

    return docToObject<Restaurante>(resultado.id, resultado.data()!);
  }

}

export const empresaService = new EmpresaService()