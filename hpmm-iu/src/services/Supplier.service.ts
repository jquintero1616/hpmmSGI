
import { AxiosInstance } from "axios";
import { suppliersInterface } from "../interfaces/supplier.interface";

export const GetSuppliersService = async (axiosPrivate: AxiosInstance): Promise<
  suppliersInterface[] | null
> => {
  try {
    const response = await axiosPrivate.get(`/supplier`);
    return response.data.suppliers;
  } catch (error) {
    console.error("Error al recuperar los proveedores", error);
    throw error;
  }
};

export const GetSupplierByIdService = async (
  id_supplier: string,
  axiosPrivate: AxiosInstance
): Promise<suppliersInterface | undefined> => {
  try {
    const response = await axiosPrivate.get<suppliersInterface>(
      `supplier/${id_supplier}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al recuperar el proveedor", error);
    throw error;
  }
};

export const PostCreateSupplierService = async (
  supplier: suppliersInterface,
  axiosPrivate: AxiosInstance
): Promise<suppliersInterface> => {
  try {
    const response = await axiosPrivate.post(
      `supplier`,
      {
        numero_contacto: supplier.numero_contacto,
        nombre: supplier.nombre,
        correo: supplier.correo,
        estado: supplier.estado,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data.supplier;
  } catch (error) {
    console.error("Error al crear el proveedor", error);
    throw error;
  }
};

export const PutUpdateSupplierService = async (
  id_supplier: string,
  supplier: suppliersInterface,
  axiosPrivate: AxiosInstance
): Promise<void> => {
  try {
    const { numero_contacto, nombre, correo, estado } = supplier;
    await axiosPrivate.put(`supplier/${id_supplier}`, {
      numero_contacto,
      nombre,
      correo,
      estado,
    });
  } catch (error) {
    console.error("Error al actualizar el proveedor", error);
    throw error;
  }
};

export const DeleteSupplierService = async (
  id_supplier: string,
  axiosPrivate: AxiosInstance
): Promise<void> => {
  try {
    await axiosPrivate.delete(`/supplier/${id_supplier}`);
  } catch (error) {
    console.error("Error al eliminar el proveedor", error);
    throw error;
  }
};
