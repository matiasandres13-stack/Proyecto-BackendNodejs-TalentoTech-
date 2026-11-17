import * as categoriesService from "../services/categories.service.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await categoriesService.getCategories();
    return res.json(categories);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error al obtener las categorías" });
  }
};
