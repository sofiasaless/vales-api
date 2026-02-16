import { DocumentReference, Timestamp } from "firebase-admin/firestore";
import { COLLECTIONS } from "../enum/collections.enum";
import { db } from "../config/firebase";

/**
 * retorna uma referência de documento no Firestore a partir do ID e da coleção.
 * @param id ID do documento
 * @param collection Nome da coleção
 * @returns DocumentReference
 */
export function idToDocumentRef(id: string, collection: COLLECTIONS): DocumentReference {
  return db.collection(collection).doc(id);
}

function transformFieldValue(value: any): any {
  if (value === null || value === undefined) return value;

  // Timestamp -> ISO string
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  // DocumentReference -> id
  if (value instanceof DocumentReference) {
    return value.id;
  }

  // Array -> recursivo
  if (Array.isArray(value)) {
    return value.map(transformFieldValue);
  }

  // Objeto comum -> recursivo
  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, transformFieldValue(v)])
    );
  }

  // Primitivo
  return value;
}

export function docToObject<T>(
  id: string,
  data: FirebaseFirestore.DocumentData
): T {
  const transformedData = transformFieldValue(data);

  return { ...transformedData, id } as T;
}

// export function docToObject<T>(
//   id: string, 
//   data: FirebaseFirestore.DocumentData
// ): T {
//   const transformedData = Object.fromEntries(
//     Object.entries(data).map(([key, value]) => [
//       key, 
//       transformFieldValue(value)
//     ])
//   );
  
//   return { ...transformedData, id } as T;
// }