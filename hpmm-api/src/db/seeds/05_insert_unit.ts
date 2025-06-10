import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("units").del();
  await knex("units").insert([
    // Subdirección A (4 unidades)
    {
      id_units:        "00000000-0000-0000-0000-000000000001",
      id_subdireccion: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      name:            "Unidad de Estadistica",
      estado:          true,
    },
    {
      id_units:        "00000000-0000-0000-0000-000000000002",
      id_subdireccion: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      name:            "Unidad de Planificación",
      estado:          true,
    },
    {
      id_units:        "00000000-0000-0000-0000-000000000003",
      id_subdireccion: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      name:            "Unidad de Epidemiología",
      estado:          true,
    },
    {
      id_units:        "00000000-0000-0000-0000-000000000004",
      id_subdireccion: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      name:            "Unidad de Informatica",
      estado:          true,
    },

    // Subdirección B (1 unidad)
    {
      id_units:        "00000000-0000-0000-0000-000000000005",
      id_subdireccion: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      name:            "Diseño y Publicidad",
      estado:          true,
    },

    // Subdirección C (13 unidades)
    {
      id_units:        "00000000-0000-0000-0000-000000000006",
      id_subdireccion: "cccccccc-cccc-cccc-cccc-cccccccccccc",
      name:            "Gestion de Pacientes",
      estado:          true,
    },
    {
      id_units:        "00000000-0000-0000-0000-000000000007",
      id_subdireccion: "cccccccc-cccc-cccc-cccc-cccccccccccc",
      name:            "Atencion al Usuario",
      estado:          true,
    },
    {
      id_units:        "00000000-0000-0000-0000-000000000008",
      id_subdireccion: "cccccccc-cccc-cccc-cccc-cccccccccccc",
      name:            "Admision de Archivos",
      estado:          true,
    },
    {
      id_units:        "00000000-0000-0000-0000-000000000009",
      id_subdireccion: "cccccccc-cccc-cccc-cccc-cccccccccccc",
      name:            "Dpt de Enfermeria",
      estado:          true,
    },
    {
      id_units:        "00000000-0000-0000-0000-00000000000a",
      id_subdireccion: "cccccccc-cccc-cccc-cccc-cccccccccccc",
      name:            "Consulta Externa",
      estado:          true,
    },
    {
      id_units:        "00000000-0000-0000-0000-00000000000b",
      id_subdireccion: "cccccccc-cccc-cccc-cccc-cccccccccccc",
      name:            "Emergencia",
      estado:          true,
    },
  
    

    // Subdirección E (5 unidades)
    {
      id_units:        "00000000-0000-0000-0000-000000000013",
      id_subdireccion: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
      name:            "Unidad de Talento Humano",
      estado:          true,
    },
    {
      id_units:        "00000000-0000-0000-0000-000000000014",
      id_subdireccion: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
      name:            "Dpt Logistica y Suministros",
      estado:          true,
    },
    {
      id_units:        "00000000-0000-0000-0000-000000000015",
      id_subdireccion: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
      name:            "Dept de Gestion Financiera",
      estado:          true,
    },
    {
      id_units:        "00000000-0000-0000-0000-000000000016",
      id_subdireccion: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
      name:            "Servicios Generales",
      estado:          true,
    },
    {
      id_units:        "00000000-0000-0000-0000-000000000017",
      id_subdireccion: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
      name:            "Contabilidad",
      estado:          true,
    },
  ]);
}
