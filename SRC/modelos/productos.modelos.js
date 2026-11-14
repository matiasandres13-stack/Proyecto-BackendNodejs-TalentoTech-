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

const coleccionProductos = collection(db, "productos_backend"); // definiendo una coleccion

export const findAllProductos = async (categoriasId) => {
  const productossnapshot = await getDocs(coleccionProductos);
  const productos = productossnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (!categoriasId) {
    return productos;
  }

  return productos.filter((p) => p.categoriasId === parseInt(categoriasId));
};

export const findProductoById = async (id) => {
  const docref = doc(db, "productos_backend", id);
  const docSnapshot = await getDoc(docref);

  if (!docSnapshot.exists()) {
    return null; // Producto no encontrado
  }

  return { id: docSnapshot.id, ...docSnapshot.data() };
};

export const createProducto = async (nombre, precio, categoriasId) => {
  const productref = await addDoc(coleccionProductos, {
    nombre,
    precio,
    categoriasId,
  });
  return { id: productref.id, nombre, precio, categoriasId };
};

export const updateProducto = async (id, { nombre, precio, categoriasId }) => {
  const docref = doc(db, "productos_backend", id);
  const docSnapshot = await getDoc(docref);

  if (!docSnapshot.exists()) {
    return null; // Producto no encontrado
  }

  await updateDoc(docref, { nombre, precio, categoriasId });
  return { id: docSnapshot.id, nombre, precio, categoriasId };
};

export const deleteProducto = async (id) => {
  const docref = doc(db, "productos_backend", id);
  const docSnapshot = await getDoc(docref);

  if (!docSnapshot.exists()) {
    return null; // Producto no encontrado
  }

  await deleteDoc(docref);
  return { id: docSnapshot.id, ...docSnapshot.data() };
};
