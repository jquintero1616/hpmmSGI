import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.schema.createTable("employes", table => {
    
    table
      .uuid("id_employes")
      .primary()
      .defaultTo(knex.raw("uuid_generate_v4()")); 
      
    table.uuid("id_user").notNullable();
    table.uuid("id_units").notNullable();
    table.uuid("id_subdireccion").notNullable();
    table.uuid("id_direction").notNullable();
    table.string("name").notNullable();
    table.string("email").notNullable().unique();
    table.string("telefono").notNullable();
    table.string("puesto").nullable();
    table.boolean("estado").notNullable().defaultTo(true);
    table.timestamps(true, true);

    table
    .foreign("id_user")
    .references("id_user")
    .inTable("users")
    .onDelete("CASCADE");

    table
    .foreign("id_units")
    .references("id_units")
    .inTable("units")
    .onDelete("SET NULL");

    table
    .foreign("id_subdireccion")
    .references("id_subdireccion")
    .inTable("subdireccion")
    .onDelete("SET NULL");

    table
    .foreign("id_direction")
    .references("id_direction")
    .inTable("direction")
    .onDelete("SET NULL");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("employes");
}