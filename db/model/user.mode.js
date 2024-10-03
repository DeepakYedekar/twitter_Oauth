import { DataTypes } from "sequelize";
import  {sequelize}  from "../../db/db.connection.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  twitter_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  referral_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  refresh_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  referral_points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

export default User;
