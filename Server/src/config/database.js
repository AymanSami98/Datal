import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.development' });

const { DATABASE_URL } = process.env;
const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});
// const sequelize = new Sequelize(DATABASE_URL, {
//   dialect: 'postgres',
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false // You should set this to true in production and provide CA cert
//     }
//   },
//   logging: false,
// });

export default sequelize;
