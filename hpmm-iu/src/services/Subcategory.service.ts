import {AxiosInstance} from "axios";
import { SubcategoryInterface } from "../interfaces/subcategory.interface";

export const GetSubcategoriesService = async (axiosPrivate: AxiosInstance): 
Promise<SubcategoryInterface[] | null
> => {
    try {
        const response = await axiosPrivate.get("/subcategory");
        return response.data.subcategory;
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        return null;
    }
};

export const GetSubcategoryByIdService = async (
    id_subcategory: string,
    axiosPrivate: AxiosInstance
): Promise<SubcategoryInterface | undefined> => {
    try {
        const response = await axiosPrivate.get(
            `/subcategory/${id_subcategory}`
        );
        return response.data.subcategory;
    } catch (error) {
        console.error(
            `Error fetching subcategory with ID: ${id_subcategory}`,
            error
        );
        return undefined;
    }
};

export const PostCreateSubcategoryService = async (
    subcategory: SubcategoryInterface,
    axiosPrivate: AxiosInstance
): Promise<SubcategoryInterface> => {
    const response = await axiosPrivate.post(
        `/subcategory`,
        {
            id_subcategory: subcategory.id_subcategory,
            nombre: subcategory.nombre,
            estado: subcategory.estado,
            id_category: subcategory.id_category,
        },
        {headers: {"Content-Type": "application/json"}}
    );

    return response.data.subcategory;
};

export const PutUpdateSubcategoryService = async (
    id_subcategory: string, 
    subcategory: SubcategoryInterface,
    axiosPrivate: AxiosInstance
): Promise<void> => {
    await axiosPrivate.put
    (`/subcategory/${id_subcategory}`,
        {
            
            id_category: subcategory.id_category,
            nombre: subcategory.nombre,
            estado: subcategory.estado,
        },
        {headers: {"Content-Type": "application/json"}}
    );
};

export const DeleteSubcategoryService = async (
    id_subcategory: string,
    axiosPrivate: AxiosInstance
): Promise<void> => {
    await axiosPrivate.delete(`/subcategory/${id_subcategory}`);
};