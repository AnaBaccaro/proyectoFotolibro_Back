const { Photobook } = require("../models");

// ---------- ALL ----------
exports.getAll = async (req, res) => {
  try {
    const books = await Photobook.findAll({
      order: [["id", "ASC"]],
    });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------- SINGLE ----------
exports.getById = async (req, res) => {
  try {
    const book = await Photobook.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({ error: "Fotolibro no encontrado" });
    }

    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------- LATEST ----------
exports.getLatest = async (req, res) => {
  try {
    const books = await Photobook.findAll({
      limit: 3,
      order: [["id", "DESC"]],
    });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------- CURATED ----------
exports.getCurated = async (req, res) => {
  try {
    const books = await Photobook.findAll({
      where: { curated: true },
      order: [["curatedOrder", "ASC"]],
      limit: 10,
    });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------- SEARCH ----------
exports.search = async (req, res) => {
  const q = (req.query.q || "").toLowerCase();

  if (!q) return res.json([]);

  try {
    const books = await Photobook.findAll();

    const results = books.filter((b) =>
      `${b.title} ${b.author} ${b.country} ${b.editorial}`
        .toLowerCase()
        .includes(q)
    );

    res.json(results.slice(0, 20));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
