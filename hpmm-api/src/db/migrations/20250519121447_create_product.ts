import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.schema.createTable("product", table => {
    
    table.uuid("id_product").primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid("id_subcategory").notNullable();
    table.string("nombre").notNullable();
    table.string("descripcion").notNullable();
    table.integer("stock_actual").notNullable();
    table.integer("stock_maximo").notNullable();
    table.date("fecha_vencimiento").notNullable();
    table.string("numero_lote").notNullable();
    table.boolean("estado").notNullable().defaultTo(true);
    table.timestamps(true, true);


    table
      .foreign("id_subcategory")
      .references("id_subcategory")
      .inTable("subcategory")
      .onDelete("CASCADE");

  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("product");
}