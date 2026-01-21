import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Primero, actualizar registros existentes con valores antiguos
  await knex("notifications")
    .where("tipo", "Enviado")
    .update({ tipo: "Pendiente" });
  
  await knex("notifications")
    .where("tipo", "RecordarMasTarde")
    .update({ tipo: "Archivado" });

  // Actualizar la tabla notifications para agregar los nuevos campos
  await knex.schema.alterTable("notifications", (table) => {
    // Agregar columna id_rol (opcional)
    table.string("id_rol").nullable();
    
    // Agregar categorización
    table.enu("categoria", ["kardex", "requisicion", "solicitud_compra", "producto", "sistema"])
      .notNullable()
      .defaultTo("sistema");
    
    table.enu("prioridad", ["baja", "media", "alta", "urgente"])
      .notNullable()
      .defaultTo("media");
    
    // Agregar contenido mejorado
    table.string("titulo").notNullable().defaultTo("Notificación");
    table.text("descripcion_detallada").nullable();
    
    // Agregar contexto para navegación
    table.string("entidad_tipo").nullable();
    table.string("entidad_id").nullable();
    table.enu("accion_requerida", ["aprobar", "revisar", "informativo"]).nullable();
    
    // Agregar metadata del creador
    table.uuid("creador_id").nullable();
    table.string("creador_nombre").nullable();
    
    // Agregar fecha de lectura
    table.timestamp("leido_at").nullable();
  });

  // Actualizar el enum 'tipo' para incluir los nuevos estados
  await knex.raw(`
    ALTER TABLE notifications 
    DROP CONSTRAINT IF EXISTS notifications_tipo_check;
  `);

  await knex.raw(`
    ALTER TABLE notifications 
    ADD CONSTRAINT notifications_tipo_check 
    CHECK (tipo IN ('Pendiente', 'Leido', 'Archivado', 'Accionado'));
  `);

  // Actualizar registros existentes con valores por defecto
  await knex("notifications")
    .whereNull("categoria")
    .update({
      categoria: "sistema",
      prioridad: "media",
      titulo: "Notificación",
    });
}

export async function down(knex: Knex): Promise<void> {
  // Revertir la tabla a su estado original
  await knex.schema.alterTable("notifications", (table) => {
    table.dropColumn("id_rol");
    table.dropColumn("categoria");
    table.dropColumn("prioridad");
    table.dropColumn("titulo");
    table.dropColumn("descripcion_detallada");
    table.dropColumn("entidad_tipo");
    table.dropColumn("entidad_id");
    table.dropColumn("accion_requerida");
    table.dropColumn("creador_id");
    table.dropColumn("creador_nombre");
    table.dropColumn("leido_at");
  });

  // Restaurar el enum 'tipo' original
  await knex.raw(`
    ALTER TABLE notifications 
    DROP CONSTRAINT IF EXISTS notifications_tipo_check;
  `);

  await knex.raw(`
    ALTER TABLE notifications 
    ADD CONSTRAINT notifications_tipo_check 
    CHECK (tipo IN ('Pendiente', 'Enviado', 'Leido'));
  `);
}
