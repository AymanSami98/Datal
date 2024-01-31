const { DataTypes } = require('sequelize');

export default {
  up: async (queryInterface) => {
    await queryInterface.createTable('contents', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      runtime: {
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      publishDate: {
        type: DataTypes.DATE,
      },
      permalink: {
        type: DataTypes.STRING,
      },
      launchDate: {
        type: DataTypes.DATE,
      },
      createdBy: {
        type: DataTypes.INTEGER,
      },
      updatedBy: {
        type: DataTypes.INTEGER,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('contents');
  },
};