-- Script de inicialización de la base de datos PostgreSQL
-- Este script se ejecuta automáticamente cuando el contenedor de PostgreSQL inicia por primera vez
-- Se ejecuta en el contexto de la base de datos especificada en POSTGRES_DB (hpmm_sgi)

-- Crear el esquema mi_esquema si no existe
CREATE SCHEMA IF NOT EXISTS mi_esquema;

-- Otorgar todos los privilegios al usuario postgres sobre el esquema
GRANT ALL PRIVILEGES ON SCHEMA mi_esquema TO postgres;

-- Otorgar todos los privilegios sobre todos los objetos del esquema
ALTER DEFAULT PRIVILEGES IN SCHEMA mi_esquema GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA mi_esquema GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA mi_esquema GRANT ALL ON FUNCTIONS TO postgres;

-- Mensaje de confirmación
SELECT 'Esquema mi_esquema creado exitosamente' AS mensaje;
