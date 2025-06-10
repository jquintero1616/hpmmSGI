import { Request, Response } from "express";
import * as pactsService from "../services/pacts.service";
import { asyncWrapper } from "../utils/errorHandler";

export const getAllPactsController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const pacts = await pactsService.getAllPactsService();
    res.status(200).json({
      msg: "Pactos buscados correctamente",
      totalPacts: pacts.length,
      pacts,
    });
  }
);

export const getPactByIdController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_pacts = (req.params.id || "").trim();
    const pact =
      await pactsService.getPactByIdService(id_pacts);

      if (!pact) {
        res.status(404).json({
          msg: `No se encontró ningún pacto con el ID: ${id_pacts}`});
        return;
      }

    res.status(200).json({
      msg: `Pacto encontrado con el ID: ${id_pacts}`,
      pact,
    });
  }
);

export const createPactController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const { name, ...rest } = req.body;

    const allPacts = await pactsService.getAllPactsService();
    if (allPacts.some(p => p.name === name)) {
      res
        .status(400)
        .json({
          msg: `Ya existe un pacto con el nombre: "${name}"`,
          conflictName: name,
        });
      return;  // 
    }

    const newPact = await pactsService.createPactService({ name, ...rest });
    res
      .status(201)
      .json({
        msg: "Info: Pacto creado correctamente",
        pact: newPact,
      });
  }
);



export const updatePactController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_pacts = (req.params.id || "").trim();
    const payload = req.body;
    const updatedPact = await pactsService.updatePactService(id_pacts, payload);
    res
      .status(200)
      .json({ msg: "Pacto actualizado correctamente", updatedPact });
  }
);

export const deletePactController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_pacts = (req.params.id || "").trim();
    const deletedPact = await pactsService.deletePactService(id_pacts);
    res.status(200).json({ msg: "Pacto eliminado correctamente", deletedPact });
  }
);
