import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const CustomersReport = sequelize.define('customer_reports', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    customerId: {
        type: DataTypes.INTEGER,
    },
    uniqueViews: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    sessionsCount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    sessionsTime: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    averageTime: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    accountType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    },
    );

export default CustomersReport;
