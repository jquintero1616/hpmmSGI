import axiosPublic from "../helpers/axiosInstance";

export const authenticateUser = async (
  email: string,
  password: string
): Promise<{ username: string; id_rol: string, id_user: string, employe_name: string, role_name: string }> => {
  try {
    const response = await axiosPublic().post("/login", { email, password });
    
    return {
      username: response.data.username,
      id_rol: response.data.id_rol,
      id_user: response.data.id_user,
      employe_name: response.data.employe_name,
      role_name: response.data.role_name,
    };
  } catch (error) {
    console.error("Error al autenticar al usuario", error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  await axiosPublic().post("/logout");
};
