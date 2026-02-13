import { db } from "../config/firebase";
import { COLLECTIONS } from "../enum/collections.enum";
import { Gerente } from "../model/gerente.model";
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

  public async encontrarPorEmpresa(idEmpresa: string) {
    const query = await this.setup(idEmpresa).where("restaurante_ref", "==", idToDocumentRef(idEmpresa, COLLECTIONS.RESTAURANTES)).get()
    if (query.empty) return []

    const encontrados = query.docs.map((doc) => {
      return docToObject<Gerente>(doc.id, doc.data());
    })

    return encontrados;
  }

}

export const gerenteService = new GerenteService()