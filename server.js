const express = require("express");
const cors = require("cors");
const photobookRoutes = require("./routes/photobookRoutes");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
  })
);

app.use(express.json());

// Servir imágenes desde /public/img
app.use("/img", express.static("public/img"));

// Rutas de fotolibros
app.use("/fotolibros", photobookRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
