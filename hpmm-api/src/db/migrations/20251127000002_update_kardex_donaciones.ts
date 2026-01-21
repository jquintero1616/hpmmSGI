import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("Kardex", (table) => {
    // Agregar referencia al donante (nullable porque solo aplica para donaciones)
    table.uuid("id_donante").nullable();
    
    // Motivo de rechazo (para cuando se rechaza una donación)
    table.text("motivo_rechazo").nullable();
    
    // Foreign key al donante
    table
      .foreign("id_donante")
      .references("id_donante")
      .inTable("donantes")
      .onDelete("SET NULL");
  });

  // Actualizar el enum tipo_solicitud para incluir "Donacion"
  // Primero eliminamos la restricción actual
  await knex.schema.raw(`
    ALTER TABLE "Kardex" 
    DROP CONSTRAINT IF EXISTS "Kardex_tipo_solicitud_check"
  `);

  // Creamos la nueva restricción con "Donacion" incluido
  await knex.schema.raw(`
    ALTER TABLE "Kardex" 
    ADD CONSTRAINT "Kardex_tipo_solicitud_check" 
    CHECK (tipo_solicitud IN ('Requisicion', 'Pacto', 'Donacion'))
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("Kardex", (table) => {
    table.dropForeign(["id_donante"]);
    table.dropColumn("id_donante");
    table.dropColumn("motivo_rechazo");
  });

  // Revertir el enum a su estado original
  await knex.schema.raw(`
    ALTER TABLE "Kardex" 
    DROP CONSTRAINT IF EXISTS "Kardex_tipo_solicitud_check"
  `);

  await knex.schema.raw(`
    ALTER TABLE "Kardex" 
    ADD CONSTRAINT "Kardex_tipo_solicitud_check" 
    CHECK (tipo_solicitud IN ('Requisicion', 'Pacto'))
  `);
}
