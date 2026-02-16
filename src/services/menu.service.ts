import { COLLECTIONS } from "../enum/collections.enum";
import { ItemMenu, ItemMenuFirestorePostRequestBody } from "../model/menu.type";
import { docToObject, idToDocumentRef } from "../util/firebase.util";
import { PatternService } from "./pattern.service";

class MenuService extends PatternService {

  constructor() {
    super(COLLECTIONS.MENU);
  }

  public async listar(empresaId: string) {
    const snapShot = await this.setup().where("restaurante_ref", "==", idToDocumentRef(empresaId, COLLECTIONS.RESTAURANTES))
    .orderBy("descricao", "asc")
    .get();

    if (snapShot.empty) return [];

    const resultado: ItemMenu[] = snapShot.docs.map((item) => {
      return docToObject<ItemMenu>(item.id, item.data()!)
    })

    return resultado;
  }

  public async adicionar(empresaId: string, item: ItemMenu) {
    const itemParaSalvar: ItemMenuFirestorePostRequestBody = {
      ...item,
      restaurante_ref: idToDocumentRef(empresaId, COLLECTIONS.RESTAURANTES),
      data_criacao: new Date()
    }

    await this.setup().add(itemParaSalvar);
  }

  public async atualizar(itemId: string, item: ItemMenu) {
    await this.setup().doc(itemId).update({
      descricao: item.descricao,
      preco: item.preco
    })
  }

  public async remover(itemId: string) {
    await this.setup().doc(itemId).delete()
  }


}

export const menuService = new MenuService()