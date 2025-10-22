import knex from 'knex';
import config from '../knexfile';

const env = process.env.NODE_ENV || 'development';
const db = knex(config[env]);

// Ejecutar migraciones solo si la variable de entorno está activa
// Para ejecutar migraciones: docker exec hpmm-backend npm run db:run
// O establecer: AUTO_MIGRATE=true en .env
const autoMigrate = process.env.AUTO_MIGRATE === 'true';

if (autoMigrate) {
  console.warn('🔄 Ejecutando migraciones automáticamente...');
  db.migrate.latest()
    .then(() => {
      console.warn('✅ Migraciones completadas exitosamente');
    })
    .catch((error) => {
      console.error('❌ Error en migraciones:', error);
      // No terminar el proceso, solo registrar el error
    });
} else {
  console.warn('ℹ️  Migraciones automáticas desactivadas. Usa: npm run db:run');
}

export default db;
