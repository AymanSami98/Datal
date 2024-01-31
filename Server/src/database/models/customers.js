import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Customer = sequelize.define('customers', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    accountType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    },
    );

export default Customer;