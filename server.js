const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const photobookRoutes = require("./routes/photobookRoutes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://proyectofotolibro.com",
      "https://www.proyectofotolibro.com"
    ],
  })
);

app.use(express.json());

const IMG_DIR = path.join(__dirname, "public", "img");

// DEBUG: imprimí rutas reales al arrancar
console.log("SERVER FILE __dirname =", __dirname);
console.log("IMG_DIR =", IMG_DIR);
console.log("IMG_DIR exists =", fs.existsSync(IMG_DIR));

const files = fs.existsSync(IMG_DIR)
  ? fs.readdirSync(IMG_DIR).slice(0, 20)
  : [];

console.log("IMG_DIR sample files =", files);

// Servir imágenes
app.use("/img", express.static(IMG_DIR));

// DEBUG: endpoint para ver si el server ve el directorio
app.get("/__debug/img", (req, res) => {
  const exists = fs.existsSync(IMG_DIR);

  const files = exists
    ? fs.readdirSync(IMG_DIR).slice(0, 50)
    : [];

  res.json({
    __dirname,
    IMG_DIR,
    exists,
    sampleFiles: files,
  });
});

app.use("/fotolibros", photobookRoutes);

/*
-----------------------------------
EXPORT PARA VERCEL
-----------------------------------
*/

module.exports = app;

/*
-----------------------------------
SERVER LOCAL (solo localhost)
-----------------------------------
*/

if (require.main === module) {
  const PORT = process.env.PORT || 3001;

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}