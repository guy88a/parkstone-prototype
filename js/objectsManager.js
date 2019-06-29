/**
 * GAME OBJECTS MANAGER
 * Units, Obstacles, Background...
 * 
 */

// Imports ================================================================= //
import log from './log.js';
import GameObject from './classes/GameObject.js';
import Unit from './classes/Unit.js';

// Config ================================================================== //
let GameObjects = {
    Units: new Map(),
    Objects: new Map(),
    Assets: new Map(),
}

// Main ==================================================================== //
/**
 * functionName
 */
export default function initObjectsManager(gameObjetsArray) {
    log('initObjectsManager', 'info');
    initGameObjects(gameObjetsArray);
}

// Setters & Getters ======================================================= //
export function getGameObjects() {
    return GameObjects;
}

export function getGameObject(type, name) {
    return GameObjects[type].get(name);
}


// Generators ============================================================== //
function createNewUnit({source, position, collision, velocity, animated}) {
    return new Unit(source, position, collision, velocity, animated);
}


function createNewObject({source, position, collision, velocity, animated}) {
    return new GameObject(source, position, collision, velocity, animated);
}


function createNewAsset({source, position, animated}) {
    return new GameObject(source, position, false, false, animated);
}

function newGameObject(type, params) {
    return type === 'Unit' ? createNewUnit(params) :
           type === 'Object' ? createNewObject(params) :
           type === 'Asset' ? createNewAsset(params) :
           false;
}

function initGameObjects(objectsArray = []) {
    if(objectsArray.length < 1) {
        log('No game objects to set', 'info');
        return;
    }

    for(var i = 0; i < objectsArray.length; i++) {
        GameObjectMapper(objectsArray[i]);
    }

    log('Game objects are mapped!', 'success');
}

// Mappers ================================================================= //
function GameObjectMapper(objectArray) {
    let type = objectArray[0];
    let name = objectArray[1];
    let params = objectArray[2];
    GameObjects[`${type}s`].set(name, newGameObject(type, params));
}
// Misc ==================================================================== //
