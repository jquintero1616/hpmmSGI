import { Request, Response } from "express";
import * as VendedorService from "../services/vendedor.service";
import { asyncWrapper } from "../utils/errorHandler";
import { NewVendedor } from "../types/vendedor";

export const getAllVendedorController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const vendedor = await VendedorService.getAllVendedorService();
        res.status(200).json({
            msg: "Vendedores buscados correctamente",
            totalVendedor: vendedor.length,
            vendedor,
        });
    }
);

export const getVendedorByIdController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const id_vendedor = (req.params.id || "").trim();
        const vendedor = await VendedorService.getVendedorByService(id_vendedor);
        if (!vendedor) {
            res.status(404).json({ msg: "Vendedor no encontrado" });
            return;
        }
        res.status(200).json({
            msg: `vendedor encontrado correctamente con id_vendedor ${id_vendedor}`,
            vendedor,
        });
    }
);


export const createVendedorController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const { nombre_contacto, ...rest} = req.body;

        const AllVendedor = await VendedorService.getAllVendedorService();
        if (AllVendedor.some(p => p.nombre_contacto === nombre_contacto)) {
            res
            .status(400)
            .json({ msg: `Ya existe un vendedor con el nombre ${nombre_contacto}`,
            conflictName: nombre_contacto,
        });
        return; 
    } 
    const NewVendedor = await VendedorService.createVendedorService({ nombre_contacto, ...rest });
        res
         .status(201)
        .json({
            msg: `Vendedor creado correctamente con id_vendedor ${NewVendedor.nombre_contacto}`,
            vendedor: NewVendedor,
        });
    }
);



export const updateVendedorController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const id_vendedor = (req.params.id || "").trim();
        const { id_proveedor,
             nombre_contacto,
              correo,
               estado } = req.body;
        const vendedor = await VendedorService.updateVendedorService(id_vendedor,
             id_proveedor,
              nombre_contacto,
               correo,
                estado);
        if (!vendedor) {
            res.status(404).json({ msg: "vendedor no encontrado" });
            return;
        }
        res.status(200).json({
            msg: `vendedor actualizado con id_vendedor ${id_vendedor}`,
            vendedor,
        });
    }
);

export const deleteVendedorController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const id_vendedor = (req.params.id || "").trim();
        const deletedVendedor = await VendedorService.deleteVendedorService(id_vendedor);
        if (!deletedVendedor) {
            res.status(404).json({ msg: "vendedor no encontrado" });
            return;
        }
        res.status(200).json ({ msg: "vendedor eliminado correctamente", deletedVendedor,
        });
    }
);
