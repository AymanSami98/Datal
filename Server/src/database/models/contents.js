import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
const Content =
  sequelize.define('contents', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
    },
    publishDate: {
      type: DataTypes.DATE,
    },

    
  },
  );

export default Content;
