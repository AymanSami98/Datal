import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
const Report = sequelize.define('reports', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Ensure this is set
    },    
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    uniqueViews: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sessionsCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sessionsTime: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rollingAverage: {
        type: DataTypes.FLOAT, 
        allowNull: false
    },
    usersCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
},
    {
        paranoid: true,
    },
);



export default Report;