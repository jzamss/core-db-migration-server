const express = require("express");
const router = express.Router();

const api = require("../api/rameses-db-migration");


router.post("/build", async (req, res) => {
  try {
    await api.buildModules();
    res.json({status: 'ok'});
  } catch (error) {
    res.json({status: "error", error})
  }
});

router.post("/build/:moduleId", async (req, res) => {
  const { moduleId } = req.params;
  try {
    await api.buildModule(moduleId);
    res.json({status: 'ok'});
  } catch (error) {
    res.json({status: "error", error})
  }
});

router.get("/modules", async (req, res) => {
  const modules = await api.getModules();
  return await res.json(modules);
});

router.get("/modules/:moduleId", async (req, res) => {
  try {
    const { moduleId } = req.params;
    const files = await api.getModuleFiles(moduleId);
    res.json(files);
  } catch (err) {
    res.status(400).send({message: err});
  }
});

router.post("/modules/:moduleId", async (req, res) => {
  const { module } = req.body;
  await api.updateModule(module)
  res.json(module);
});


module.exports = router;
