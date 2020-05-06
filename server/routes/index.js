const express = require('express');
const index = express.Router();
const ormFactory = require('../core/orm/factory').instance();
const _ = require('lodash');
const moment = require('moment');
const contestUtils = require('../utils/contest');

index.get('/', (req, res) => {
  res.render('index');
});

index.get('/getContest', (req, res, next) => {
  return ormFactory.getAll(req.app.locals.db.EntContest).then(result => {
    result.forEach(c => {
      c.dataValues = { ...c.dataValues, ...contestUtils.calculateRemaining(c.dataValues.startingDate) }
    });
    return res.json(result);
  }).catch((err) => {
    next(err);
  });
});

index.get('/reset/:m', (req, res, next) => {
  return ormFactory.find(req.app.locals.db.EntContest, { id: 2 }).then(contest => {
    contest[0].isCompleted = false;
    contest[0].startingDate = moment().add(parseInt(req.params.m), 'second');
    return contest[0].save().then(result => {
      return req.app.locals.db.EntCompetitorAnswer.destroy({
        where: {},
        truncate: true
      }).then(result => {
        return res.json({ result: `Reset was successfully, now + ${req.params.m} second:  new starting date: ${contest[0].startingDate}` });
      });
    });
  }).catch((err) => {
    next(err);
  });
});

index.get('/getQuestions', (req, res, next) => {
  return ormFactory.find(req.app.locals.db.EntQuestion, { contestId: req.query.contestId }).then(data => {
    return res.json(data);
  }).catch((err) => {
    next(err);
  });
});

index.get('/getAnswers', (req, res, next) => {
  return ormFactory.find(req.app.locals.db.EntAnswer, { questionId: req.query.questionId }).then(data => {
    return res.json(
      data.map(x => {
        return { id: x.id, answer: x.answer, questionId: x.questionId };
      })
    );
  }).catch((err) => {
    next(err);
  });
});

index.post('/sendAnswer', (req, res, next) => {
  return ormFactory.create(
    req.app.locals.db.EntCompetitorAnswer,
    {
      identity: req.body.username,
      ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      answerId: req.body.answerId,
      questionId: req.body.questionId
    })
    .then(
      data => {
        return res.json(data);
      })
    .catch((err) => {
      next(err);
    });
});

index.get('/getResult', (req, res, next) => {
  return ormFactory.find(req.app.locals.db.EntAnswer, { questionId: req.query.questionId }).then(answers => {
    return ormFactory.find(req.app.locals.db.EntCompetitorAnswer, { questionId: req.query.questionId }).then(competitorAnswers => {
      const result = [];
      answers.forEach(answer => {
        result.push({
          id: answer.id,
          count: competitorAnswers.filter(x => x.answerId === answer.id).length,
          isTrue: answer.isTrue,
          answerInfo: answer.answerInfo
        });
      });
      return res.json(result);
    }).catch((err) => {
      next(err);
    });
  }).catch((err) => {
    next(err);
  });
});

index.get('/createContestResult', (req, res) => {
  return ormFactory.find(req.app.locals.db.EntContest, { id: req.query.contestId }).then(contest => {
    return ormFactory.find(req.app.locals.db.EntQuestion, { contestId: req.query.contestId }).then(questions => {
      const questionIdList = questions.map(q => q.id);
      return ormFactory.find(req.app.locals.db.EntAnswer, { questionId: { $in: questionIdList } }).then(answers => {
        return ormFactory.find(req.app.locals.db.EntCompetitorAnswer, { questionId: { $in: questionIdList } }).then(competitorAnswers => {
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
          return contest[0].save().then(result => {
            return res.json({
              winners,
              result
            });
          });
        });
      });
    });
  });
});

index.post('/saveUsername', (req, res, next) => {
  return ormFactory.findOne(req.app.locals.db.EntUser, { username: req.body.username })
    .then(user => {
      return user;
    })
    .then((user) => {
      if (user) {
        return res.json({ saveSuccessfull: false });
      } else {
        return ormFactory.create(req.app.locals.db.EntUser, { username: req.body.username })
          .then(data => {
            return res.json({ user: data, saveSuccessfull: true });
          })
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch(err => next(err));

})

module.exports = index;
