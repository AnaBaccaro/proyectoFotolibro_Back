const photobooksRaw = require("../data/photobooks_argentina_clean.json");

const hasValidImage = (b) => {
  const img = (b?.Imagen ?? "").toString().trim();
  return img.length > 0 && img.toLowerCase() !== "null" && img.toLowerCase() !== "undefined";
};

const truthy = (v) => {
  if (v === true) return true;
  if (typeof v === "number") return v === 1;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    return s === "true" || s === "1" || s === "yes" || s === "y" || s === "si" || s === "sí";
  }
  return false;
};

const getField = (b, key) => {
  if (!b || typeof b !== "object") return undefined;
  if (Object.prototype.hasOwnProperty.call(b, key)) return b[key];
  const foundKey = Object.keys(b).find((k) => k.trim().toLowerCase() === key.trim().toLowerCase());
  return foundKey ? b[foundKey] : undefined;
};

const photobooks = photobooksRaw.map((b, i) => ({
  id: i + 1,
  ...b,
}));

exports.getAll = async (req, res) => {
  res.json(photobooks);
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
    .filter((b) => truthy(getField(b, "Curated")) && hasValidImage(b))
    .sort((a, b) => (Number(getField(a, "CuratedOrder")) || 999999) - (Number(getField(b, "CuratedOrder")) || 999999))
    .slice(0, 9);

  res.json(curated);
};

exports.search = async (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  if (!q) return res.json([]);

  const results = photobooks
    .filter((b) => {
      const title = (getField(b, "Título") ?? getField(b, "Titulo") ?? "").toString().toLowerCase();
      const first = (getField(b, "Nombre fotógrafe") ?? getField(b, "Nombre fotografe") ?? "").toString();
      const last = (getField(b, "Apellido fotógrafe") ?? getField(b, "Apellido fotografe") ?? "").toString();
      const author = `${first} ${last}`.toLowerCase();
      const country = (getField(b, "País") ?? getField(b, "Pais") ?? "").toString().toLowerCase();
      const editorial = (getField(b, "Editorial") ?? "").toString().toLowerCase();

      return `${title} ${author} ${country} ${editorial}`.includes(q);
    });

  res.json(results.slice(0, 20));
};