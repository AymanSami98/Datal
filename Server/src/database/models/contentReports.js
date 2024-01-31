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
    },
        {
            paranoid: true,
        },
    );

export default ContentReports;

