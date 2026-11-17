import * as productsService from "../services/products.service.js";

export const getProducts = async (req, res) => {
  const categoriasId = req.query.categoriasId;
  const categoriasIdfiltrado =
    await productsService.listProducts(categoriasId);
  res.json(categoriasIdfiltrado);
};

export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productsService.findProductById(productId);

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

    if (
      typeof nombre !== "string" ||
      !nombre.trim() ||
      typeof precio !== "number" ||
      !Number.isFinite(precio) ||
      precio < 0 ||
      typeof categoriasId !== "number" ||
      !Number.isInteger(categoriasId) ||
      categoriasId < 0
    ) {
      return res.status(422).json({
        error: "Faltan datos obligatorios o tienen un formato inválido",
      });
    }

    const newProduct = await productsService.createProduct({
      nombre,
      precio,
      categoriasId,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, categoriasId } = req.body ?? {};

    if (
      typeof nombre !== "string" ||
      !nombre.trim() ||
      typeof precio !== "number" ||
      !Number.isFinite(precio) ||
      precio < 0 ||
      typeof categoriasId !== "number" ||
      !Number.isInteger(categoriasId) ||
      categoriasId < 0
    ) {
      return res.status(422).json({
        error: "Faltan datos obligatorios o tienen un formato inválido",
      });
    }

    const updatedProduct = await productsService.updateProduct(id, {
      nombre,
      precio,
      categoriasId,
    });

    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const removedProduct = await productsService.deleteProduct(id);

  if (!removedProduct) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  return res.json(removedProduct);
};
