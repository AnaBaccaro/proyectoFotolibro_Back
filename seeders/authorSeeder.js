const { Author } = require("../models");

module.exports = async () => {
  await Author.bulkCreate([
    { author_name: "Alessandra", author_lastname: "Sanguinetti", country: "-" },
    { author_name: "Veronica", author_lastname: "Freires", country: "Argentina" },
    { author_name: "Adriana", author_lastname: "Lestido", country: "Argentina" },
    { author_name: "Sebastián", author_lastname: "Szyd", country: "Argentina" },
    { author_name: "Sara", author_lastname: "Facio", country: "Argentina" },
    { author_name: "Alicia", author_lastname: "D'Amico", country: "Argentina" },
  ]);

  console.log("👩‍🎨 Autores creados");
};
