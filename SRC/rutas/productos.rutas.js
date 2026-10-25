import { Router } from "express";

import {
  getProductos,
  getProductoById,
  createProducto,
} from "../controladores/productos.controladores.js";

const router = Router();

router.get("/", getProductos);
router.post("/", createProducto);
router.get("/:id", getProductoById);

export default router;
