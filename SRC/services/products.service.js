import * as productsModel from "../models/products.models.js";

export const listProducts = (categoriasId) =>
  productsModel.findAllProducts(categoriasId);

export const findProductById = (id) => productsModel.findProductById(id);

export const createProduct = (product) =>
  productsModel.createProduct(
    product.nombre,
    product.precio,
    product.categoriasId,
  );

export const updateProduct = (id, product) =>
  productsModel.updateProduct(id, product);

export const deleteProduct = (id) => productsModel.deleteProduct(id);
