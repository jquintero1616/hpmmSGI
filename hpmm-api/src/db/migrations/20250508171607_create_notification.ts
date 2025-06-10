import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.schema.createTable("notifications", (table) => {
    
    table.uuid("id_noti").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("id_user").notNullable();
    table.string("mensaje").notNullable();
    table.enu("tipo", ["Pendiente", "Enviado", "Leido"]).notNullable()
  .defaultTo("Sin notificaciones");
    table.boolean("estado").notNullable().defaultTo(true);
    table.timestamps(true, true);

    table
      .foreign("id_user")
      .references("id_user")
      .inTable("users")
      .onDelete("RESTRICT");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("notifications");
}
