import { Request, Response } from "express";
import * as ShoppingService from "../services/supplier.service";
import { asyncWrapper } from "../utils/errorHandler";
import { NewSuppliers } from "../types/suppliers";


export const getAllSuppliersController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const suppliers = await ShoppingService.getAllSuppliersService();
        res.status(200).json({
            msg: "Proveedores buscados correctamente",
            totalSuppliers: suppliers.length,
            suppliers,
        });
    }
)

export const getSuppliersByIdController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const id_supplier = (req.params.id || "").trim();
        const suppliers = await ShoppingService.getSuppliersByIdService(id_supplier);
        if (!suppliers) {
            res.status(404).json({ msg: "Proveedor no encontrado" });
            return;
        }
        res.status(200).json({
            msg: `Proveedor encontrado con id_supplier ${id_supplier}`,
            suppliers,
        });
    }
)

export const createSuppliersController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const data: NewSuppliers = req.body;
        const suppliers = await ShoppingService.createSuppliersService(data);
        res.status(201).json({
            msg: "Proveedor creado correctamente",
            suppliers,
        });
    }
)

export const updateSuppliersController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const id_supplier = (req.params.id || "").trim();
        const { id_contacto, nombre, numero_contacto, correo, estado } = req.body;
        const suppliers = await ShoppingService.updateSuppliersService(id_supplier, id_contacto, nombre, numero_contacto, correo, estado);
        if (!suppliers) {
            res.status(404).json({ msg: "Proveedor no encontrado" });
            return;
        }
        res.status(200).json({
            msg: `Proveedor actualizado con id_supplier ${id_supplier}`,
            suppliers,
        });
    }
)


export const deleteSuppliersController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const id_supplier = (req.params.id || "").trim();
        const suppliers = await ShoppingService.deleteSupplierService(id_supplier);
        if (!suppliers) {
            res.status(404).json({ msg: "Proveedor no encontrado" });
            return;
        }
        res.status(200).json({
            msg: `Proveedor eliminado con id_supplier ${id_supplier}`,
            suppliers,
        });
    }
)