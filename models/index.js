const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "TU_DB",
  "TU_USER",
  "TU_PASSWORD",
  {
    host: "localhost",
    dialect: "mysql",
  }
);

const Photobook = require("./Photobook")(sequelize);

module.exports = {
  sequelize,
  Photobook,
};
