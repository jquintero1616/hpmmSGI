import { Request, Response } from "express";
import * as DonanteService from "../services/donante.service";
import { asyncWrapper } from "../utils/errorHandler";
import { NewDonante, DonanteFilter } from "../types/donante";

// Obtener todos los donantes
export const getAllDonantesController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const donantes = await DonanteService.getAllDonantesService();
    res.status(200).json({
      msg: "Donantes obtenidos correctamente",
      totalDonantes: donantes.length,
      donantes,
    });
  }
);

// Obtener donantes con filtros y paginación
export const getDonantesFilteredController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const { limit, offset } = req.pagination ?? {};
    const { tipo_donante, estado } = req.query;

    const filters: DonanteFilter = {
      limit,
      offset,
      tipo_donante: tipo_donante as any,
      estado: estado !== undefined ? estado === "true" : undefined,
    };

    const donantes = await DonanteService.getDonantesFilteredService(filters);
    res.status(200).json({
      msg: "Donantes filtrados obtenidos correctamente",
      page: req.pagination?.page,
      limit,
      count: donantes.length,
      donantes,
    });
  }
);

// Obtener donante por ID
export const getDonanteByIdController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_donante = (req.params.id || "").trim();
    const donante = await DonanteService.getDonanteByIdService(id_donante);

    if (!donante) {
      res.status(404).json({ msg: "Donante no encontrado" });
      return;
    }

    res.status(200).json({
      msg: `Donante encontrado con id_donante ${id_donante}`,
      donante,
    });
  }
);

// Crear nuevo donante
export const createDonanteController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const data: NewDonante = req.body;

    // Validaciones básicas
    if (!data.nombre || data.nombre.trim() === "") {
      res.status(400).json({ msg: "El nombre del donante es requerido" });
      return;
    }

    if (!data.tipo_donante) {
      data.tipo_donante = "Persona"; // Valor por defecto
    }

    if (data.estado === undefined) {
      data.estado = true;
    }

    const donante = await DonanteService.createDonanteService(data);
    res.status(201).json({
      msg: "Donante creado correctamente",
      donante,
    });
  }
);

// Actualizar donante
export const updateDonanteController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_donante = (req.params.id || "").trim();
    const data: Partial<NewDonante> = req.body;

    const donante = await DonanteService.updateDonanteService(id_donante, data);

    if (!donante) {
      res.status(404).json({ msg: "Donante no encontrado" });
      return;
    }

    res.status(200).json({
      msg: `Donante actualizado con id_donante ${id_donante}`,
      donante,
    });
  }
);

// Eliminar donante (soft delete)
export const deleteDonanteController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_donante = (req.params.id || "").trim();
    const donante = await DonanteService.deleteDonanteService(id_donante);

    if (!donante) {
      res.status(404).json({ msg: "Donante no encontrado" });
      return;
    }

    res.status(200).json({
      msg: `Donante eliminado con id_donante ${id_donante}`,
      donante,
    });
  }
);

// Buscar donantes por nombre
export const searchDonantesController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const nombre = (req.query.nombre as string) || "";

    if (nombre.trim() === "") {
      res.status(400).json({ msg: "El parámetro de búsqueda es requerido" });
      return;
    }

    const donantes = await DonanteService.searchDonantesByNameService(nombre);
    res.status(200).json({
      msg: "Búsqueda de donantes completada",
      totalDonantes: donantes.length,
      donantes,
    });
  }
);

// Obtener donantes activos (para selects/dropdowns)
export const getDonantesActivosController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const donantes = await DonanteService.getDonantesActivosService();
    res.status(200).json({
      msg: "Donantes activos obtenidos correctamente",
      totalDonantes: donantes.length,
      donantes,
    });
  }
);
