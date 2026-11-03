import { readFile, writeFile } from "fs/promises";

const dataURL = new URL("../../data/catalogo.json", import.meta.url);

const readCatalogo = async () => {
  const catalogoJSON = await readFile(dataURL, "utf-8");
  const catalogo = JSON.parse(catalogoJSON);
  return catalogo;
};

const writeCatalogo = async (catalogo) => {
  const catalogoJSON = JSON.stringify(catalogo, null, 2);
  await writeFile(dataURL, catalogoJSON, "utf-8");
};

export const findAllProductos = async (categoriasId) => {
  const { productos } = await readCatalogo();
  if (!categoriasId) {
    return productos;
  }

  return productos.filter((p) => p.categoriasId === parseInt(categoriasId));
};

export const findProductoById = async (id) => {
  const { productos } = await readCatalogo();
  return productos.find((p) => p.id === parseInt(id));
};

export const createProducto = async (nombre, precio, categoriasId) => {
  const catalogo = await readCatalogo();

  const ids = catalogo.productos.map((p) => p.id);
  const siguienteId = Math.max(0, ...ids) + 1;

  const nuevoProducto = {
    id: siguienteId,
    nombre,
    precio,
    categoriasId,
  };

  catalogo.productos.push(nuevoProducto);

  await writeCatalogo(catalogo);

  return nuevoProducto;
};

export const updateProducto = async (id, { nombre, precio, categoriasId }) => {
  const catalogo = await readCatalogo();
  const producto = catalogo.productos.find((p) => p.id === parseInt(id));
  if (!producto) {
    return null; // Producto no encontrado
  }

  producto.nombre = nombre;
  producto.precio = precio;
  producto.categoriasId = categoriasId;

  await writeCatalogo(catalogo);
  return producto;
};

export const deleteProducto = async (id) => {
  const catalogo = await readCatalogo();
  const index = catalogo.productos.findIndex((p) => p.id === parseInt(id));

  if (index === -1) {
    return null; // Producto no encontrado
  }

  const [productoEliminado] = catalogo.productos.splice(index, 1);
  await writeCatalogo(catalogo);
  return productoEliminado; // Retorna el producto eliminado
};
