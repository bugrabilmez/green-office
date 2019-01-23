import axios from "axios";
import moment from "moment";
import momentTz from "moment-timezone";

const _ = require('lodash');

const instance = axios.create({
  timeout: 2500
});

const _calculateRemaining = (startingDate) => {
  const now = momentTz().tz('Europe/Istanbul');
  const state = {};
  state.timeRemaining = momentTz(startingDate - now).tz('Europe/Istanbul');
  state.timeRemainingDays = parseInt(state.timeRemaining.format('D')) - 1;
  state.timeRemainingHours = parseInt(state.timeRemaining.format('H')) - 2;
  state.timeRemainingMinutes = parseInt(state.timeRemaining.format('m'));
  state.timeRemainingSeconds = parseInt(state.timeRemaining.format('s'));
  if (state.timeRemainingHours < 0 || state.timeRemainingDays < 0 || state.timeRemainingMinutes < 0 || state.timeRemainingSeconds < 0) {
    state.isTimeUp = true;
    state.countDown = false;
  }
  if (state.timeRemainingMinutes < 3 && state.timeRemainingDays === 0 && state.timeRemainingHours === 0) {
    state.countDown = true;
    state.isTimeUp = false;
  }
  return state;
}

const _getContest = (callback) => {
  instance.get("/getContest").then(response => {
    const contests = _.sortBy(response.data, ['id']);
    let contest = {
      name: contests[0].name,
      description: contests[0].description
    };
    contest.startingDate = momentTz(contests[0].startingDate).tz('Europe/Istanbul');
    contest = Object.assign(contest, _calculateRemaining(contest.startingDate));
    contest.startingDateString = contest.startingDate.locale("tr").format("Do MMMM YYYY, H:mm");
    callback(contest);
  });
};



module.exports = {
  getContest: _getContest,
  calculateRemaining: _calculateRemaining
};
