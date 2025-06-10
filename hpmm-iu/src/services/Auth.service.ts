import axiosPublic from "../helpers/axiosInstance";

export const authenticateUser = async (
  email: string,
  password: string
): Promise<{ username: string; id_rol: string, userId: string }> => {
  try {
    // TODO: Remover esta onda.... no se te puede olvidar...
    const email = "1@hpmm.hn";
    const password = "123";
    const response = await axiosPublic().post("/login", { email, password });
    return {
      username: response.data.username,
      id_rol: response.data.id_rol,
      userId: response.data.userId,
    };
  } catch (error) {
    console.error("Error al autenticar al usuario", error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  await axiosPublic().post("/logout");
};
