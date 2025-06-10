import { Request, Response } from "express";
import * as UnitService from "../services/unit.service";
import { asyncWrapper } from "../utils/errorHandler";
import { NewUnit } from "../types/units";

export const getAllUnitsController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const units = await UnitService.getAllUnitsService();
    res.status(200).json({
      msg: `Unidades encontradas correctamente : ${units.length}`,
      units,
    });
  }
);

export const getUnitByIdController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const id_units = (req.params.id || "").trim();
        const units = await UnitService.getUnitByIdService(id_units);
    
        if (!units) {
            res.status(404).json({ 
            msg: `No se encontro ninguna unidad con el id_units proporcionado ${units}` });
            return;
        }
    
        res.status(200).json({ msg: `Unidad encontrada con id_units ${id_units}`, units });
        }
);


export const registerUnitController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const { name, ...rest } = req.body;
   const  AllUnits = await UnitService.getAllUnitsService();
  if (AllUnits.some((unit) => unit.name === name)) {
    res 
    .status(400)
    .json({ msg: `La unidad con el nombre ${name} ya existe`, 
      conflictName: name 
    });
  return;
  }

  const NewUnit = await UnitService.createUnitService({ name, ...rest });
  res
    .status(201)
    .json({
      msg: `Unidad registrada correctamente`,
      newUnit: NewUnit,
    });

  }
);

export const editUnitController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_units = (req.params.id || "").trim();
    const { name, estado } = req.body;
    const updatedUnit = await UnitService.updateUnitService(
      id_units,
      name,
      estado
    );

    if (!updatedUnit) {
      res.status(404).json({ msg: "Unidad no encontrada" });
      return;
    }

    res.status(200).json({ msg: `Unidad actualizada correctamente ${id_units}`, updatedUnit });
  }
);

export const deleteUnitController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_units = (req.params.id || "").trim();
    const deactivatedUnit = await UnitService.deleteUnitService(id_units);

    if (!deactivatedUnit) {
      res.status(404).json({ msg: "Unidad no encontrada" });
      return;
    }

    res.status(200).json({ msg: `Unidad desactivada correctamente ${id_units}`, deactivatedUnit });
  }
);  



