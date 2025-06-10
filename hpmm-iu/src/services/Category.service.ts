import { AxiosInstance } from "axios";
import { CategoryInterface } from "../interfaces/Category.interface";

export const GetCategoriesService = async (axiosPrivate: AxiosInstance): Promise<
  CategoryInterface[] | null
> => {
  try {
    const response = await axiosPrivate.get(`/category`);
    return response.data.category;
  } catch (error) {
    console.error("Error al recuperar las categorías", error);
    return null;
  }
};

export const GetCategoryByIdService = async (
  id_category: string,
  axiosPrivate: AxiosInstance
): Promise<CategoryInterface | undefined> => {
  try {
    const response = await axiosPrivate.get<CategoryInterface>(
      `/category/${id_category}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error al recuperar la categoría con ID: ${id_category}`,
      error
    );
    return undefined;
  }
};

export const PostCreateCategoryService = async (
  category: CategoryInterface,
  axiosPrivate: AxiosInstance
): Promise<CategoryInterface> => {
  const response = await axiosPrivate.post(
    `/category`,
    {
      id_category: category.id_category,
      name: category.name,
      descripcion: category.descripcion,
      estado: category.estado,
    },
    { headers: { "Content-Type": "application/json" } }
  );

  return response.data.createdCategory;
};

export const PutUpdateCategoryService = async (
  id_category: string,
  category: CategoryInterface,
  axiosPrivate: AxiosInstance
): Promise<void> => {
  await axiosPrivate.put(
    `/category/${id_category}`,
    {
      id_category: category.id_category,
      name: category.name,
      descripcion: category.descripcion,
      estado: category.estado,
    },
    { headers: { "Content-Type": "application/json" } }
  );
  
};

export const DeleteCategoryService = async (
  id_category: string,
  axiosPrivate: AxiosInstance
): Promise<void> => {
  try {
    await axiosPrivate.delete(`/category/${id_category}`);
  } catch (error) {
    console.error(`Error al eliminar la categoría con ID: ${id_category}`, error);
  }
};
