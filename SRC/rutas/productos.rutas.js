import { Router } from "express";

import {
  getProductos,
  getProductoById,
  createProducto,
  deleteProducto,
  updateProducto,
} from "../controladores/productos.controladores.js";

const router = Router();

router.post("/", createProducto);
router.get("/", getProductos);
router.get("/:id", getProductoById);
router.put("/:id", updateProducto);
router.delete("/:id", deleteProducto);

export default router;
