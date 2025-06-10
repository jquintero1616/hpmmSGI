import { Request, Response } from "express";
import * as ProductService from "../services/product.service";
import { asyncWrapper } from "../utils/errorHandler";
import { NewProduct } from "../types/product";

export const getProductDetailsController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const { limit, offset } = req.pagination ?? {};
    const raw = req.query.status;
    const statuses = raw
      ? Array.isArray(raw)
        ? (raw as string[])
        : [raw as string]
      : [true, false];

    const data = await ProductService.getProductDetailService({
      limit,
      offset,
      statuses: statuses as any,
    });
    res.status(200).json({
      msg: "Productos obtenidos correctamente",
      page: req.pagination?.page,
      limit,
      count: data.length,
      data,
    });
  }
);

export const getAllProductController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const products = await ProductService.getAllProductService();
    res.status(200).json({
      msg: "Productos buscados correctamente",
      totalProducts: products.length,
      products,
    });
  }
);

export const getByIdProductoController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_product = (req.params.id || "").trim();
    const products = await ProductService.getProductoByIdService(id_product);

    if (!products) {
      res.status(404).json({ msg: "Producto no encontrado" });
      return;
    }

    res.status(200).json({
      msg: `Producto encontrado con id_product ${id_product}`,
      products,
    });
  }
);

export const createProductController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const Products: NewProduct = req.body;
    const products = await ProductService.createProductService(Products);
    res.status(201).json({
      msg: `ingresado correctamente nuevo producto con nombre: ${Products.nombre}`,
      products,
    });
  }
);

export const updateProductController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_product = (req.params.id || "").trim();
    const {
      nombre,
      id_subcategory,
      descripcion,
      stock_actual,
      stock_maximo,
      fecha_vencimiento,
      numero_lote,
      estado,
    } = req.body;
    const updatedProduct = await ProductService.updateProductService(
      id_product,
      id_subcategory,
      nombre,
      descripcion,
      stock_actual,
      stock_maximo,
      fecha_vencimiento,
      numero_lote,
      estado
    );
    if (!updatedProduct) {
      res.status(404).json({ msg: "Producto no encontrado" });
      return;
    }
    res.status(200).json({
      msg: `Producto actualizado con id_product ${id_product}`,
      updatedProduct,
    });
  }
);

export const deleteProductController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_product = (req.params.id || "").trim();
    const deletedProduct =
      await ProductService.deleteProductService(id_product);
    if (!deletedProduct) {
      res.status(404).json({ msg: "Producto no encontrado" });
      return;
    }
    res.status(200).json({
      msg: `Producto eliminado con id_product ${id_product}`,
      deletedProduct,
    });
  }
);
