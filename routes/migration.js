const express = require("express");
const router = express.Router();

const api = require("../api/rameses-db-migration");

router.get("/modules", async (req, res) => {
  const modules = await api.getModules();
  return await res.json(modules);
});

router.get("/modules/:moduleId", async (req, res) => {
  const { moduleId } = req.params;
  const files = await api.getModuleFiles(moduleId);
  res.json(files);
});

router.post("/modules/:moduleId", async (req, res) => {
  const { module } = req.body;
  await api.updateModule(module)
  res.json(module);
});

module.exports = router;
