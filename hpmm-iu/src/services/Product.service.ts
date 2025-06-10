import { AxiosInstance } from "axios";
import {
  ProductDetail,
  ProductInterface,
} from "../interfaces/product.interface";

export const GetProductDetailService = async (
  axiosPrivate: AxiosInstance
): Promise<ProductDetail[] | null> => {
  try {
    const response = await axiosPrivate.get(`/product/detail`);
    return response.data.data;
  } catch (error) {
    console.error("Error al recuperar los detalles del producto", error);
    return null;
  }
};

export const GetProductsService = async (
  axiosPrivate: AxiosInstance
): Promise<ProductInterface[] | null> => {
  try {
    const response = await axiosPrivate.get(`/product`);
    return response.data.products;
  } catch (error) {
    console.error("Error al recuperar los productos", error);
    throw error;
  }
};

// Fetch all products with axiosPrivateInstance
export const GetProductByIdService = async (
  id_product: string,
  axiosPrivate: AxiosInstance
): Promise<ProductInterface | undefined> => {
  try {
    const response = await axiosPrivate.get(`product/${id_product}`);
    return response.data.products;
  } catch (error) {
    console.error(`Error al recuperar el producto por ID ${id_product}`, error);
    throw error;
  }
};

// Create product with axiosPrivateInstance
export const PostCreateProductService = async (
  product: ProductInterface,
  axiosPrivate: AxiosInstance
): Promise<ProductInterface> => {
  try {
    const response = await axiosPrivate.post(
      `product`,
      {
        id_subcategory: product.id_subcategory,
        nombre: product.nombre,
        descripcion: product.descripcion,
        stock_actual: product.stock_actual,
        stock_maximo: product.stock_maximo,
        fecha_vencimiento: product.fecha_vencimiento,
        numero_lote: product.numero_lote,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data.products;
  } catch (error) {
    console.error("Error al crear el producto", error);
    throw error;
  }
};

// Update product with axiosPrivateInstance
export const PutUpdateProductService = async (
  id_product: string,
  product: ProductInterface,
  axiosPrivate: AxiosInstance
): Promise<void> => {
  await axiosPrivate.put(
    `/product/${id_product}`,
    {
      id_product: product.id_product,
      id_subcategory: product.id_subcategory,
      nombre: product.nombre,
      descripcion: product.descripcion,
      stock_actual: product.stock_actual,
      stock_maximo: product.stock_maximo,
      fecha_vencimiento: product.fecha_vencimiento,
      numero_lote: product.numero_lote,
      estado: product.estado,
      
    },
    { headers: { "Content-Type": "application/json" } }
  );
};

// Delete product with axiosPrivateInstance
export const DeleteProductService = async (
  id_product: string,
  axiosPrivate: AxiosInstance
): Promise<void> => {
  try {
    await axiosPrivate.delete(`/product/${id_product}`);
  } catch (error) {
    console.error("Error al eliminar el producto", error);
    throw error;
  }
};
