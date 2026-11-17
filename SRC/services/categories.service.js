import { readFile } from "fs/promises";

const dataURL = new URL("../../data/catalogo.json", import.meta.url);

export const getCategories = async () => {
  const catalogoJSON = await readFile(dataURL, "utf-8");
  const catalogo = JSON.parse(catalogoJSON);
  return catalogo.categorias;
};
