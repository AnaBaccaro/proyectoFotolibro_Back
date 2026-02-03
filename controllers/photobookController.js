const path = require("path");
const fs = require("fs");

// Ruta del JSON
const jsonPath = path.join(
  __dirname,
  "../data/photobooks_argentina_clean.json"
);

const allBooks = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));


// ---------- LATEST ----------

const latestImages = [
  "Archivo_de_la_Memoria_Nuestros_Codigos.jpg",
  "La_Ausencia_2007.jpeg",
  "Buena_memoria_1997.jpeg",
];

exports.getLatest = (req, res) => {
  const latestBooks = allBooks.filter((book) =>
    latestImages.includes(book.Imagen)
  );

  res.json(latestBooks);
};


// ---------- CURATED ----------

exports.getCurated = (req, res) => {
  const curatedBooks = allBooks
    .filter(
      (book) =>
        book.Curated === true &&
        book.Imagen &&
        book.Imagen.trim() !== ""
    )
    .sort(
      (a, b) => (a.CuratedOrder || 0) - (b.CuratedOrder || 0)
    )
    .slice(0, 10);

  res.json(curatedBooks);
};


// ---------- ALL ----------

exports.getAll = (req, res) => {
  res.json(allBooks);
};


// ---------- SEARCH ----------

exports.search = (req, res) => {
  const q = (req.query.q || "").toLowerCase().trim();

  if (!q) {
    return res.json([]);
  }

  const results = allBooks
    .map(book => {
      const titulo = (book["Título"] || "").toLowerCase();
      const autor = (
        (book["Nombre fotógrafe"] || "") +
        " " +
        (book["Apellido fotógrafe"] || "")
      ).toLowerCase();
      const pais = (book["País"] || "").toLowerCase();
      const editorial = (book["Editorial"] || "").toLowerCase();

      let score = 999;

      if (titulo.includes(q)) score = 1;
      else if (autor.includes(q)) score = 2;
      else if (pais.includes(q)) score = 3;
      else if (editorial.includes(q)) score = 4;

      if (score < 999) {
        return { ...book, _score: score };
      }

      return null;
    })
    .filter(Boolean)
    .sort((a, b) => a._score - b._score)
    .slice(0, 20);

  res.json(results);
};
