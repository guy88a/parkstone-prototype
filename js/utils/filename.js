/**
 * FILENAME UTIL
 * Map file names to asset data
 * 
 */

// Imports ================================================================= //
import log from '../log.js';

// Config ================================================================== //
const keyByChar = {
    a: "animated",
    c: "collision",
    p: "physics",
    s: "spritesheet",
    t: "type",
}

// Main ==================================================================== //
/**
 * extract data from file name
 * @param {*} fileName | name of file (extension included)
 */
export default function getImageData(fileName) {
    return getDataFromName(getImageName(fileName));
}

export function capFirstChar(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Setters & Getters ======================================================= //


// Name Handlers =========================================================== //
/**
 * remove a file name's extension
 * @param {String} fileName | full file name (path excluded)
 */
function getImageName(fileName) {
    if(isValidFilename(fileName)) {
        return fileName.split('.').slice(0, -1).join('.');
    } else {
        log(`invalid file name: ${fileName}`, 'error');
    }
}

/**
 * generate a unit's name by image's name
 * - returns { animated, collision, spritesheet, type }
 * @param {String} imageName | file name (extension excluded)
 */
function getDataFromName(imageName) {
    let data = {};
    let nameParams = imageName.split('_');

    for(var i = 0; i < nameParams.length; i++) {
        let param = nameParams[i];
        let key = getKeyName(param);
        if(data.hasOwnProperty(key)) {
            log(`Duplicated param ${key} name in image: ${imageName}`);
        } else {
            data[key] = getParamValue(param);
        }
    }

    return data;
}

// Misc ==================================================================== //
function getKeyName(param) {
    let keyChar = param.split('-')[0];
    return keyByChar[keyChar];
}

function getParamValue(param) {
    let value = param.split('-')[1];
    return value;
}

function isValidFilename(fileName) {
    if(!fileName.includes('.')) {
        log(`invalid filename: ${fileName}`);
        return;
    }
    return true;
}