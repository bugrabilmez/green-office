const momentTz = require('moment-timezone');
const moment = require('moment');

const calculateRemaining = startingDate => {
    const now = momentTz().tz('Europe/Istanbul');
    const state = {
        startingDateLocale: momentTz(startingDate).tz('Europe/Istanbul'),
        countDown: false,
        isTimeUp: false
    };

    state.startingDateString = state.startingDateLocale.locale('tr').format('DD MMMM YYYY, H:mm');

    state.timeRemaining = momentTz(startingDate - now).tz('Europe/Istanbul');
    state.timeRemainingDays = parseInt(state.timeRemaining.format('D')) - 1;
    state.timeRemainingHours = parseInt(state.timeRemaining.format('H')) - 2;
    state.timeRemainingMinutes = parseInt(state.timeRemaining.format('mm'));
    state.timeRemainingSeconds = parseInt(state.timeRemaining.format('ss'));

    if (state.timeRemaining._i < 0) {
        state.isTimeUp = true;
        state.countDown = false;
    }

    if (state.timeRemainingMinutes < 3 && state.timeRemainingDays === 0 && state.timeRemainingHours === 0) {
        state.countDown = true;
        state.isTimeUp = false;
    }

    return state;

};

const calculateNextQuestionRemaining = (startingDate, questionOrder) => {
    const now = momentTz().tz('Europe/Istanbul');
    const nextQuestionTime = moment(startingDate).add(parseInt(questionOrder, 'm'));
    let timeRemainingSeconds = 20;

    const timeRemaining = momentTz(nextQuestionTime - now).tz('Europe/Istanbul');
    timeRemainingSeconds = parseInt(timeRemaining.format('ss'));

    return timeRemainingSeconds;

};

module.exports = {
    calculateRemaining: calculateRemaining,
    calculateNextQuestionRemaining: calculateNextQuestionRemaining

}