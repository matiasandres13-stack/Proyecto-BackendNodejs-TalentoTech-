const productos = [
  { id: 1, nombre: "Teclado", precio: 15000, categoriasId: 1 },
  { id: 2, nombre: "Mouse", precio: 8500, categoriasId: 2 },
  { id: 3, nombre: "Monitor", precio: 120000, categoriasId: 1 },
];

export const findAllProductos = (categoriasId) => {
  if (!categoriasId) {
    return productos;
  }

  return productos.filter((p) => p.categoriasId === parseInt(categoriasId));
};

export const findProductoById = (id) => {
  return productos.find((p) => p.id === parseInt(id));
}; 

export const createProducto = (nombre, precio, categoriasId) => {
  const nuevoProducto = {
    id: productos.length + 1,           
    nombre,
    precio,
    categoriasId,
  };

  productos.push(nuevoProducto);
  return nuevoProducto;
}
