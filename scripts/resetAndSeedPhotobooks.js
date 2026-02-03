const { Photobook, sequelize } = require("../models");
const photobooksData = require("../data/photobooks_argentina_clean.json");

// ⭐ Titulos correctos para marcar como destacados
const FEATURED_TITLES = [
  "La Ausencia",
  "Las Batallas de Monte Chingolo",
  "La Quinta Copia",
];

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión OK a la DB");

    // Borrar todos los photobooks
    await Photobook.destroy({ where: {} });
    console.log("Tabla photobooks limpiada");

    // Insertar todos los photobooks con is_featured
    const rows = photobooksData.map(p => ({
      type: p.type || "Fotolibro",
      author_name: p.author_name || "",
      author_lastname: p.author_lastname || "",
      title: p.title || "",
      country: p.country || "",
      city: p.city || "",
      publisher: p.publisher || "",
      year: p.year ? Number(p.year) : null,
      text: p.text || "",
      design: p.design || "",
      edition: p.edition || "",
      copies: p.copies || "",
      isbn: p.isbn || "",
      pages: p.pages || "",
      dimensions: p.dimensions || "",
      language: p.language || "",
      funding: p.funding || "",
      printer: p.printer || "",
      bibliography: p.bibliography || "",
      comments: p.comments || "",
      link: p.link || "",

      // marcar como destacado si el título está en FEATURED_TITLES
      is_featured: FEATURED_TITLES.includes(p.title),

      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await Photobook.bulkCreate(rows);
    console.log("Photobooks insertados con is_featured correcto");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
