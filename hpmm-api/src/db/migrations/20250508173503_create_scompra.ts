import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.schema.createTable("solicitud_compras", table => {
    
    table.uuid("id_scompra").primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid("id_requisi").notNullable();
    table.enu("estado", ["Pendiente", "Comprado", "Cancelada"]);
    table.timestamps(true, true);


    table
      .foreign("id_requisi")
      .references("id_requisi")
      .inTable("requisitions")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("solicitud_compras");
}