const express = require("express");
const router = express.Router();

const api = require("../api/rameses-db-migration");


router.get("/build", async (req, res) => {
  try {
    console.log("get build");
    await api.buildModules();
    res.json({status: 'ok'});
  } catch (error) {
    res.json({status: "error", error})
  }
});

router.get("/build/:moduleId", async (req, res) => {
  const { moduleId } = req.params;
  try {
    const module = await api.getModule(moduleId);
    await api.buildModule(module);
    res.json({status: 'ok'});
  } catch (error) {
    res.json({status: "error", error})
  }
});

router.post("/build/:moduleId", async (req, res) => {
  const { module } = req.body;
  try {
    await api.buildModule(module);
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
    const module = await api.getModule(moduleId)
    const files = await api.getModuleFiles(module);
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
