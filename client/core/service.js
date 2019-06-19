import axios from "axios";
import moment from "moment";
import momentTz from "moment-timezone";

const _ = require("lodash");

const instance = axios.create({
  timeout: 2500
});

const _calculateRemaining = startingDate => {
  const now = momentTz().tz("Europe/Istanbul");
  const state = {};

  state.timeRemaining = momentTz(startingDate - now).tz("Europe/Istanbul");
  state.timeRemainingDays = parseInt(state.timeRemaining.format("D")) - 1;
  state.timeRemainingHours = parseInt(state.timeRemaining.format("H")) - 2;
  state.timeRemainingMinutes = parseInt(state.timeRemaining.format("mm"));
  state.timeRemainingSeconds = parseInt(state.timeRemaining.format("ss"));

  if (state.timeRemaining._i < 0) {
    state.isTimeUp = true;
    state.countDown = false;
  }

  if (
    state.timeRemainingMinutes < 3 &&
    state.timeRemainingDays === 0 &&
    state.timeRemainingHours === 0
  ) {
    state.countDown = true;
    state.isTimeUp = false;
  }

  return state;
};

const _getContest = callback => {
  instance.get("/getContest").then(response => {
    const contests = _.sortBy(response.data, ["id"]);
    let contest = {
      id: contests[0].id,
      name: contests[0].name,
      description: contests[0].description,
      isCompleted: contests[0].isCompleted,
      hasStarted: false
    };

    contest.startingDate = momentTz(contests[0].startingDate).tz(
      "Europe/Istanbul"
    );

    contest = Object.assign(contest, _calculateRemaining(contest.startingDate));
    contest.hasStarted = !!contest.isTimeUp;

    contest.startingDateString = contest.startingDate
      .locale("tr")
      .format("Do MMMM YYYY, H:mm");

    callback(contest);
  });
};

const _getQuestions = (contestId, callback) => {
  instance
    .get("/getQuestions", {
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
    .get("/getAnswers", {
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
    .post("/sendAnswer", {
      answerId,
      questionId,
      username: localStorage.getItem("username")
    })
    .then(response => {
      callback(response);
    });
};

const _getResult = (questionId, callback) => {
  instance
    .get("/getResult", {
      params: {
        questionId
      }
    })
    .then(response => {
      callback(response);
    });
};

module.exports = {
  getContest: _getContest,
  calculateRemaining: _calculateRemaining,
  getQuestions: _getQuestions,
  getAnswers: _getAnswers,
  sendAnswer: _sendAnswer,
  getResult: _getResult
};
