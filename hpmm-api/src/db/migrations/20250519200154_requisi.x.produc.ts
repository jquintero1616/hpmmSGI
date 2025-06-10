
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  return knex.schema.createTable("Requi_x_Product", (table) => {
    table
      .uuid("id_requisi_x_product")
      .primary()
      .defaultTo(knex.raw("uuid_generate_v4()"));

    table.uuid("id_requisi").notNullable().index();
    table.uuid("id_product").notNullable().index();
    table.decimal("cantidad").notNullable();
    table.timestamps(true, true);

    table
      .foreign("id_requisi")
      .references("id_requisi")
      .inTable("requisitions")
      .onDelete("CASCADE");
      
    table
      .foreign("id_product")
      .references("id_product")
      .inTable("product")
      .onDelete("CASCADE");
      
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("Requi_x_Product");
}
