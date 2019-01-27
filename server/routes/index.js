const express = require("express");
const index = express.Router();
const ormFactory = require("../core/orm/factory").instance();
const _ = require('lodash');

index.get("/", (req, res) => {
  res.render("index");
});

index.get("/getContest", (req, res) => {
  ormFactory.getAll(req.app.locals.db.EntContest, data => {
    res.json(data);
  });
});

index.get("/getQuestions", (req, res) => {
  ormFactory.find(req.app.locals.db.EntQuestion, { contestId: req.query.contestId }, data => {
    res.json(data);
  });
});

index.get("/getAnswers", (req, res) => {
  ormFactory.find(req.app.locals.db.EntAnswer, { questionId: req.query.questionId }, data => {
    res.json(data);
  });
});

module.exports = index;
