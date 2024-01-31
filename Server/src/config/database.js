import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.development' });

const { DATABASE_URL } = process.env;
const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

export default sequelize;
