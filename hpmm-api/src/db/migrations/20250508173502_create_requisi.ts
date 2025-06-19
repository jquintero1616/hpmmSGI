import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.schema.createTable("requisitions", table => {
    table.uuid("id_requisi").primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid("id_employes").notNullable();
    table.date('fecha').notNullable();
    table.enu("estado", ["Pendiente", "Aprobado", "Rechazado", "Cancelado"]).defaultTo("Pendiente");
    table.string("descripcion");
    table.timestamps(true, true);


    table
      .foreign("id_employes")
      .references("id_employes")
      .inTable("employes")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("requisitions");
}