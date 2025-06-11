import { AxiosInstance } from "axios";
import { Requi_x_ProductInterface } from "../interfaces/Product_Requisi_interface";

export const GetRequiProductService = async (
  axiosPrivate: AxiosInstance
): Promise<Requi_x_ProductInterface[] | null> => {
  try {
    const response = await axiosPrivate.get("/requiXproduct");
    return response.data.requisis;
  } catch (error) {
    console.error("Error fetching Requi x Product:", error);
    return null;
  }
};

export const GetRequiProductByIdService = async (
  id_requisi_x_product: string,
  axiosPrivate: AxiosInstance
): Promise<Requi_x_ProductInterface | undefined> => {
  try {
    const response = await axiosPrivate.get(
      `/requiXproduct/${id_requisi_x_product}`
    );
    return response.data.newRequisiProduct;
  } catch (error) {
    console.error(
      `Error fetching Requi x Product with ID: ${id_requisi_x_product}`,
      error
    );
    return undefined;
  }
};

export const PostRequiProductService = async (
  requiProduct: Requi_x_ProductInterface,
    axiosPrivate: AxiosInstance
): Promise<Requi_x_ProductInterface> => {
    const response = await axiosPrivate.post(
        `/requiXproduct`,
        {
          id_requisi_x_product: requiProduct.id_requisi_x_product,
          id_requisi: requiProduct.id_requisi,
          id_product: requiProduct.id_product,
          cantidad: requiProduct.cantidad
        },
        {
          headers: {
            "Content-Type": "application/json"
          } 
        }
    );
    return response.data.requisi;

}


export const PutRequiProductService = async (
  id_requisi_x_product: string,
  requiProduct: Requi_x_ProductInterface,
  axiosPrivate: AxiosInstance
): Promise<Requi_x_ProductInterface | undefined> => {
  try {
    const response = await axiosPrivate.put(
      `/requiXproduct/${id_requisi_x_product}`,
      {
        id_requisi_x_product: requiProduct.id_requisi_x_product,
        id_requisi: requiProduct.id_requisi,
        id_product: requiProduct.id_product,
        cantidad: requiProduct.cantidad
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    return response.data.requisi;
  } catch (error) {
    console.error(
      `Error updating Requi x Product with ID: ${id_requisi_x_product}`,
      error
    );
    return undefined;
  }
};
export const DeleteRequiProductService = async (
  id_requisi_x_product: string,
  axiosPrivate: AxiosInstance
): Promise<void> => {
  try {
    await axiosPrivate.delete(`/requiXproduct/${id_requisi_x_product}`);
  } catch (error) {
    console.error(
      `Error deleting Requi x Product with ID: ${id_requisi_x_product}`,
      error
    );
  }
};