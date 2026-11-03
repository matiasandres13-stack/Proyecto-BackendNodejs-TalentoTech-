# Proyecto Backend Node.js - Talento Tech

API REST de práctica desarrollada con Node.js y Express. Permite consultar, filtrar, crear, actualizar y eliminar productos, además de consultar las categorías disponibles. Los datos se leen y guardan en `data/catalogo.json`.

## Tecnologías

- Node.js con módulos ES (`import`/`export`).
- Express 5 para el servidor y las rutas HTTP.
- CORS habilitado mediante el middleware `cors`.
- Persistencia en un archivo JSON local; no utiliza una base de datos.

## Requisitos

- Node.js y npm instalados.

## Instalación y ejecución

Desde la carpeta raíz del proyecto:

```bash
npm install
npm start
```

El servidor escucha en el puerto `3000` y muestra `http://localhost:3000` al iniciar. Para detenerlo, presiona `Ctrl+C` en la terminal.

Durante el desarrollo, puedes usar el modo watch para que Node reinicie el servidor automáticamente cuando guardes cambios en el código:

```bash
npm run dev
```

`npm start` ejecuta el servidor sin reinicio automático; `npm run dev` está pensado para desarrollar.

## Estructura del proyecto

```text
.
├── data
│   └── catalogo.json
├── index.js
├── package.json
└── SRC
    ├── controladores
    │   └── productos.controladores.js
    ├── modelos
    │   └── productos.modelos.js
    └── rutas
        ├── categorias.rutas.js
        └── productos.rutas.js
```

- `index.js`: configura Express y monta las rutas en `/api/productos` y `/api/categorias`.
- `data/catalogo.json`: contiene los arreglos `productos` y `categorias`.
- `SRC/rutas/`: define los endpoints.
- `SRC/controladores/`: procesa las solicitudes y genera las respuestas.
- `SRC/modelos/`: lee y actualiza los datos del catálogo.

## Endpoints

La URL base local es `http://localhost:3000`. Las respuestas de productos y categorías están en formato JSON.

### Inicio

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| `GET` | `/` | Devuelve un mensaje de bienvenida. |

### Productos

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| `GET` | `/api/productos` | Lista todos los productos. |
| `GET` | `/api/productos?categoriasId=1` | Filtra productos por categoría. |
| `GET` | `/api/productos/:id` | Busca un producto por su ID. |
| `POST` | `/api/productos` | Crea un producto y responde con estado `201`. |
| `PUT` | `/api/productos/:id` | Reemplaza los datos del producto indicado. |
| `DELETE` | `/api/productos/:id` | Elimina el producto indicado. |

#### Listar y filtrar productos

```http
GET http://localhost:3000/api/productos
```

Para filtrar por categoría:

```http
GET http://localhost:3000/api/productos?categoriasId=1
```

El filtro compara el valor de `categoriasId` de cada producto con el parámetro recibido.

#### Consultar un producto

```http
GET http://localhost:3000/api/productos/2
```

Si el ID no es numérico, responde `400`:

```json
{ "error": "ID de producto no valido" }
```

Si el ID no corresponde a un producto, responde `404`:

```json
{ "mensaje": "Producto no encontrado" }
```

#### Crear un producto

Envía el cuerpo como JSON (`Body` → `raw` → `JSON` en Postman):

```http
POST http://localhost:3000/api/productos
Content-Type: application/json
```

```json
{
  "nombre": "Auriculares",
  "precio": 25000,
  "categoriasId": 1
}
```

La respuesta exitosa tiene estado `201` e incluye el producto creado. El ID se asigna automáticamente según el ID más alto del catálogo, por lo que puede variar:

```json
{
  "id": 8,
  "nombre": "Auriculares",
  "precio": 25000,
  "categoriasId": 1
}
```

El ID se calcula a partir del ID más alto que ya existe. Si falta alguno de los campos requeridos, responde `422`:

```json
{ "error": "Faltan datos del producto" }
```

#### Actualizar un producto

`PUT` reemplaza los tres campos del producto. Debes enviar `nombre`, `precio` y `categoriasId`:

```http
PUT http://localhost:3000/api/productos/2
Content-Type: application/json
```

```json
{
  "nombre": "Mouse inalámbrico",
  "precio": 30000,
  "categoriasId": 2
}
```

Si se actualiza correctamente, responde con el producto actualizado:

```json
{
  "id": 2,
  "nombre": "Mouse inalámbrico",
  "precio": 30000,
  "categoriasId": 2
}
```

Si falta un campo requerido, responde `422`; si el ID no existe, responde `404`.

#### Eliminar un producto

```http
DELETE http://localhost:3000/api/productos/2
```

Si se elimina correctamente, la respuesta es el producto eliminado. Si el ID no existe, responde `404`:

```json
{ "mensaje": "Producto no encontrado" }
```

### Categorías

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| `GET` | `/api/categorias` | Lista las categorías guardadas en el catálogo. |

```http
GET http://localhost:3000/api/categorias
```

Respuesta según el catálogo actual:

```json
[
  { "id": 1, "nombre": "Computación" },
  { "id": 2, "nombre": "Periféricos" }
]
```

## Persistencia y alcance

- Los cambios realizados mediante `POST`, `PUT` y `DELETE` se escriben en `data/catalogo.json` y permanecen después de reiniciar el servidor.
- El archivo JSON debe conservar una estructura con las propiedades `productos` y `categorias`.
- El puerto está definido como `3000` en `index.js`.
- Express interpreta los cuerpos JSON, CORS está habilitado y se registra en la consola el método y la URL de cada solicitud.
- El proyecto no incluye autenticación ni una suite de pruebas automatizadas.
