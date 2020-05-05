const momentTz = require('moment-timezone');

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

module.exports = {
    calculateRemaining: calculateRemaining
}