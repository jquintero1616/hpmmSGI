import { Knex } from "knex";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const esquema = process.env.PSQL_DB_SCHEMA || "mi_esquema"; // Cambia “mi_esquema” por el nombre real

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: process.env.PSQL_DB_HOST,
      user: process.env.PSQL_DB_USER,
      password: process.env.PSQL_DB_PASSWORD,
      database: process.env.PSQL_DB_DATABASE,
      port: process.env.PSQL_DB_PORT ? parseInt(process.env.PSQL_DB_PORT, 10) : 5432,
    },

    searchPath: [esquema, "public"],

    migrations: {
      //  Nombre y carpeta de tus migraciones
      tableName: "knex_migrations",
      directory: path.resolve(__dirname, "db/migrations"),
      //  Le decimos a Knex QUE la tabla knex_migrations viva en “mi_esquema”
      schemaName: esquema,
    },

    seeds: {
      directory: path.resolve(__dirname, "db/seeds"),
    },
  },

  // (Repite la misma lógica en producción si quieres)
  production: {
    client: "pg",
    connection: {
      host: process.env.PSQL_DB_HOST,
      user: process.env.PSQL_DB_USER,
      password: process.env.PSQL_DB_PASSWORD,
      database: process.env.PSQL_DB_DATABASE,
      port: process.env.PSQL_DB_PORT ? parseInt(process.env.PSQL_DB_PORT, 10) : 5432,
    },
    searchPath: [esquema, "public"],
    migrations: {
      tableName: "knex_migrations",
      directory: path.resolve(__dirname, "db/migrations"),
      schemaName: esquema,
    },
    seeds: {
      directory: path.resolve(__dirname, "db/seeds"),
    },
  },
};

export default config;
