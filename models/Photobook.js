const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Photobook extends Model {}

  Photobook.init(
    {
      title: DataTypes.STRING,
      author: DataTypes.STRING,
      country: DataTypes.STRING,
      city: DataTypes.STRING,
      editorial: DataTypes.STRING,
      year: DataTypes.INTEGER,
      image: DataTypes.STRING,
      curated: DataTypes.BOOLEAN,
      curatedOrder: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "Photobook",
      tableName: "photobooks",
      timestamps: false,
    }
  );

  return Photobook;
};
