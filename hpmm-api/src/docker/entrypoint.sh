#!/usr/bin/env bash
#
# Este entrypoint:
#  - Espera a que Postgres esté arriba.
#  - Crea la base de datos hpmm_sgi si no existe.
#  - Crea el schema mi_esquema si no existe.
#  - Corre migraciones y seeds.
#  - Arranca la app en modo dev o prod.
#

# 1) Para ver cada comando y atrapar errores:
trap 'echo "❗ Error en la línea $LINENO. Presiona Enter para salir…"; read' ERR
set -ex

#–– 2) Cargar variables de entorno (valores por defecto si no existen)
: "${PSQL_DB_HOST:=localhost}"
: "${PSQL_DB_PORT:=5432}"
: "${PSQL_DB_USER:=postgres}"
: "${PSQL_DB_PASSWORD:=test}"
: "${PSQL_DB_DATABASE:=hpmm_sgi}"
: "${PSQL_DB_SCHEMA:=mi_esquema}"
: "${NODE_ENV:=development}"

echo "🔧 Usando PSQL_DB_HOST=$PSQL_DB_HOST  PSQL_DB_PORT=$PSQL_DB_PORT  PSQL_DB_USER=$PSQL_DB_USER  PSQL_DB_DATABASE=$PSQL_DB_DATABASE  PSQL_DB_SCHEMA=$PSQL_DB_SCHEMA  NODE_ENV=$NODE_ENV"

#–– 3) Esperar a que la base esté arriba
wait_for_database() {
  echo "⏳ Checking if database is ready on $PSQL_DB_HOST:$PSQL_DB_PORT…"
  until ncat -z "$PSQL_DB_HOST" "$PSQL_DB_PORT"; do
    echo "⌛ Waiting for database connection…"
    sleep 5
  done
  echo "✅ Database server is up!"
}
wait_for_database

#–– 4) Crear la base de datos si no existe
#–– 4) Crear la base de datos si no existe (versión corregida)
echo "🔨 Verificando que la base de datos '$PSQL_DB_DATABASE' exista…"

DB_EXISTS=$(
  PGPASSWORD="$PSQL_DB_PASSWORD" \
  "/c/Program Files/PostgreSQL/17/bin/psql.exe" \
    -h "$PSQL_DB_HOST" \
    -U "$PSQL_DB_USER" \
    -d postgres \
    -w \
    -tAc "SELECT 1 FROM pg_database WHERE datname = '$PSQL_DB_DATABASE';"
)

if [ "$DB_EXISTS" != "1" ]; then
  echo "📦 Base de datos '$PSQL_DB_DATABASE' no existe. Creándola…"
  PGPASSWORD="$PSQL_DB_PASSWORD" \
  "/c/Program Files/PostgreSQL/17/bin/psql.exe" \
    -h "$PSQL_DB_HOST" \
    -U "$PSQL_DB_USER" \
    -d postgres \
    -w \
    -c "CREATE DATABASE \"$PSQL_DB_DATABASE\";"
else
  echo "✅ Base de datos '$PSQL_DB_DATABASE' ya existe."
fi

#–– 5) Crear el schema ANTES de migraciones
echo "🛠️ Creando el schema '$PSQL_DB_SCHEMA' si no existe…"
PGPASSWORD="$PSQL_DB_PASSWORD" \
  "/c/Program Files/PostgreSQL/17/bin/psql.exe" \
  -h "$PSQL_DB_HOST" \
  -U "$PSQL_DB_USER" \
  -d "$PSQL_DB_DATABASE" \
  -v ON_ERROR_STOP=1 <<-EOSQL
    CREATE SCHEMA IF NOT EXISTS "$PSQL_DB_SCHEMA";
EOSQL
echo "✅ Schema '$PSQL_DB_SCHEMA' listo."

#–– 6) Exportar para que Knex lo lea (si tu knexfile usa PSQL_DB_SCHEMA)
export PSQL_DB_SCHEMA

#–– 7) Ejecutar migraciones
echo "🚀 Corriendo migraciones con Knex…"
npm run db:run  # debe ser `knex migrate:latest`

#–– 8) Seeds si no es producción
if [ "$NODE_ENV" != "production" ]; then
  echo "🌱 Corriendo seeds…"
  npm run db:run:seed
fi

echo "🏁 Database migrations and seeds completed."

# –– 9) Arrancar la app
# echo "🔥 Iniciando la aplicación backend…"
# if [ "$NODE_ENV" = "development" ]; then
#   echo "🛠️ Modo desarrollo: arrancando con Nodemon…"
#   exec npm run dev
# else
#   echo "🚀 Modo producción: arrancando con npm start…"
#   exec npm start
# fi

#–– 10) Si llega aquí, todo salió bien
echo "✅ Script finalizó SIN ERRORES. Presiona Enter para salir…"
read
