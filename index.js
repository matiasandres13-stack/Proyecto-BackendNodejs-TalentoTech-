import express from "express";
import cors from "cors";

import productosRoutes from "./SRC/rutas/productos.rutas.js";
import categoriasRoutes from "./SRC/rutas/categorias.rutas.js";

const app = express();

app.use(express.json()); // bodyParser middleware
app.use(cors()); // CORS middleware

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Bienvenidos clase 11");
});

app.use("/api/productos", productosRoutes);
app.use("/api/categorias", categoriasRoutes);

const port = 3000;

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
