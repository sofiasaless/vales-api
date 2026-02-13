import admin from "firebase-admin";
import { db } from "../config/firebase";

// definindo uma classe padrão que todos os services irão extender pra evitar repetição de código
export abstract class PatternService {
  protected COLLECTION_NAME: string

  constructor(collection_name: string) {
    this.COLLECTION_NAME = collection_name;
    this.setup();
  }

  protected setup(idRestaurante?: string) {
    return db.collection(this.COLLECTION_NAME);
  }

  protected firestore_db() {
    return db;
  }

  protected firestore_admin() {
    return admin;
  }

  protected getRef(id: string) {
    return this.setup().doc(id)
  }

}