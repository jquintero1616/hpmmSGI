import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.schema.createTable("Kardex", table => {
    table.uuid("id_kardex").primary().defaultTo(knex.raw("uuid_generate_v4()"));

    table.uuid("id_product").notNullable();
    table.uuid("id_shopping").notNullable();
    table.string("anio_creacion").notNullable();
    table.enu("tipo_movimiento", ["Entrada", "Salida"]);
    table.date("fecha_movimiento").notNullable();
    table.string("numero_factura").notNullable();
    table.decimal("cantidad").notNullable();
    table.decimal("precio_unitario").notNullable();
    table.enu("tipo_solicitud", ["Requisicion", "Pacto"]);
    table.string("requisicion_numero").notNullable();
    table.enu("tipo", ["Aprobado", "Rechazado", "Pendiente", "Cancelado"]);
    table.string("observacion").notNullable();
    table.boolean("estado").notNullable().defaultTo(true);
    table.timestamps(true, true);
    table.uuid("id_empleado_solicitud_f");

     table
       .foreign("id_empleado_solicitud_f")
       .references("id_employes")
       .inTable("employes")
       .onDelete("CASCADE");
    table
      .foreign("id_shopping")
      .references("id_shopping")
      .inTable("shopping")
      .onDelete("CASCADE");
    table
      .foreign("id_product")
      .references("id_product")
      .inTable("product")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("kardex");
}