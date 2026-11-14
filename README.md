# API REST de productos

API REST de práctica desarrollada con Node.js y Express para administrar productos. Los productos se guardan en Cloud Firestore y las categorías se consultan desde el archivo local `data/catalogo.json`.

## Tecnologías

- Node.js con módulos ES (`import`/`export`).
- Express 5 para el servidor y las rutas HTTP.
- Firebase Web SDK para acceder a Cloud Firestore.
- `dotenv` para cargar la configuración de Firebase desde variables de entorno.
- CORS habilitado mediante el middleware `cors`.

## Requisitos

- Node.js y npm instalados.
- Un proyecto de Firebase con Cloud Firestore creado y configurado.
- Reglas de Firestore que permitan las operaciones solicitadas por la API.

## Instalación y configuración

Desde la carpeta raíz del proyecto, instala las dependencias:

```bash
npm install
```

Crea un archivo `.env` en la raíz y configura las variables requeridas por `SRC/config/firebase.js`:

```env
FIREBASE_API_KEY=tu_api_key
FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
FIREBASE_PROJECT_ID=tu_project_id
FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
FIREBASE_APP_ID=tu_app_id
```

Reemplaza los valores de ejemplo por la configuración de tu aplicación Firebase. No subas el archivo `.env` al repositorio ni compartas credenciales privadas. La configuración del SDK web no sustituye la configuración de seguridad de Firestore: las solicitudes siguen sujetas a sus reglas.

## Ejecución

Inicia el servidor:

```bash
npm start
```

Durante el desarrollo, puedes usar el modo watch:

```bash
npm run dev
```

El servidor escucha en el puerto `3000` y muestra `http://localhost:3000` al iniciar. Para detenerlo, presiona `Ctrl+C` en la terminal.

## Estructura del proyecto

```text
.
├── data
│   └── catalogo.json
├── index.js
├── package.json
└── SRC
    ├── config
    │   └── firebase.js
    ├── controladores
    │   └── productos.controladores.js
    ├── modelos
    │   └── productos.modelos.js
    └── rutas
        ├── categorias.rutas.js
        └── productos.rutas.js
```

- `index.js`: configura Express y monta las rutas en `/api/productos` y `/api/categorias`.
- `SRC/config/firebase.js`: inicializa Firebase usando las variables de entorno.
- `SRC/rutas/`: define los endpoints.
- `SRC/controladores/`: procesa las solicitudes y genera las respuestas.
- `SRC/modelos/productos.modelos.js`: realiza las operaciones CRUD de productos en la colección `productos_backend` de Firestore.
- `data/catalogo.json`: contiene las categorías que devuelve el endpoint de categorías.

## Endpoints

La URL base local es `http://localhost:3000`. Las respuestas se envían en formato JSON, excepto la ruta de inicio.

### Inicio

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| `GET` | `/` | Devuelve el texto `Bienvenidos clase 14`. |

```http
GET http://localhost:3000/
```

Respuesta:

```text
Bienvenidos clase 14
```

### Productos

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| `GET` | `/api/productos` | Lista los productos guardados en Firestore. |
| `GET` | `/api/productos?categoriasId=1` | Filtra los productos por categoría. |
| `GET` | `/api/productos/:id` | Busca un producto por el ID de su documento de Firestore. |
| `POST` | `/api/productos` | Crea un producto en Firestore y responde con estado `201`. |
| `PUT` | `/api/productos/:id` | Actualiza los campos del producto indicado. |
| `DELETE` | `/api/productos/:id` | Elimina el producto indicado. |

#### Listar y filtrar productos

```http
GET http://localhost:3000/api/productos
```

Para filtrar por categoría:

```http
GET http://localhost:3000/api/productos?categoriasId=1
```

El filtro compara el parámetro `categoriasId` con el campo del mismo nombre guardado en cada documento. Mantén ese campo como número en Firestore para que la comparación coincida.

#### Consultar un producto

```http
GET http://localhost:3000/api/productos/ID_DEL_DOCUMENTO
```

Firestore genera automáticamente un ID de documento al crear un producto. Usa ese ID (devuelto por el `POST`) en esta ruta. Si no existe, la API responde `404`:

```json
{ "error": "Producto no encontrado" }
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

La respuesta exitosa tiene estado `201`. El ID es generado por Firestore y se devuelve como una cadena:

```json
{
  "id": "ID_GENERADO_POR_FIRESTORE",
  "nombre": "Auriculares",
  "precio": 25000,
  "categoriasId": 1
}
```

Si falta alguno de los campos requeridos o su valor es falsy (por ejemplo, `0`), la API responde `422`:

```json
{ "error": "Faltan datos del producto" }
```

#### Actualizar un producto

Envía los tres campos requeridos en el cuerpo:

```http
PUT http://localhost:3000/api/productos/ID_DEL_DOCUMENTO
Content-Type: application/json
```

```json
{
  "nombre": "Mouse inalámbrico",
  "precio": 30000,
  "categoriasId": 2
}
```

Si el producto existe, la API responde con sus datos actualizados. Si falta un campo requerido, responde `422`; si el ID no existe, responde `404`.

#### Eliminar un producto

```http
DELETE http://localhost:3000/api/productos/ID_DEL_DOCUMENTO
```

Si se elimina correctamente, la respuesta contiene los datos del producto eliminado. Si el ID no existe, responde `404`.

### Categorías

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| `GET` | `/api/categorias` | Lista las categorías de `data/catalogo.json`. |

```http
GET http://localhost:3000/api/categorias
```

Este endpoint sigue usando el catálogo local; las categorías no se consultan desde Firestore.

## Persistencia y consideraciones

- Los productos se guardan en la colección `productos_backend` de Firestore.
- Las categorías se leen desde `data/catalogo.json`; este endpoint no modifica ese archivo.
- Las operaciones de Firestore requieren conectividad y reglas que permitan el acceso. Un error de permisos (`PERMISSION_DENIED`) debe resolverse en la configuración de Firebase/Firestore.
- El proyecto usa el SDK web de Firebase, por lo que las operaciones están sujetas a las reglas de seguridad de Firestore. No habilites escrituras públicas en un entorno real. Para un backend desplegado, evalúa Firebase Admin SDK y una política de acceso adecuada.
- El puerto está definido como `3000` en `index.js`.
- Express interpreta cuerpos JSON, CORS está habilitado y se registra en la consola el método y la URL de cada solicitud.
- El proyecto no incluye autenticación ni una suite de pruebas automatizadas.
