import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.schema.createTable("reports", table => {
    table.uuid("id_report").primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.enu("tipo", ["Producto Adquirido", "Consumo", "Existencia", "Vencimientos", "Pactos"]);
    table.enu("periodo", ["Semanal", "Mensual", "Trimestral", "Anual"]);
    table.date("fecha").notNullable();
    table.boolean("estado").notNullable().defaultTo(true);
    table.timestamps(true, true);
    
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("reports");
}