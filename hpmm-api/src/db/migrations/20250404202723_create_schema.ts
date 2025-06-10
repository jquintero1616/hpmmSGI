import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
     return knex.raw('CREATE SCHEMA IF NOT EXISTS "mi_esquema";');
}


export async function down(knex: Knex): Promise<void> {
    return knex.raw('DROP SCHEMA IF EXISTS "mi_esquema" CASCADE;');
}

