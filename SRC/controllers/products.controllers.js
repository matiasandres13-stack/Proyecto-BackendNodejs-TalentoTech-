import * as productsModel from "../models/products.models.js";

export const getProducts = async (req, res) => {
  const categoriasId = req.query.categoriasId;
  const categoriasIdfiltrado =
    await productsModel.findAllProducts(categoriasId);
  res.json(categoriasIdfiltrado);
};

export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productsModel.findProductById(productId);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const createProduct = async (req, res) => {
  try {
  const { nombre, precio, categoriasId } = req.body ?? {};

  if (!nombre || precio === undefined || precio < 0 || categoriasId === undefined || categoriasId < 0) {
    return res.status(422).json({ error: "Faltan datos del producto" });
  }

  const newProduct = await productsModel.createProduct(
    nombre,
    precio,
    categoriasId,
  );

  res.status(201).json(newProduct);
} catch (error) {
  console.error(error);
  res.status(500).json({ error: "Error interno del servidor" });
}
};

export const updateProduct = async (req, res) => {
 try{
  const { id } = req.params;
  const { nombre, precio, categoriasId } = req.body ?? {};

 if (!nombre || precio === undefined || precio < 0 || categoriasId === undefined || categoriasId < 0) {
    return res.status(422).json({ error: "Faltan datos del producto" });
  } 

  const updatedProduct = await productsModel.updateProduct(id, {
    nombre,
    precio,
    categoriasId,
  });

  if (!updatedProduct) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }
  res.json(updatedProduct);
} catch (error) {
  console.error(error);
  res.status(500).json({ error: "Error interno del servidor" });  
} 
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const removedProduct = await productsModel.deleteProduct(id);

  if (!removedProduct) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }

  return res.json(removedProduct);
};
