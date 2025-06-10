import db from "../db";
import bcrypt from "bcryptjs";
import { AuthResponse } from "../types/Auth";

interface DbUser {
  id_user: string;
  username: string;
  email: string;
  password: string;
  estado: boolean;
  id_rol: string;
}

export const authenticateUser = async (
  email: string,
  password: string
): Promise<AuthResponse | null> => {
  const user = await db<DbUser>("users")
    .join("roles", "users.id_rol", "roles.id_rol")
    .where({ email })
    .first();
  if (!user || !user.estado) return null;

  const valid = await bcrypt.compare(password, user.password);

  const roleName = user.name;
  if (!valid) return null;

  return { userId: user.id_user, username: user.username, id_role: roleName };
};
