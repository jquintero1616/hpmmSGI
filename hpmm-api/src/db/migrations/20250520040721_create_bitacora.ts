import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("bitacora", (table) => {
    table.increments("id").primary();
    table.uuid("id_usuario").nullable();
    table.string("nombre_usuario").nullable();
    table.string("accion").notNullable();
    table.string("tabla_afectada").notNullable();
    table.string("registro_id").notNullable();
    table.text("valores_anterior").nullable();
    table.text("valores_nuevos").nullable();
    table.dateTime("fecha_evento").notNullable().defaultTo(knex.fn.now());
    table.string("ip_origin").nullable();
    table.string("descripcion_evento").nullable();
    table.string("modulo_afecto").nullable();
    table.timestamps(true, true);

    // FK opcional a tu tabla de usuarios
    table
      .foreign("id_usuario")
      .references("id_user")
      .inTable("users")
      .onDelete("SET NULL");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("bitacora");
}

