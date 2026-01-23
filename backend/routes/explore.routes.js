const express = require("express");
const router = express.Router();
const { getPublicProjects } = require("../controllers/explore.controller");

router.get("/projects", getPublicProjects);

module.exports = router;
