import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.schema.createTable("Kardex", table => {
    table.uuid("id_kardex").primary().defaultTo(knex.raw("uuid_generate_v4()"));

    table.uuid("id_product").notNullable();
    table.uuid("id_shopping");
    table.uuid("id_units_x_pacts");
    table.string("anio_creacion").notNullable();
    table.enu("tipo_movimiento", ["Entrada", "Salida"]);
    table.date("fecha_movimiento").notNullable();
    table.string("numero_factura").notNullable();
    table.decimal("cantidad").notNullable();
    table.decimal("precio_unitario").notNullable();
    table.enu("tipo_solicitud", ["Requisicion", "Pacto"]);
    table.string("requisicion_numero").notNullable();
    table.enu("tipo", ["Aprobado", "Rechazado", "Pendiente", "Cancelado"]);
    table.string("observacion");
    table.string("descripcion").notNullable();
    table.date("fecha_vencimiento").notNullable();
    table.string("numero_lote").notNullable();
    table.boolean("estado").notNullable().defaultTo(true);
    table.timestamps(true, true);
    table.uuid("id_empleado_solicitud_f");
    table.decimal("cantidad_solicitada");
    table.decimal("cantidad_recepcionada");
    table.uuid("id_scompra");
    table.string("nombre_producto");
    table.decimal("isv");
    table.decimal("total");
    table.uuid("id_vendedor");
    table.string("rfid");

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
    table
      .foreign("id_units_x_pacts")
      .references("id_units_x_pacts")
      .inTable("units_x_pacts")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("kardex");
}