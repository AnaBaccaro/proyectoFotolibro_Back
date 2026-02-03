const photobooks = require("../data/photobooks_argentina_clean.json");
const { sequelize } = require("../models");

const FEATURED_TITLES = [
  "Metrópolis",
  "En el medio censurada",
  "Archivo de la Memoria Trans Argentina",
];

const CURATED_TITLES = [
  "Metrópolis",
  "En el medio censurada",
  "Archivo de la Memoria Trans Argentina",
  "Otro libro curado 1",
  "Otro libro curado 2",
  "Otro libro curado 3",
  "Otro libro curado 4",
  "Otro libro curado 5",
  "Otro libro curado 6",
  "Otro libro curado 7",
];

const normalize = (str) => (str ? str.trim().toLowerCase() : "");

const sanitizeYear = (value) => {
  if (value === null || value === undefined) return null;
  const cleaned = String(value).trim();
  if (cleaned === "" || cleaned.toLowerCase() === "nan" || cleaned === "-" || cleaned === "—") return null;
  const parsed = parseInt(cleaned, 10);
  return Number.isFinite(parsed) ? parsed : null;
};

module.exports = async () => {
  const rows = photobooks.map((p) => ({
    type: "Fotolibro",

    author_name: p["Autor"] || "",
    author_lastname: p["Apellido"] || "",

    title: p["Libro"] || "",
    country: p["Pais"] || "",
    city: p["Ciudad"] || "",
    publisher: p["Editorial"] || "",

    year: sanitizeYear(p["Año"]),

    text: p["Texto"] || "",
    design: p["Diseño"] || "",
    edition: p["Edicion"] || "",
    copies: p["Copias"] || "",
    isbn: p["ISBN"] || "",
    pages: p["#paginas"] || "",
    dimensions: p["Medidas"] || "",
    language: p["Idioma"] || "",
    funding: p["Financiación"] || "",
    printer: p["Imprenta"] || "",
    bibliography: p["Bibliografia"] || "",
    comments: p["Comentarios"] || "",
    link: p["Link"] || "",

    // ✅ Flags
    is_featured: FEATURED_TITLES.map(normalize).includes(normalize(p["Libro"])),
    is_curated: CURATED_TITLES.map(normalize).includes(normalize(p["Libro"])),

    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await sequelize.getQueryInterface().bulkInsert(
    "photobooks",
    rows,
    { ignoreDuplicates: true }
  );
};
