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

    // set name
    data.name = nameParams[0];

    // set rest of the properties
    for(var i = 1; i < nameParams.length; i++) {
        let param = nameParams[i];
        let key = getKeyName(param);
        if(data.hasOwnProperty(key)) {
            log(`Duplicated param ${key} name in image: ${imageName}`);
        } else {
            data[key] = getParamValue(param);
        }
    }

    if(data.spritesheet && data.spritesheet.length > 0) {
        data.settings = generateSettings({ spritesheet: data.spritesheet});
    }

    return data;
}

function getUnitSettings(imageName) {

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

/**
 * 
 * @param {String} settings 
 */
function generateSettings({spritesheet, animations}) {
    spritesheet = getSpritesheetDate(spritesheet);
    return {
        spritesheet: spritesheet,
        animation: {}
    }
}

function getSpritesheetDate(spriteSettings) {
    let spriteParams = spriteSettings.split('f');
    let source = spriteParams[0];
    let frame = spriteParams[1];
    let pos = '0';
    let steps = 0;
    let timestep = '1000x40';

    if(frame.includes('p')) {
        frame = frame.split('p')[0];
        pos = frame.split('p')[1];
    }

    if(pos.includes('t')) {
        pos = frame.split('t')[0];
        timestep = frame.split('t')[1];
    }

    source = splitParamValue(source);
    source = { w: source[0] * 1, h: source[1] * 1 };

    frame = splitParamValue(frame);
    steps = frame[0];
    frame = { w: source.w / frame[0], h: source.h * 1 };

    pos = pos * 1;

    timestep = splitParamValue(timestep);
    timestep = Number(timestep[0] / timestep[1]);

    return {
        sourceSize: source,
        frameSize: frame,
        pos: pos,
        direction: 1,
        timestep: timestep
    }
}

function splitParamValue(paramValue, splitChar = 'x') {
    return paramValue.includes(splitChar) ?
            paramValue.split(splitChar) : [paramValue];
}