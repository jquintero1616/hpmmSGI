import { Request, Response } from "express";
import * as EmployeService from "../services/employes.service";
import { asyncWrapper } from "../utils/errorHandler";
import { NewEmploye } from "../types/employes";

export const getAllController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const employes = await EmployeService.getAllEmployesService();
    res.status(200).json({
      msg: "Empleados buscados correctamente",
      totalEmployes: employes.length,
      employes,
    });
  }
);

export const getByIdController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_employes = (req.params.id || "").trim();
    const employes = await EmployeService.getEmployeByIdService(id_employes);

    if (!employes) {
      res.status(404).json({ msg: "Empleado no encontrado" });
      return;
    }

    res.status(200).json({
      msg: `Empleado encontrado con id_employes ${id_employes}`,
      employes,
    });
  }
);

export const registerEmployesController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const employeData: NewEmploye = req.body;
    const allEmployes = await EmployeService.getAllEmployesService();
    
    if (allEmployes.find((employe) => employe.name === employeData.name)) {
      res.status(403).json({ msg: "El empleado ya existe", employeData });
      return;
    }

    const newEmploye = await EmployeService.createEmployeService(employeData);
    res.status(201).json({
      msg: `Ingresado correctamente nuevo empleado con nombre ${newEmploye.name}`,
      employes: newEmploye,
    });
  }
);

export const UpdateEmployeController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_employes = (req.params.id || "").trim();
    const { name, puesto, email, telefono, estado } = req.body;
    const employes = await EmployeService.updateEmployeService(
      id_employes,
      name,
      puesto,
      email,
      telefono,
      estado
    );

    if (!employes) {
      res.status(404).json({ msg: "Empleado no encontrado" });
      return;
    }

    res.status(200).json({
      msg: `Empleado actualizado con id_employes ${id_employes}`,
      employes,
    });
  }
);

export const deleteEmployeController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_employes = (req.params.id || "").trim();
    const employes =
      await EmployeService.deleteEmployeService(id_employes);

    if (!employes) {
      res.status(404).json({ msg: "Empleado no encontrado" });
      return;
    }

    res.status(200).json({
      msg: `Empleado eliminado con id_employes ${id_employes}, empleado desactivado`,
      employes,
    });
  }
);
