import { Router } from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/products.controllers.js";

import { authenticate } from "../middlewares/auth.middelwares.js";

const router = Router();

router.post("/", authenticate, createProduct);

router.get("/", getProducts);
router.get("/:id", getProductById);

router.put("/:id", authenticate, updateProduct);

router.delete("/:id", authenticate, deleteProduct);

export default router;
