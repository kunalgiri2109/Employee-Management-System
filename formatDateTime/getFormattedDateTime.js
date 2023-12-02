const { DateTime } = require('luxon');

function getFormattedDateTime() {
    const currentDateTimeLocal = DateTime.local();
    const formattedDateTime = currentDateTimeLocal.toFormat('yyyy-MM-dd HH:mm:ss');
    
    return formattedDateTime;
}

module.exports = { getFormattedDateTime };
