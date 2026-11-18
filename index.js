import express from "express";
import cors from "cors";

import productsRoutes from "./SRC/routes/products.routes.js";
import authRoutes from "./SRC/routes/auth.router.js";

const app = express();

app.use(express.json()); // bodyParser middleware
app.use(cors()); // CORS middleware

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Proyecto de API REST Matias Fernandez - Comision 26226");
});

app.use("/api/products", productsRoutes);
app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes); // Ruta alternativa para autenticación

// Middleware para rutas inexistentes
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

const port = 3000;

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
}

export default app;
