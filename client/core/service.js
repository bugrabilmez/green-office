import axios from 'axios';

const instanceGetContest = axios.create({
  timeout: 2500
});

const instance = axios.create({
  timeout: 10000
});

const _getContest = callback => {
  instanceGetContest.get('/getContest').then(response => {
    let contest = response.data[0];
    contest.hasStarted = !!contest.isTimeUp;
    contest.status = true;
    callback(contest);
  });
};

const _getQuestions = (contestId, callback) => {
  instance
    .get('/getQuestions', {
      params: {
        contestId
      }
    })
    .then(response => {
      callback(response);
    });
};

const _getAnswers = (questionId, callback) => {
  instance
    .get('/getAnswers', {
      params: {
        questionId
      }
    })
    .then(response => {
      callback(response);
    });
};

const _sendAnswer = (answerId, questionId, callback) => {
  instance
    .post('/sendAnswer', {
      answerId,
      questionId,
      username: localStorage.getItem('username')
    })
    .then(response => {
      callback(response);
    });
};

const _getResult = (questionId, callback) => {
  instance
    .get('/getResult', {
      params: {
        questionId
      }
    })
    .then(response => {
      callback(response);
    });
};

const _getContestResult = (contestId, callback) => {
  instance
    .get('/createContestResult', {
      params: {
        contestId
      }
    })
    .then(response => {
      callback(response);
    });
};

const saveUsername = (username, callback) => {
  instance
    .post('/saveUsername', { username })
    .then(response => {
      callback(response);
    });
};

module.exports = {
  getContest: _getContest,
  getQuestions: _getQuestions,
  getAnswers: _getAnswers,
  sendAnswer: _sendAnswer,
  getResult: _getResult,
  getContestResult: _getContestResult,
  saveUsername
};
