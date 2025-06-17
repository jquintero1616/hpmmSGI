import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // 1) Limpiar la tabla
  await knex("Kardex").del();

  // 2) Insertar empleados de ejemplo
  await knex("Kardex").insert([
    {
      id_kardex: "11111111-2222-1111-1111-111111113333",
      id_product: "11111111-6666-1111-1111-111111112222",
      id_units_x_pacts: "11111111-2222-1111-1111-111111115555",
      anio_creacion: "2025", // del seed de units
      tipo_movimiento: "Salida", // del seed de subdireccion
      fecha_movimiento: "2025-05-10", // del seed de direction
      numero_factura: "1", // del seed de direction
      id_empleado_solicitud_f: "11111111-aaaa-bbbb-cccc-111111111111",
      cantidad: 1,
      precio_unitario: 1000.5,
      tipo_solicitud: "Requisicion", // del seed de direction
      requisicion_numero: "1", // del seed de direction
      tipo: "Aprobado", // del seed de direction
      observacion: "Ninguna",
      descripcion: "Productos de prueba", // nuevo campo
      fecha_vencimiento: "2025-12-31", // nuevo campo
      numero_lote: "Lote-001", // nuevo campo
      estado: true, // del seed de direction
    },
    {
      id_kardex: "11111111-3333-1111-1111-111111113333",
      id_product: "22222222-7777-2222-2222-222222223333",
      id_shopping: "11111111-1111-1111-1111-111111114444", // existe en users
      anio_creacion: "2025", // del seed de units
      tipo_movimiento: "Entrada", // del seed de subdireccion
      fecha_movimiento: "2025-05-10", // del seed de direction
      numero_factura: "2", // del seed de direction
      id_empleado_solicitud_f: "11111111-aaaa-bbbb-cccc-111111111111",
      cantidad: 2,
      precio_unitario: 2000.5,
      tipo_solicitud: "Requisicion", // del seed de direction
      requisicion_numero: "2", // del seed de direction
      tipo: "Rechazado", // del seed de direction
      observacion: "Ninguna", // del seed de direction
      descripcion: "Productos de prueba 2", // nuevo campo
      fecha_vencimiento: "2025-11-30", // nuevo campo
      numero_lote: "Lote-002", // nuevo campo

      estado: true, // del seed de direction
    },
    {
      id_kardex: "11111111-1111-1111-1111-111111115555",
      id_product: "33333333-8888-3333-3333-333333334444",
      id_shopping: "11111111-1111-1111-1111-111111115555", // existe en users
      anio_creacion: "2025", // del seed de units
      id_empleado_solicitud_f: "11111111-aaaa-bbbb-cccc-111111111111",
      tipo_movimiento: "Entrada", // del seed de subdireccion
      fecha_movimiento: "2025-05-10", // del seed de direction
      numero_factura: "3", // del seed de direction
      cantidad: 3,
      precio_unitario: 3000.5,
      tipo_solicitud: "Requisicion", // del seed de direction
      requisicion_numero: "3", // del seed de direction
      tipo: "Pendiente", // del seed de direction
      observacion: "Ninguna", // del seed de direction
      
      descripcion: "Productos de prueba 3", // nuevo campo
      fecha_vencimiento: "2025-11-29", // nuevo campo
      numero_lote: "Lote-003", // nuevo campo

      estado: true, // del seed de direction
    },
  ]);
}
