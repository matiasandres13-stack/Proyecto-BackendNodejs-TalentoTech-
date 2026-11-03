import { Router } from "express";
import { readFile } from "fs/promises";

const router = Router();

const dataURL = new URL("../../data/catalogo.json", import.meta.url);

const readCatalogo = async () => {
  const catalogoJSON = await readFile(dataURL, "utf-8");
  const catalogo = JSON.parse(catalogoJSON);
  return catalogo;
};

router.get("/", async (req, res) => {
  const { categorias } = await readCatalogo();
  res.json(categorias);
});

export default router;
