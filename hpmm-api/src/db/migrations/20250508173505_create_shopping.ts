import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.schema.createTable("shopping", table => {
    
      table.uuid("id_shopping").primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid("id_scompra").notNullable();
    table.uuid("id_vendedor").notNullable();
    table.date("fecha_compra").notNullable();
    table.string("numero_cotizacion", 50).notNullable();
    table.string("numero_pedido", 50).notNullable();
    table.string("lugar_entrega", 100).notNullable();
    table.string("shopping_order_id", 50).notNullable();
    table.string("nombre_unidad", 100).notNullable();
    table.decimal("precio_unitario", 10, 2).notNullable();
    table.decimal ("cantidad_comprada", 10, 2).notNullable();
    table.boolean("ISV").notNullable().defaultTo(false);
    table.decimal("total",10, 2).notNullable();
    table.decimal("cantidad_solicitada", 10, 2).notNullable();
    table.string("nombre_producto", 100).notNullable();
    table.boolean("estado").notNullable().defaultTo(true);
    table.uuid("id_product").notNullable();
    table.timestamps(true, true);


    table
      .foreign("id_scompra")
      .references("id_scompra")
      .inTable("solicitud_compras")
      .onDelete("CASCADE");

      table
        .foreign("id_vendedor")
        .references("id_vendedor")
        .inTable("vendedor")
        .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("shopping");
}