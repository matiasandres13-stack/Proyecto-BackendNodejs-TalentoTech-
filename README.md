# API REST de productos

API de práctica desarrollada con Node.js y Express para consultar y administrar productos en Cloud Firestore, consultar categorías desde un archivo JSON local y registrar e iniciar sesión con tokens JWT.

## Tecnologías

- Node.js con módulos ES (`import`/`export`).
- Express 5 para el servidor y las rutas HTTP.
- Firebase Web SDK para acceder a Cloud Firestore.
- `dotenv` para cargar variables de entorno desde `.env`.
- `bcryptjs` para guardar contraseñas como hashes.
- `jsonwebtoken` para emitir y verificar tokens JWT.
- `cors` para habilitar solicitudes de otros orígenes.

## Requisitos

- Node.js y npm instalados.
- Un proyecto de Firebase con Cloud Firestore configurado.
- Reglas de Firestore compatibles con las operaciones que realiza la aplicación.
- Un archivo `.env` con la configuración de Firebase y una clave para firmar tokens.

## Instalación y configuración

Desde la raíz del proyecto, instala las dependencias:

```bash
npm install
```

Crea un archivo `.env` en la raíz del proyecto:

```env
FIREBASE_API_KEY=tu_api_key
FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
FIREBASE_PROJECT_ID=tu_project_id
FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
FIREBASE_APP_ID=tu_app_id
JWT_SECRET=reemplazar_por_una_clave_larga_y_aleatoria
```

Completa los valores de Firebase con la configuración de tu proyecto. `JWT_SECRET` debe ser una clave propia, larga y aleatoria; no uses el valor de ejemplo. No subas `.env` al repositorio ni compartas su contenido.

La aplicación usa el SDK web de Firebase. Las operaciones de Firestore siguen sujetas a las reglas de seguridad configuradas en Firebase; la autenticación JWT de esta API no reemplaza esas reglas.

## Ejecución

Inicia el servidor:

```bash
npm start
```

Para desarrollo, con reinicio al detectar cambios:

```bash
npm run dev
```

El servidor escucha en `http://localhost:3000`. Para detenerlo, presiona `Ctrl+C` en la terminal.

## Estructura del proyecto

```text
.
├── .env                  # Configuración local; no se versiona
├── index.js              # Configuración de Express y montaje de rutas
├── package.json
├── README.md
└── SRC
    ├── config
    │   └── firebase.js
    ├── controllers
    │   ├── auth.controllers.js
    │   ├── categories.controllers.js
    │   └── products.controllers.js
    ├── middlewares
    │   └── auth.middelwares.js
    ├── models
    │   ├── products.models.js
    │   └── user.model.js
    ├── routes
        ├── auth.router.js
        ├── categories.routes.js
        └── products.routes.js
    └── services
        ├── auth.service.js
        ├── categories.service.js
        └── products.service.js
```

Los controladores reciben las solicitudes HTTP y construyen las respuestas. Los servicios ejecutan la lógica de la aplicación y llaman a los modelos cuando necesitan leer o guardar datos. Los modelos se encargan de las operaciones con Firestore; el servicio de categorías lee el catálogo local.

Las rutas de categorías esperan además el archivo `data/catalogo.json` en la raíz del proyecto, con una propiedad `categorias`, por ejemplo:

```json
{
  "categorias": []
}
```

Si ese archivo no existe o no contiene JSON válido, `GET /api/categories` responderá con estado `500`.

## Endpoints

La URL base local es `http://localhost:3000`. Los cuerpos y las respuestas de la API usan JSON, excepto la ruta de inicio. Las respuestas de error usan la clave `error`.

### Inicio

| Método | Ruta | Acceso | Descripción |
| ------ | ---- | ------ | ----------- |
| `GET` | `/` | Público | Devuelve el mensaje de bienvenida. |

```http
GET http://localhost:3000/
```

Respuesta:

```text
Bienvenidos clase 15
```

### Autenticación

| Método | Ruta | Acceso | Descripción |
| ------ | ---- | ------ | ----------- |
| `POST` | `/api/auth/register` | Público | Registra una cuenta. |
| `POST` | `/api/auth/login` | Público | Verifica las credenciales y devuelve un JWT. |

#### Registrar una cuenta

Envía el cuerpo como JSON:

```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json
```

