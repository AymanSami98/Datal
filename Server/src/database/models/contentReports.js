import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const ContentReports =
    sequelize.define('content_reports', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        contentId: {
            type: DataTypes.INTEGER,
        },
        reportId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sessionsTime: {
            type: DataTypes.INTEGER,
        },
        sessionsCount: {
            type: DataTypes.INTEGER,
        },
        usersCount: {
            type: DataTypes.INTEGER,
        },
        type: {
            type: DataTypes.STRING,
        },
        primeTime: {
            type: DataTypes.STRING,
        },
        firstSessionDate: {
            type: DataTypes.DATE,
        },
        
    },
        {
            paranoid: true,
        },
    );

export default ContentReports;

