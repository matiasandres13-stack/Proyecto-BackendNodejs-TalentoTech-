import * as productosModel from "../modelos/productos.modelos.js";

export const getProductos = async (req, res) => {
  const categoriasId = req.query.categoriasId;
  const categoriasIdfiltrado =
    await productosModel.findAllProductos(categoriasId);
  res.json(categoriasIdfiltrado);
};

export const getProductoById = async (req, res) => {
  const productosId = parseInt(req.params.id);

  if (isNaN(productosId)) {
    return res.status(400).json({ error: "ID de producto no valido" });
  }

  const productoEncontrado = await productosModel.findProductoById(productosId);
  if (!productoEncontrado) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }
  res.json(productoEncontrado);
};

export const createProducto = async (req, res) => {
  const { nombre, precio, categoriasId } = req.body;

  if (!nombre || !precio || !categoriasId) {
    return res.status(422).json({ error: "Faltan datos del producto" });
  }

  const nuevoProducto = await productosModel.createProducto(
    nombre,
    precio,
    categoriasId,
  );

  res.status(201).json(nuevoProducto);
};

export const updateProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, categoriasId } = req.body ?? {};

  if (!nombre || !precio || !categoriasId) {
    return res.status(422).json({ error: "Faltan datos del producto" });
  }

  const updateProducto = await productosModel.updateProducto(id, {
    nombre,
    precio,
    categoriasId,
  });

  if (!updateProducto) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }
  res.json(updateProducto);
};

export const deleteProducto = async (req, res) => {
  const { id } = req.params;

  const productoEliminado = await productosModel.deleteProducto(id);

  if (!productoEliminado) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }

  return res.json(productoEliminado);
};