```json
{
  "email": "persona@example.com",
  "password": "una-clave-de-al-menos-6"
}
```

Al registrarse correctamente, responde con estado `201`:

```json
{
  "userId": "ID_GENERADO_POR_FIRESTORE",
  "email": "persona@example.com"
}
```

La contraseña se guarda como hash. El correo y la contraseña son obligatorios; la contraseña debe tener al menos 6 caracteres. Si faltan o no cumplen la validación, responde con estado `400` y un objeto con la clave `error`. Si el correo ya está registrado, responde también `400` con esa misma estructura.

#### Iniciar sesión

Envía el mismo correo y contraseña que se registraron:

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json
```

```json
{
  "email": "persona@example.com",
  "password": "una-clave-de-al-menos-6"
}
```

Si las credenciales son válidas, responde con un token que vence en una hora:

```json
{
  "token": "JWT_DEVUELTO_POR_LA_API"
}
```

Si el correo o la contraseña no son válidos, el endpoint responde `400` con un objeto como `{"error":"Correo electrónico o contraseña incorrectos"}`. No compartas el token.

### Productos

| Método | Ruta | Acceso | Descripción |
| ------ | ---- | ------ | ----------- |
| `GET` | `/api/products` | Público | Lista los productos. |
| `GET` | `/api/products?categoriasId=1` | Público | Filtra por categoría. |
| `GET` | `/api/products/:id` | Público | Busca un producto por el ID de Firestore. |
| `POST` | `/api/products` | Requiere JWT | Crea un producto. |
| `PUT` | `/api/products/:id` | Requiere JWT | Actualiza un producto. |
| `DELETE` | `/api/products/:id` | Requiere JWT | Elimina un producto. |

Los productos se guardan en la colección `productos_backend` de Firestore. Para filtrar, el campo `categoriasId` de cada producto debe ser numérico.

#### Crear un producto

Incluye el token obtenido al iniciar sesión y envía el cuerpo como JSON:

```http
POST http://localhost:3000/api/products
Content-Type: application/json
Authorization: Bearer JWT_DEVUELTO_POR_LA_API
```

```json
{
  "nombre": "Auriculares",
  "precio": 25000,
  "categoriasId": 1
}
```

Si se crea correctamente, responde con estado `201` e incluye el ID generado por Firestore. Si faltan datos o se envían valores no permitidos por la validación actual, responde `422`.

#### Consultar un producto

```http
GET http://localhost:3000/api/products/ID_DEL_DOCUMENTO
```

Si el ID no existe, responde `404`:

```json
{
  "error": "Producto no encontrado"
}
```

#### Actualizar un producto

```http
PUT http://localhost:3000/api/products/ID_DEL_DOCUMENTO
Content-Type: application/json
Authorization: Bearer JWT_DEVUELTO_POR_LA_API
```

Envía `nombre`, `precio` y `categoriasId` en el cuerpo JSON. Si el producto no existe, responde `404`; si faltan datos, responde `422`.

#### Eliminar un producto

```http
DELETE http://localhost:3000/api/products/ID_DEL_DOCUMENTO
Authorization: Bearer JWT_DEVUELTO_POR_LA_API
```

Si el producto no existe, responde `404`. Si se elimina correctamente, devuelve los datos del producto eliminado.

Las rutas protegidas requieren el encabezado:

```text
Authorization: Bearer JWT_DEVUELTO_POR_LA_API
```

Sin un token válido, el middleware responde `401` con un objeto como `{"error":"No autorizado"}`.

### Categorías

| Método | Ruta | Acceso | Descripción |
| ------ | ---- | ------ | ----------- |
| `GET` | `/api/categories` | Público | Devuelve las categorías de `data/catalogo.json`. |

```http
GET http://localhost:3000/api/categories
```

## Consideraciones

- Las categorías se leen desde el archivo local `data/catalogo.json`; no se guardan en Firestore.
- El middleware JWT protege las operaciones de creación, actualización y eliminación de productos. Las consultas de productos y categorías son públicas.
- Firestore se accede con el SDK web, por lo que las reglas de seguridad de la base siguen siendo necesarias. Para un backend desplegado, evalúa Firebase Admin SDK y una política de acceso adecuada.
- El servidor registra en la consola el método y la URL de cada solicitud.
- El proyecto no incluye una suite de pruebas automatizadas.
