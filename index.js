import express from "express";
import cors from "cors";

import productsRoutes from "./SRC/routes/products.routes.js";
import categoriesRoutes from "./SRC/routes/categories.routes.js";
import authRoutes from "./SRC/routes/auth.router.js";

const app = express();

app.use(express.json()); // bodyParser middleware
app.use(cors()); // CORS middleware

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Bienvenidos clase 15");
});

app.use("/api/products", productsRoutes);
app.use(categoriesRoutes);
app.use("/api/auth", authRoutes);

const port = 3000;

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
