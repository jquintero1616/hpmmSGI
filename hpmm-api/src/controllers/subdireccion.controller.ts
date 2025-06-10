import { Request, Response } from "express";
import * as SubdireccionService from "../services/subdireccion.service";
import { asyncWrapper } from "../utils/errorHandler";


export const getAllSubdireccionesController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const subdirecciones =
      await SubdireccionService.getAllSubdireccionesService();
    res.status(200).json({
      msg: "Subdirecciones buscadas correctamente",
      totalSubdirecciones: subdirecciones.length,
      subdirecciones,
    });
  }
);

export const getSubdireccionByIdController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
     const { id_subdireccion, ...rest} = req.body;
     const subdireccion = await SubdireccionService.getAllSubdireccionesService();
     if (!subdireccion) {
      res.status(404).json({ msg: "No hay subdirecciones registradas" });
      return;
     }
     res.status(200).json({
      msg: `Subdirecciones encontradas correctamente`,
      subdireccion });
     }
);


export const CreateSubdireccionController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const { nombre, ...rest} = req.body; 

    const AllSubDireccion = await SubdireccionService.getAllSubdireccionesService();
    if (AllSubDireccion.some(sd => sd.nombre === nombre)) {
      res
      .status(403)
      .json({ msg: `Ya existe una subdireccion con el nombre ${nombre}`,
        conflictName: nombre
      });
      return;
    }

    const newSubdireccion = await SubdireccionService.createSubdireccionService({ nombre, ...rest });
    res.status(201).json({
      msg: "Subdireccion creada correctamente",
      NewSubdireccion: newSubdireccion,
    });
  }
);

export const UpdateSubdireccionController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_subdireccion = (req.params.id || "").trim();
    const { nombre,estado } = req.body;
    const updatedSubdireccion =
      await SubdireccionService.updateSubdireccionService(
        id_subdireccion,
        nombre,
        estado
        
      );

    if (!updatedSubdireccion) {
      res.status(404).json({ msg: "Subdireccion no encontrada" });
      return;
    }

    res
      .status(200)
      .json({
        msg: "Subdireccion actualizada correctamente",
        updatedSubdireccion,
      });
  }
);

export const deleteSubdireccionController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_subdireccion = (req.params.id || "").trim();
    const deletedSubdireccion =
      await SubdireccionService.deleteSubdireccionService(id_subdireccion);

    if (!deletedSubdireccion) {
      res.status(404).json({ msg: "Subdireccion no encontrada" });
      return;
    }

    res
      .status(200)
      .json({
        msg: "Subdireccion eliminada correctamente",
        deletedSubdireccion,
      });
  }
);
