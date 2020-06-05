import { Sequelize, DataTypes } from 'sequelize';

import { Locations } from './models/location';

const sequelize = new Sequelize('itmo', 'admin', 'admin', {
  host: 'localhost',
  dialect: 'postgres'
});

Locations.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false
    },
    description: {
      type: new DataTypes.STRING(128),
      allowNull: true
    },
    country: {
      type: new DataTypes.STRING(128),
      allowNull: true
    },
    city: {
      type: new DataTypes.STRING(128),
      allowNull: true
    },
    visited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    tableName: 'Locations',
    sequelize: sequelize
  }
);

const placeholder = {
  sequelize
};

export default placeholder;
