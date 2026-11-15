import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../config/firebase.js";

const productsCollection = collection(db, "productos_backend"); // definiendo una coleccion

export const findAllProducts = async (categoriasId) => {
  const productsSnapshot = await getDocs(productsCollection);
  const products = productsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (!categoriasId) {
    return products;
  }

  return products.filter((p) => p.categoriasId === parseInt(categoriasId));
};

export const findProductById = async (id) => {
  const docRef = doc(db, "productos_backend", id);
  const docSnapshot = await getDoc(docRef);

  if (!docSnapshot.exists()) {
    return null; // Producto no encontrado
  }

  return { id: docSnapshot.id, ...docSnapshot.data() };
};

export const createProduct = async (nombre, precio, categoriasId) => {
  const productRef = await addDoc(productsCollection, {
    nombre,
    precio,
    categoriasId,
  });
  return { id: productRef.id, nombre, precio, categoriasId };
};

export const updateProduct = async (id, { nombre, precio, categoriasId }) => {
  const docRef = doc(db, "productos_backend", id);
  const docSnapshot = await getDoc(docRef);

  if (!docSnapshot.exists()) {
    return null; // Producto no encontrado
  }

  await updateDoc(docRef, { nombre, precio, categoriasId });
  return { id: docSnapshot.id, nombre, precio, categoriasId };
};

export const deleteProduct = async (id) => {
  const docRef = doc(db, "productos_backend", id);
  const docSnapshot = await getDoc(docRef);

  if (!docSnapshot.exists()) {
    return null; // Producto no encontrado
  }

  await deleteDoc(docRef);
  return { id: docSnapshot.id, ...docSnapshot.data() };
};
