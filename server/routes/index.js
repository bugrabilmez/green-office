const express = require("express");
const index = express.Router();
const ormFactory = require("../core/orm/factory").instance();

index.get("/", (req, res) => {
  res.render("index");
});

index.get("/getContest", (req, res) => {
  ormFactory.getAll(req.app.locals.db.EntContest, data => {
    res.json(data);
  });
});

module.exports = index;
