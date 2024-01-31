import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const DailyData = sequelize.define('daily_data', {
    date: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    totalDuration: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    primeTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    },
    );

export default DailyData;