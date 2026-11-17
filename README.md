# API REST de productos

API de práctica desarrollada con Node.js y Express. Permite consultar, crear, actualizar y eliminar productos en Cloud Firestore; consultar categorías desde un archivo JSON local; y registrar usuarios e iniciar sesión con JWT.

## Tecnologías

- Node.js con ES Modules.
- Express 5 y CORS.
- Firebase Web SDK para Cloud Firestore.
- `dotenv` para variables de entorno.
- `bcryptjs` para almacenar contraseñas como hashes.
- `jsonwebtoken` para emitir y verificar JWT.

## Requisitos

- Node.js y npm.
- Un proyecto Firebase con Cloud Firestore configurado.
- Reglas de Firestore compatibles con las operaciones que realiza la aplicación.
- Variables de entorno configuradas para Firebase y JWT.

## Instalación y configuración

Desde la raíz del proyecto:

```bash
npm install
```

Crea un archivo `.env` en la raíz con los valores de tu proyecto Firebase y una clave secreta JWT:

```env
FIREBASE_API_KEY=tu_api_key
FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
FIREBASE_PROJECT_ID=tu_project_id
FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
FIREBASE_APP_ID=tu_app_id
JWT_SECRET=una_clave_larga_y_aleatoria
```

Reemplaza todos los valores de ejemplo. No compartas ni subas `.env` al repositorio. En Vercel, configura esas variables en los ajustes del proyecto, no como archivo versionado.

La aplicación utiliza el SDK web de Firebase; las operaciones siguen sujetas a las reglas de seguridad de Firestore. La autenticación JWT de Express no reemplaza esas reglas.

## Ejecución local

```bash
npm start
```

Para desarrollo con reinicio ante cambios:

```bash
npm run dev
```

El servidor escucha en `http://localhost:3000`. El middleware `express.json()` interpreta cuerpos JSON; no se necesita instalar `body-parser` para este uso.

## Estructura

```text
.
├── data
│   └── catalogo.json
├── index.js
├── package.json
├── vercel.json
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
    │   ├── auth.router.js
    │   ├── categories.routes.js
    │   └── products.routes.js
    └── services
        ├── auth.service.js
        ├── categories.service.js
        └── products.service.js
```

Las rutas asocian URLs con controladores. Los controladores traducen solicitudes y resultados a respuestas HTTP. Los servicios contienen la lógica de la aplicación y llaman a los modelos. Los modelos realizan operaciones con Firestore; el servicio de categorías lee un catálogo local.

El catálogo de categorías se encuentra en `data/catalogo.json` y contiene una propiedad `categorias`, por ejemplo:

```json
{
  "categorias": [
    { "id": 1, "nombre": "Electrónica" },
    { "id": 2, "nombre": "Hogar" },
    { "id": 3, "nombre": "Accesorios" }
  ]
}
```

Los valores de `id` deben coincidir con `categoriasId` usado en los documentos de productos.

## Endpoints

URL base local: `http://localhost:3000`. Las respuestas de error usan la propiedad JSON `error`.

### Inicio

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/` | Público | Mensaje de bienvenida. |

### Autenticación

El router de autenticación está montado bajo `/api/auth`.

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/register` | Público | Registra un usuario. |
| `POST` | `/api/auth/login` | Público | Valida credenciales y devuelve un JWT. |

Registro e inicio de sesión reciben un JSON como:

```json
{
  "email": "persona@example.com",
  "password": "una-clave-de-al-menos-6"
}
```

El registro requiere correo y contraseña de al menos seis caracteres. La contraseña se almacena como hash. En caso de éxito, el registro responde `201`:

```json
{
  "userId": "ID_GENERADO_POR_FIRESTORE",
  "email": "persona@example.com"
}
```

El inicio de sesión responde con un JWT válido durante una hora:

```json
{
  "token": "JWT_DEVUELTO_POR_LA_API"
}
```

Si las credenciales no son válidas, responde `400` con la propiedad `error`. Actualmente los mensajes distinguen los casos mediante los sufijos `1`, `2` y `3`.

### Productos

El router de productos está montado bajo `/api/products`.

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/api/products` | Público | Lista todos los productos. |
| `GET` | `/api/products?categoriasId=1` | Público | Filtra por categoría. |
| `GET` | `/api/products/:id` | Público | Obtiene un producto por su ID. |
| `POST` | `/api/products` | JWT requerido | Crea un producto. |
| `PUT` | `/api/products/:id` | JWT requerido | Actualiza un producto. |
| `DELETE` | `/api/products/:id` | JWT requerido | Elimina un producto. |

Los productos se guardan en la colección `productos_backend` de Firestore. Para filtrar, el campo `categoriasId` debe almacenarse como número.

Las operaciones de escritura requieren el encabezado:

```http
Authorization: Bearer JWT_DEVUELTO_POR_LA_API
```

Ejemplo de creación:

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

`nombre` debe ser texto no vacío, `precio` un número finito mayor o igual a cero y `categoriasId` un entero mayor o igual a cero. Si la validación falla, responde `422`; una creación correcta responde `201`.

Para actualizar, envía los mismos tres campos a `PUT /api/products/:id` con el encabezado Bearer. Para eliminar, envía `DELETE /api/products/:id` con ese encabezado. Si el producto no existe, las operaciones de consulta, actualización o eliminación responden `404`.

Sin un JWT válido, las rutas protegidas responden `401`:

```json
{
  "error": "No autorizado"
}
```

### Categorías

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/api/categories` | Público | Devuelve las categorías del catálogo local. |

## Despliegue en Vercel

El repositorio incluye `vercel.json`, configurado para usar el `index.js` ubicado en la raíz del proyecto.

1. Confirma los cambios y súbelos a la rama del repositorio conectada con Vercel.
2. Configura en Vercel las variables de entorno indicadas en la sección de configuración, incluyendo `JWT_SECRET`. No subas el archivo `.env`.
3. Espera que el despliegue termine en estado `Ready`.
4. Prueba los endpoints con la URL de producción.

La presencia de `vercel.json` por sí sola no confirma que la aplicación esté desplegada. Comprueba el estado del despliegue en el panel de Vercel.

## Consideraciones

- El middleware JWT protege creación, actualización y eliminación de productos. Las consultas de productos y categorías son públicas.
- Firestore se accede mediante el SDK web y requiere reglas de seguridad adecuadas. Para un backend desplegado, evalúa Firebase Admin SDK y una política de acceso apropiada.
- El proyecto no incluye una suite de pruebas automatizadas.
