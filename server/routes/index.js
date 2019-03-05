const express = require("express");
const index = express.Router();
const ormFactory = require("../core/orm/factory").instance();
const _ = require("lodash");

index.get("/", (req, res) => {
  res.render("index");
});

index.get("/getContest", (req, res) => {
  ormFactory.getAll(req.app.locals.db.EntContest, data => {
    res.json(data);
  });
});

index.get("/getQuestions", (req, res) => {
  ormFactory.find(
    req.app.locals.db.EntQuestion,
    { contestId: req.query.contestId },
    data => {
      res.json(data);
    }
  );
});

index.get("/getAnswers", (req, res) => {
  ormFactory.find(
    req.app.locals.db.EntAnswer,
    { questionId: req.query.questionId },
    data => {
      res.json(
        data.map(x => {
          return { id: x.id, answer: x.answer, questionId: x.questionId };
        })
      );
    }
  );
});

index.post("/sendAnswer", (req, res) => {
  var os = require('os');
var ifaces = os.networkInterfaces();
console.log(os.hostname()); //kullanici adini almamızı sağlar
    
  ormFactory.create(
    req.app.locals.db.EntCompetitorAnswer,
    {
      identity: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
      answerId: req.body.answerId,
      questionId: req.body.questionId
    },
    data => {
      res.json(data);
    }
  );
});

index.get("/getResult", (req, res) => {
  ormFactory.find(
    req.app.locals.db.EntAnswer,
    { questionId: req.query.questionId },
    answers => {
      ormFactory.find(
        req.app.locals.db.EntCompetitorAnswer,
        { questionId: req.query.questionId },
        competitorAnswers => {
          const result = [];
          answers.forEach(answer => {
            result.push({
              id: answer.id,
              count: competitorAnswers.filter(x => x.answerId === answer.id)
                .length,
              isTrue: answer.isTrue
            });
          });
          res.json(result);
        }
      );
    }
  );
});

module.exports = index;
