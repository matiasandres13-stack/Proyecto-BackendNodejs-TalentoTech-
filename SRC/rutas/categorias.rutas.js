import { Router } from "express";

const router = Router();

const categorias = [
  { id: 1, nombre: "Tecnología" },
  { id: 2, nombre: "Hogar" },
];

router.get("/", (req, res) => {
  res.json(categorias);
});

export default router;
