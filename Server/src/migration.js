import { Umzug, SequelizeStorage } from 'umzug';
import sequelize from './config/database.js'; // Assuming you have defined the sequelize connection here
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import { promisify } from 'util';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const globPromise = promisify(glob);

const umzug = new Umzug({
  migrations: async () => {
    const migrationFiles = await globPromise(path.resolve(__dirname, './migrations/*.js'));
    return migrationFiles.map(file => {
      return {
        name: path.basename(file),
        up: async () => {
          const migration = await import(file);
          await migration.up(sequelize.getQueryInterface(), sequelize.Sequelize);
        },
        down: async () => {
          const migration = await import(file);
          await migration.down(sequelize.getQueryInterface(), sequelize.Sequelize);
        }
      };
    });
  },
  storage: new SequelizeStorage({
    sequelize,
    modelName: 'migration_meta',
  }),
  logger: console,
});

(async () => {
  await umzug.up();
  sequelize.close();
})();