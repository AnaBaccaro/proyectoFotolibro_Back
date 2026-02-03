 const { Model, DataTypes } = require("sequelize");

class Author extends Model {
  static initModel(sequelize) {
    Author.init(
      {
        id: {
          type: DataTypes.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        author_name: {
          type: DataTypes.STRING,
        },
        author_lastname: {
          type: DataTypes.STRING,
        },
        country: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
        modelName: "author",
      },
    );

    return Author;
  }
  static associate(models) {
    Author.hasMany(models.Photobook, { foreignKey: 'authorId', as: 'photobooks' });
  }
}

module.exports = Author;
