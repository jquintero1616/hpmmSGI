import { Request, Response } from "express";
import * as SubcategoryService from "../services/subcategory.service";
import { asyncWrapper } from "../utils/errorHandler";
import { NewSubcategory } from "../types/subcategory";

export const getAllsubcategoryController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const subcategory = await SubcategoryService.getAllsubcategoryService();
        res.status(200).json({
            msg: "Subcategorias buscadas correctamente",
            totalSubcategories: subcategory.length,
            subcategory: subcategory,
        });
    }
);

export const getsubcategoryByidcontroller = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const id_subcategory = (req.params.id || "").trim();
        const subcategory = await SubcategoryService.getSubcategoryByIdService(id_subcategory);        
        if (!subcategory) {
            res.status(404).json({ msg: "Subcategoria no encontrada" });
            return;
        }
        res.status(200).json({ 
            msg: `Subcategoria encontrada con id_subcategory 
            ${id_subcategory}`, subcategory }); 
        }
)

export const createSubcategoryController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const { nombre, ...rest } = req.body;

        const AllSubCategory = await SubcategoryService.getAllsubcategoryService();
        if (AllSubCategory.some (p => p.nombre ===nombre)){
            res 
            .status(400)
            .json ({
             msg:`La subcategoria con el nombre ${nombre} ya existe`,
            conflictName: nombre,
        });
            return;
        }

        const NewSubcategory = await SubcategoryService.createSubcategoryService({ nombre, ...rest });
        res 
        .status(201)
        .json({ 
            msg: `Subcategoria ${NewSubcategory.nombre} creada correctamente`,
            subcategory: NewSubcategory,
        });
    }
);

export const editSubcategoryController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const id_subcategory = (req.params.id || "").trim();
        const { nombre, estado, id_category } = req.body;
        const updatedSubcategory = await SubcategoryService.updateSubcategoryService(
            id_subcategory,
            
            nombre,
            estado,
            id_category 
            
        );
        if (!updatedSubcategory) {
            res.status(404).json({ msg: "Subcategoria no encontrada" });
            return;
        }
        res.status(200).json({ msg: "Subcategoria actualizada correctamente", updatedSubcategory });
    }
);


export const updateSubcategoryController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const id_subcategory = (req.params.id || "").trim();
        const { nombre,estado, id_category } = req.body;
        const updatedSubcategory = await SubcategoryService.updateSubcategoryService(
            id_subcategory,
            
            nombre,
            estado,
            id_category
        );
        if (!updatedSubcategory) {
            res.status(404).json({ msg: "Subcategoria no encontrada" });
            return;
        }
        res.status(200).json({ msg: "Subcategoria actualizada correctamente", updatedSubcategory });
    }
)

export const deleteSubcategoryController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const id_subcategory = (req.params.id || "").trim();
        const deletedSubcategory = await SubcategoryService.deleteSubcategoryService(id_subcategory);
        if (!deletedSubcategory) {
            res.status(404).json({ msg: "Subcategoria no encontrada" });
            return;
        }
        res.status(200).json({ msg: "Subcategoria eliminada correctamente", deletedSubcategory });
    }
);