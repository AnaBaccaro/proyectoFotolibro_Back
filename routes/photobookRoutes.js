const express = require("express");
const router = express.Router();

const {
  getAll,
  getLatest,
  getCurated,
  search
} = require("../controllers/photobookController");

// buscador
router.get("/buscar", search);

// Curaduría editorial
router.get("/curated", getCurated);

// Novedades
router.get("/latest", getLatest);

// Todos
router.get("/", getAll);

module.exports = router;
