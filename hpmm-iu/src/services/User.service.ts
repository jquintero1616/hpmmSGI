import { AxiosInstance } from "axios";
import { userInterface } from "../interfaces/user.interface";

export const GetUsersService = async ( axiosPrivate: AxiosInstance ): Promise<userInterface[] | null> => {
  try {
    const response = await axiosPrivate.get(`/users`);
    return response.data.users;
  } catch (error) {
    console.error("Error al recuperar los usuarios", error);
    throw error;
  }
};

// Fetch all users with axiosPrivateInstance
export const GetUserByIdService = async (
  id_user: string,
  axiosPrivate: AxiosInstance
): Promise<userInterface | undefined> => {
  try {
    const response = await axiosPrivate.get<userInterface>(
      `users/${id_user}`
    );

    return response.data;
  } catch (error) {
    console.error("Error al recuperar el usuario", error);
    throw error;
  }
};

//create user with axiosPrivateInstance
// ...existing code...
export const PostCreateUserService = async (
  user: userInterface,
  axiosPrivate: AxiosInstance
): Promise<userInterface> => {
  const response = await axiosPrivate.post(
    `users`,
    {
      username: user.username,
      email: user.email,
      password: user.password,
      id_rol: user.id_rol,
      
    },
    { headers: { "Content-Type": "application/json" } }
  );

  return response.data.user;
};

export const PutUpdateUser = async (
  id_user: string,
  user: userInterface,
  axiosPrivate: AxiosInstance
): Promise<void> => {
  try {
    const { id_rol, username, email, password, estado } = user;
    await axiosPrivate.put(
      `users/${id_user}`,
      { id_rol, username, email, password, estado } // todos los campos directos
    );
  } catch (error) {
    console.error(`Error al actualizar el usuario con id ${id_user}`, error);
    throw error;
  }
};

//delete user with axiosPrivateInstance
export const DeleteUserService = async (id_user: string, axiosPrivate: AxiosInstance): Promise<void> => {
  try {
    await axiosPrivate.delete(`/users/${id_user}`);
  } catch (error) {
    console.error(`Error al eliminar el usuario con id ${id_user}`, error);
    throw error;
  }
};
