async function runAllSeeders() {
  console.log("🚀 Iniciando seeders custom...");

  await require("./authorSeeder")();
  await require("./photobooksSeeder")();
  await require("./photobookImageSeeder")();
  await require("./userSeeder")();

  console.log("✅ Todos los seeders ejecutados correctamente");
}

runAllSeeders();
