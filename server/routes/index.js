const express = require('express');
const index = express.Router();
const ormFactory = require('../core/orm/factory').instance();
const _ = require('lodash');
const moment = require('moment');
const contestUtils = require('../utils/contest');

index.get('/', (req, res) => {
  res.render('index');
});

index.get('/getContest', (req, res) => {
  ormFactory.getAll(req.app.locals.db.EntContest).then(result => {
    result.forEach(c => {
      c.dataValues = { ...c.dataValues, ...contestUtils.calculateRemaining(c.dataValues.startingDate) }
    });
    res.json(result);
  }).catch((err) => {
    console.log(err);
  });
});

index.get('/reset/:m', (req, res) => {
  ormFactory.find(req.app.locals.db.EntContest, { id: 1 }, contest => {
    contest[0].isCompleted = false;
    contest[0].startingDate = moment().add(parseInt(req.params.m), 'second');
    contest[0].save().then(result => {
      req.app.locals.db.EntCompetitorAnswer.destroy({
        where: {},
        truncate: true
      }).then(result => {
        res.json({ result: `Reset was successfully, now + ${req.params.m} second:  new starting date: ${contest[0].startingDate}` });
      });
    });
  });
});

index.get('/getQuestions', (req, res) => {
  ormFactory.find(req.app.locals.db.EntQuestion, { contestId: req.query.contestId }, data => {
    res.json(data);
  });
});

index.get('/getAnswers', (req, res) => {
  ormFactory.find(req.app.locals.db.EntAnswer, { questionId: req.query.questionId }, data => {
    res.json(
      data.map(x => {
        return { id: x.id, answer: x.answer, questionId: x.questionId };
      })
    );
  });
});

index.post('/sendAnswer', (req, res) => {
  ormFactory.create(
    req.app.locals.db.EntCompetitorAnswer,
    {
      identity: req.body.username,
      ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      answerId: req.body.answerId,
      questionId: req.body.questionId
    },
    data => {
      res.json(data);
    }
  );
});

index.get('/getResult', (req, res) => {
  ormFactory.find(req.app.locals.db.EntAnswer, { questionId: req.query.questionId }, answers => {
    ormFactory.find(req.app.locals.db.EntCompetitorAnswer, { questionId: req.query.questionId }, competitorAnswers => {
      const result = [];
      answers.forEach(answer => {
        result.push({
          id: answer.id,
          count: competitorAnswers.filter(x => x.answerId === answer.id).length,
          isTrue: answer.isTrue,
          answerInfo: answer.answerInfo
        });
      });
      res.json(result);
    });
  });
});

index.get('/createContestResult', (req, res) => {
  ormFactory.find(req.app.locals.db.EntContest, { id: req.query.contestId }, contest => {
    ormFactory.find(req.app.locals.db.EntQuestion, { contestId: req.query.contestId }, questions => {
      const questionIdList = questions.map(q => q.id);
      ormFactory.find(req.app.locals.db.EntAnswer, { questionId: { $in: questionIdList } }, answers => {
        ormFactory.find(req.app.locals.db.EntCompetitorAnswer, { questionId: { $in: questionIdList } }, competitorAnswers => {
          const userAnswers = _.chain(competitorAnswers)
            .groupBy('identity')
            .map((value, key) => ({ identity: key, answers: value }))
            .value();
          const winners = [];
          userAnswers.forEach(user => {
            let isWinner = true;
            questionIdList.forEach(questionId => {
              const questionTrueAnswer = answers.find(a => a.questionId === questionId && a.isTrue);
              const userAnswer = user.answers.find(a => a.questionId === questionId);
              if (!userAnswer || !questionTrueAnswer || userAnswer.answerId !== questionTrueAnswer.id) {
                isWinner = false;
              }
            });
            if (isWinner) {
              winners.push(user.identity);
            }
          });
          contest[0].isCompleted = true;
          contest[0].save().then(result => {
            res.json({
              winners,
              result
            });
          });
        });
      });
    });
  });
});

module.exports = index;
