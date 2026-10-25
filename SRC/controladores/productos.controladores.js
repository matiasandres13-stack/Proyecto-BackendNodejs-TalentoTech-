import * as productosModel from "../modelos/productos.modelos.js";

export const getProductos = (req, res) => {
  const categoriasId = req.query.categoriasId;
  const categoriasIdfiltrado = productosModel.findAllProductos(categoriasId);
  res.json(categoriasIdfiltrado);
};

export const getProductoById = (req, res) => {
  const productosId = parseInt(req.params.id);

  if (isNaN(productosId)) {
    return res.status(400).json({ error: "ID de producto no valido" });
  }

  const productoEncontrado = productosModel.findProductoById(productosId);
  if (!productoEncontrado) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }
  res.json(productoEncontrado);
};

export const createProducto = (req, res) => {
  const { nombre, precio, categoriasId } = req.body;

  if (!nombre || !precio || !categoriasId) {
    return res.status(422).json({ error: "Faltan datos del producto" });
  }

  const nuevoProducto = productosModel.createProducto(
    nombre,
    precio,
    categoriasId,
  );

  res.status(201).json(nuevoProducto);
};
