const photobooksRaw = require("../data/photobooks_argentina_clean.json");

const hasValidImage = (b) => {
  const img = b.Imagen;
  return typeof img === "string" && img.trim().length > 0 && img !== "null";
};

const photobooks = photobooksRaw.map((b, i) => ({
  id: i + 1,
  ...b,
}));

exports.getAll = async (req, res) => {
  res.json(photobooks.filter(hasValidImage));
};

exports.getById = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1 || id > photobooks.length) {
    return res.status(404).json({ error: "Fotolibro no encontrado" });
  }

  res.json(photobooks[id - 1]);
};

exports.getLatest = async (req, res) => {
  const latest = photobooks.filter(hasValidImage).slice(-3).reverse();
  res.json(latest);
};

exports.getCurated = async (req, res) => {
  const curated = photobooks
    .filter((b) => b.Curated === true && hasValidImage(b))
    .sort((a, b) => (a.CuratedOrder ?? 999999) - (b.CuratedOrder ?? 999999))
    .slice(0, 10);

  res.json(curated);
};

exports.search = async (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  if (!q) return res.json([]);

  const results = photobooks
    .filter(hasValidImage)
    .filter((b) => {
      const title = (b["Título"] || "").toLowerCase();
      const author = `${b["Nombre fotógrafe"] || ""} ${b["Apellido fotógrafe"] || ""}`.toLowerCase();
      const country = (b["País"] || "").toLowerCase();
      const editorial = (b["Editorial"] || "").toLowerCase();

      return `${title} ${author} ${country} ${editorial}`.includes(q);
    });

  res.json(results.slice(0, 20));
};