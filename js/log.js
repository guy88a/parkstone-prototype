/**
 * GAME LOG - MESSAGES LOGGER
 */

// Main ============================ //

/**
 * log a message to the console
 * @param {String} message | message to be logged
 * @param {String} type    | log type (log, info, warn, error)
 */
export default function log(message, type = 'log') {
    console[convertCustomType(type)](getMessageTemplate(message), getLabelStyle(type), getmessageStyle());
}

// Misc ============================ //

/**
 * generate a message string to be styled
 * @param {String} message | message to be logged
 */
function getMessageTemplate(message) {
    return `%c Game Log : %c ${message}`
}

/**
 * generate style for the log label in the console
 * @param {String} logType | log type (log, info, warn, error)
 */
function getLabelStyle(logType) {
    return `margin: 2px 0; padding: 2px 0px; font-family: Open Sans; color: #fff; border-radius: 2px; background-color: #${getColor(logType)}`;
}

/**
 * generate the message text style
 */
function getmessageStyle() {
    return `font-family: Open Sans`;
}

/**
 * if a custom type has been passed to log - converts it
 * @param {String} logType | log type
 */
function convertCustomType(logType) {
    return logType === 'success' ? 'info' : logType;
}

/**
 * generate color by message type
 * @param {String} logType | log type (log, info, warn, error)
 */
function getColor(logType = '') {
    return (logType === '' || logType === 'log') ? 'c3c3c3':
           (logType === 'info')                  ? '55c1ff':
           (logType === 'success')               ? '23bf3d':
           (logType === 'warn')                  ? 'ffa133':
           (logType === 'error')                 ? 'de332f':
           /* default */                           'c3c3c3';
}