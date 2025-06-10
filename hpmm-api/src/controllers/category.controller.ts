import { Request, Response } from "express";
import * as CategoryService from "../services/category.service";
import { asyncWrapper } from "../utils/errorHandler";
import { NewCategory } from "../types/category";


export const getAllCategoryController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const category = await CategoryService.getAllCategoryService();
        res.status(200).json({
            msg: "Categorias buscadas correctamente",
            totalCategory: category.length,
            category,
        });
    }
)

export const getCategoryByIdController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const id_category = (req.params.id || "").trim();
      const category =
        await CategoryService.getCategoryByIdService(id_category);
      if (category.length == 0) {
        res.status(404).json({ msg: "Categoria no encontrada" });
        return;
      }
      res.status(200).json({
        msg: `Categoria encontrada con id_category ${id_category}`,
        category,
      });
    } catch (error) {
      console.error("Error en getDirectionByIdController:", error);
      res.status(500).json({
        msg: "Error interno del servidor",
        error: (error as Error).message,
      });
    }
  }
);

export const createCategoryController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
       const categoryData: NewCategory = req.body;
       const allCategory = await CategoryService.getAllCategoryService();

       if( allCategory.find((category) => category.name === categoryData.name)) {
           res.status(400).json({ msg: "Ya existe una categoria con ese nombre" });
           return;
       }

       const createdCategory = await CategoryService.createCategoryService(categoryData);
       res.status(201).json({
           msg: "Categoria creada correctamente",
           createdCategory
       });
   }
);

export const updateCategoryController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const id_category = (req.params.id || "").trim();
        const { name, descripcion, estado } = req.body;
        const updatedCategory = await CategoryService.updateCategoryService(
            id_category,
            name,
            descripcion,
            estado
        );
        if (!updatedCategory) {
            res.status(404).json({ msg: "Categoria no encontrada" });
            return;
        }
        res.status(200).json({ msg: "Categoria actualizada correctamente", updatedCategory });
    }
)

export const editCategoryController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const id_category = (req.params.id || "").trim();
        const { name, descripcion, estado } = req.body;
        const updatedCategory = await CategoryService.updateCategoryService(
            id_category,
            name,
            descripcion,
            estado
        );
        if (!updatedCategory) {
            res.status(404).json({ msg: "Categoria no encontrada" });
            return;
        }
        res.status(200).json({ msg: "Categoria actualizada correctamente", updatedCategory });
    }
);

export const deleteCategoryController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const id_category = (req.params.id || "").trim();
        const deletedCategory = await CategoryService.deleteCategoryService(id_category);
        if (!deletedCategory) {
            res.status(404).json({ msg: "Categoria no encontrada" });
            return;
        }
        res.status(200).json({ msg: "Categoria eliminada correctamente", deletedCategory });
    }
);