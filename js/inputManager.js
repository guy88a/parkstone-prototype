/**
 * INPUT MANAGER
 * 
 */

// Imports ================================================================= //
import log from './log.js';

// Config ================================================================== //
let Mapper = new Map();

// Main ==================================================================== //
/**
 * initiate the imput manager
 */
export default function initInputManager() {
    addAllKeysLieteners();
    log('Input Manager initiated', 'info');
}

export function mapHandlers(typeArray, callbacksArray) {
    if(typeArray.length == callbacksArray.length) {
        log('Mapping events handlers', 'info');
        mapEventsHandlers(typeArray, callbacksArray);
    } else {
        log('Could not map event handlers, event-types and callbacks arrays are not equal', 'error');
    }
}

// Listeners & Handlers ==================================================== //
/**
 * iterate through all event types passed (down, up, pressed...)
 * @param {Array} eventsTypesArray | all events types to listen to
 */
function addAllKeysLieteners(eventsTypesArray = ['down', 'up', 'pressed']) {
    for(var i = 0; i < eventsTypesArray.length; i++) {
        addKeysListener(eventsTypesArray[i]);
    }
}

/**
 * initiate a listener to keys events by type (down, up, pressed...)
 * @param {String} eventType | type of key event
 * @param {Function} callback | function to invoke on dispatch
 */
function addKeysListener(eventType) {
    document.addEventListener(`key${eventType}`, invokeHandler.bind(eventType));
    log(`Successfully initiated a key${eventType} event`, 'success');
}

/**
 * get and invoke handler by keyCode and event type
 * @param {Event} event | the event received from addEventListener
 */
function invokeHandler(event) {
    getEventHandler(this, event.keyCode)();
}

/**
 * validate handler received from Mapper
 * @param {String} eventType | type of key event
 * @param {Number} keyCode | event's keyCode
 */
function getEventHandler(eventType, keyCode) {
    let handler = getHandlerFromMap(eventType, keyCode);
    return typeof handler === 'function' ? handler : function(){ return; };
}

// Mapping ================================================================= //
function addHandlerToMap(eventName, handlerCallback) {
    Mapper.set(`${eventName}`, handlerCallback);
}

function getHandlerFromMap(eventType, keyCode) {
    return Mapper.get(`${eventType}_${keyCode}`);
}

function mapEventsHandlers(typeArray, callbacksArray) {
    for(var i = 0; i < typeArray.length; i++) {
        addHandlerToMap(typeArray[i], callbacksArray[i]);
    }
    log('Event handlers are mapped!', 'success');
}

// Misc ==================================================================== //