import  { AxiosInstance } from "axios";
import { DirectionInterface } from "../interfaces/direction.interface";



export const GetDirectionService = async (
  axiosPrivate: AxiosInstance
): Promise<DirectionInterface[] | null> => {
  try {
    const response = await axiosPrivate.get("/direction");
    return response.data.directions;
  } catch (error) {
    console.error("Error fetching direction:", error);
    throw error;
  }
};

export const GetDirectionByIdService = async (
  axiosPrivate: AxiosInstance,
  id_direction: string
): Promise<DirectionInterface | undefined> => {
    try {
        const response = await axiosPrivate.get(`/direction/${id_direction}`);
        return response.data.direction;
    } catch (error) {
        console.error(`Error fetching direction by ID: ${id_direction}`, error);
        throw error;
    }
};

export const PostCreateDirectionService = async (
    axiosPrivate: AxiosInstance,
    direction: DirectionInterface
): Promise<DirectionInterface> => {
    const response = await axiosPrivate.post(
        "/direction",
        {
            id_direction: direction.id_direction,
            nombre: direction.nombre,
            estado: direction.estado,
        },
        { headers: { "Content-Type": "application/json" } }
    );
    return response.data.newDirection;
};

export const PutUpdateDirectionService = async (
    id_direction: string,
    direction: DirectionInterface,
    axiosPrivate: AxiosInstance
): Promise<void> => {
    await axiosPrivate.put(
        `/direction/${id_direction}`,
        {
            id_direction: direction.id_direction,
            nombre: direction.nombre,
            estado: direction.estado,
        },
        { headers: { "Content-Type": "application/json" } }
    );
};

export const DeleteDirectionService = async (
    id_direction: string,
    axiosPrivate: AxiosInstance
): Promise<void> => {
    try {
        const response = await axiosPrivate.delete(`/direction/${id_direction}`);
        return response.data.deletedDirection;
    } catch (error) {
        console.error(`Error deleting direction: ${id_direction}`, error);
        throw error;
    }
};