import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.schema.createTable("subcategory", table => {
    table.uuid("id_subcategory").primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid("id_category").notNullable();
    table.string("nombre").notNullable();
    table.boolean("estado").notNullable().defaultTo(true);
    table.timestamps(true, true);

    
    table
      .foreign("id_category")
      .references("id_category")
      .inTable("category")
      .onDelete("CASCADE");
   
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("subcategory");
}
