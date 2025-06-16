import db from "../db";
import bcrypt from "bcryptjs";
import { AuthResponse } from "../types/Auth";

export const authenticateUser = async (
  email: string,
  password: string
): Promise<AuthResponse | null> => {
  const user = await db("users")
    .select([
      "users.id_user as id_user",
      "users.username as username",
      "employes.name as employe_name",
      "roles.name as role_name",
      "roles.id_rol as id_rol",
      "employes.id_employes as id_employes",
      "users.password as user_password",
      "users.estado as state",
    ])
    .join("roles", "users.id_rol", "roles.id_rol")
    .join("employes", "users.id_user", "employes.id_user")
    .where("users.email", email)
    .first();


  const { id_rol, id_user, username, id_employes, user_password, state, role_name, employe_name } =
    user;

  if (!user || !state) return null;

  const valid = await bcrypt.compare(password, user_password);

  if (!valid) return null;

  return {
    id_user,
    id_rol,
    id_employes,
    username,
    role_name,
    employe_name
  };
};
