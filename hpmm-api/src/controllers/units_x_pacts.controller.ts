import { Request, Response } from "express";
import * as RolunitPactService from "../services/units_x_pacts.service";
import { asyncWrapper } from "../utils/errorHandler";
import { NewUnitPact } from "../types/units_x_pacts";

export const getAllController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const unitPacts = await RolunitPactService.getUnitPactService();
    res.status(200).json({
      msg: "Unidades y pacts encontradas correctamente",
      totalUnitPacts: unitPacts.length,
      unitPacts,
    });
  }
);

export const getByIdController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_unit_pacts = (req.params.id || "").trim();
    const unitPact =
      await RolunitPactService.getUnitPactByIdService(id_unit_pacts);

    if (!unitPact) {
      res.status(404).json({ msg: "Unidad y pacto no encontrada" });
      return;
    }

    res
      .status(200)
      .json({
        msg: `Unidad y pacto encontrada con id_unit_pacts ${id_unit_pacts}`,
        unitPact,
      });
  }
);

export const registerUnitPactController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const payload: NewUnitPact = req.body;
    const newUnitPact = await RolunitPactService.createUnitPactService(payload);
    res
      .status(200)
      .json({ msg: "Unidad y pacto creada correctamente", newUnitPact });
  }
);

export const editUnitPacts = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_unit_pacts = (req.params.id || "").trim();
    const { data } = req.body;
    const updatedUnitPact =
      await RolunitPactService.updateUnitPactService(
        id_unit_pacts,
        data
     );

    if (!updatedUnitPact) {
      res.status(404).json({ msg: "Unidad y pacto no encontrada" });
      return;
    }

    res.status(200).json({
      msg: `Unidad y pacto actualizada correctamente ${id_unit_pacts}`,
      updatedUnitPact,
    });
  }
);
