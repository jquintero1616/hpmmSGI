import { Request, Response } from "express";
import * as DirectionService from "../services/direction.service";
import { asyncWrapper } from "../utils/errorHandler";


export const getAllDirectionController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const directions = await DirectionService.getAllDirectionService();
    if (directions.length == 0) {
      res.status(400).json({
        msg: "Direcciones no encontradas",
        totalDirections: directions.length,
        directions,
      });
      return;
    }

    res.status(200).json({
      msg: "Direcciones buscadas correctamente",
      totalDirections: directions.length,
      directions,
    });
  }
);

export const getDirectionByIdController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_direction = (req.params.id || "").trim();
    const direction =
      await DirectionService.getDirectionByIdService(id_direction);

    if (direction.length == 0) {
      res.status(404).json({ msg: "Direccion no encontrada" });
      return;
    }

    res.status(200).json({
      msg: `Direccion encontrada con id_direction ${id_direction}`,
      direction,
    });
  }
);

export const CreateDirectionController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const { nombre, ...rest } = req.body;

    const AllDirection = await DirectionService.getAllDirectionService();
    if (AllDirection.some(d => d.nombre === nombre)) {
      res.status(400).json({
        msg: `Ya existe una direccion con el nombre ${nombre}`,
        conflictName: nombre
      });
      return;
    }

    const newDirection = await DirectionService.createDirectionService({ nombre, ...rest });
    res.status(201).json({
      msg: 'Info: direccion creada correctamente ',
      newDirection
    });
  }
);
  
export const UpdateDirectionController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_direction = (req.params.id || "").trim();
    const { nombre, estado } = req.body;
    const updatedDirection = await DirectionService.updateDirectionService(
      id_direction,
      nombre,
      estado
    );

    if (!updatedDirection) {
      res.status(404).json({ msg: "Direccion no encontrada" });
      return;
    }

    res.status(200).json({
      msg: `Direccion editada con id_direction ${id_direction}`,
      updatedDirection,
    });
  }
);

export const deleteDirectionController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_direction = (req.params.id || "").trim();
    const deletedDirection =
      await DirectionService.deleteDirectionService(id_direction);

    if (!deletedDirection) {
      res.status(404).json({ msg: "Direccion no encontrada" });
      return;
    }

    res.status(200).json({
      msg: `Direccion eliminada con id_direction ${id_direction}`,
      deletedDirection,
    });
  }
);
