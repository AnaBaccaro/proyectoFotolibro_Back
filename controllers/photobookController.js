const photobooksRaw = require("../data/photobooks_argentina_clean.json");
const fs = require("fs");
const path = require("path");

const IMG_DIR = path.join(__dirname, "..", "public", "img");

const normalizeName = (s) =>
  (s || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFC");

const stripExt = (filename) => filename.replace(/\.[^/.]+$/, "");

const truthy = (v) => {
  if (v === true) return true;
  if (typeof v === "number") return v === 1;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    return s === "true" || s === "1" || s === "yes" || s === "y" || s === "si" || s === "sí" || s === "true";
  }
  return false;
};

const getField = (b, key) => {
  if (!b || typeof b !== "object") return undefined;
  if (Object.prototype.hasOwnProperty.call(b, key)) return b[key];
  const foundKey = Object.keys(b).find(
    (k) => k.trim().toLowerCase() === key.trim().toLowerCase()
  );
  return foundKey ? b[foundKey] : undefined;
};

const normalizeImagen = (b) => {
  const img = (getField(b, "Imagen") ?? "").toString().trim();
  if (!img) return "";
  const low = img.toLowerCase();
  if (low === "null" || low === "undefined") return "";
  return img;
};

const imageExistsFlexible = (imgName) => {
  const name = (imgName ?? "").toString().trim();
  if (!name) return false;

  const requestedBase = normalizeName(stripExt(name));

  let files = [];
  try {
    files = fs.readdirSync(IMG_DIR);
  } catch {
    return false;
  }

  return files.some((f) => normalizeName(stripExt(f)) === requestedBase);
};

const photobooks = photobooksRaw.map((b, i) => ({
  id: i + 1,
  ...b,
  // Normalizamos algunos campos clave para que el front no dependa de tildes
  Imagen: normalizeImagen(b),
  Titulo:
    (getField(b, "Titulo") ?? getField(b, "Título") ?? "").toString().trim(),
  Pais: (getField(b, "Pais") ?? getField(b, "País") ?? "").toString().trim(),
  NombreFotografe:
    (getField(b, "Nombre fotografe") ??
      getField(b, "Nombre fotógrafe") ??
      "").toString().trim(),
  ApellidoFotografe:
    (getField(b, "Apellido fotografe") ??
      getField(b, "Apellido fotógrafe") ??
      "").toString().trim(),
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
  // Últimos 3 que tengan imagen REAL (archivo existente en public/img),
  // ignorando extensión y mayúsculas/minúsculas.
  const latest = photobooks
    .filter((b) => imageExistsFlexible(b.Imagen))
    .slice(-3)
    .reverse();

  res.json(latest);
};

exports.getCurated = async (req, res) => {
  const curated = photobooks
    .filter((b) => truthy(getField(b, "Curated")) && imageExistsFlexible(b.Imagen))
    .sort(
      (a, b) =>
        (Number(getField(a, "CuratedOrder")) || 999999) -
        (Number(getField(b, "CuratedOrder")) || 999999)
    )
    .slice(0, 9);

  res.json(curated);
};

exports.search = async (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  if (!q) return res.json([]);

  const results = photobooks.filter((b) => {
    const title = (b.Titulo || "").toLowerCase();
    const author = `${b.NombreFotografe || ""} ${b.ApellidoFotografe || ""}`.toLowerCase();
    const country = (b.Pais || "").toLowerCase();
    const editorial = (getField(b, "Editorial") ?? "").toString().toLowerCase();

    return `${title} ${author} ${country} ${editorial}`.includes(q);
  });

  res.json(results.slice(0, 20));
};