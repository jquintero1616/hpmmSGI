import db from "../db";
import { NewUser, User } from "../types/user";

// Get all users model
export const getAllUsersModel = async (): Promise<NewUser[]> => {
  return db("users as u")
    .join("roles as r", "u.id_rol", "r.id_rol")
    .select(
      "u.id_user",
      "u.username",
      "u.email",
      "u.estado",
      "u.created_at",
      "u.updated_at",
      "r.name as role_name",
      "r.id_rol as id_rol"
    );
};
// User Id model
export async function getUserByIdModel(
  id_user: string
): Promise<NewUser | null> {
  const user = await db("users as u")
    .join("roles as r", "u.id_rol", "r.id_rol")
    .select(
      "u.id_user",
      "u.username",
      "u.email",
      "u.estado",
      "u.created_at",
      "u.updated_at",
      "r.name as role_name"
    )
    .where({ id_user })
    .first();
  return user || null;
}

// Create User
export const createUserModel = async (payload: User): Promise<User> => {
  const [created] = await db("users").insert(payload).returning("*");
  return created;
};

// Update User
export const updateUserModel = async (
  id_user: string,
  updates: Partial<Omit<User, "id_user" | "created_at" | "updated_at">>
): Promise<User | null> => {
  const [updated] = await db("users")
    .where({ id_user })
    .update({
      ...updates,
      updated_at: new Date(),
    })
    .returning("*");
  return updated || null;
};

// delete User
export async function deleteUserModel(
  id_user: string
): Promise<NewUser | null> {
  const updated_at = new Date();
  const [updatedUser] = await knexTableName()
    .where({ id_user })
    .update({ estado: false, updated_at })
    .returning("*");
  return updatedUser || null;
}

const knexTableName = () => {
  return db("users");
};
