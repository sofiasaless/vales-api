import { MenuItemEntity } from "../../entities/menu.entity";
import { COLLECTIONS } from "../../enum/collections.enum";
import { docToObject, idToDocumentRef } from "../../util/firebase.util";
import { PatternService } from "../common/pattern.service";
import { CreateMenuItemDto } from "./dto/createMenuItem.dto";

class MenuService extends PatternService {
  constructor() {
    super(COLLECTIONS.MENU);
  }

  public async list(enterpiseId: string) {
    const snapShot = await this.setup()
      .where(
        "restaurante_ref",
        "==",
        idToDocumentRef(enterpiseId, COLLECTIONS.RESTAURANTES),
      )
      .orderBy("descricao", "asc")
      .get();

    if (snapShot.empty) return [];

    const result: MenuItemEntity[] = snapShot.docs.map((item) => {
      return docToObject<MenuItemEntity>(item.id, item.data()!);
    });

    return result;
  }

  public async create(enterpiseId: string, item: CreateMenuItemDto) {
    const itemParaSalvar: MenuItemEntity = {
      ...item,
      restaurante_ref: idToDocumentRef(enterpiseId, COLLECTIONS.RESTAURANTES),
      data_criacao: new Date(),
    };

    await this.setup().add(itemParaSalvar);
  }

  public async update(itemId: string, item: CreateMenuItemDto) {
    await this.setup().doc(itemId).update({
      descricao: item.descricao,
      preco: item.preco,
    });
  }

  public async delete(itemId: string) {
    await this.setup().doc(itemId).delete();
  }
}

export const menuService = new MenuService();
