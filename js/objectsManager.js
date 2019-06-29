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
let GameObjectsUpdater = {
    Unit: updateUnitProp,
    Object: updateObjectProp,
    Asset: updateAssetProp,
}
let GameObjectsTypes = {}

// Main ==================================================================== //
/**
 * initiate all game objects
 * @param {Array} gameObjetsArray | 2d array, each inner array contains the game object's data
 */
export default function initObjectsManager(gameObjetsArray) {
    log('Initiating all game objects', 'info');
    initGameObjects(gameObjetsArray);
}

/**
 * updates a game object's property
 * @param {String} name | unit's name
 * @param {String} prop | property's name to update
 * @param {*} value | value to set
 */
export function updateGameObject(name, prop, value) {
    let type = getUnitTypeByName(name);
    return GameObjectsUpdater[type](name, prop, value);
}

// Setters & Getters ======================================================= //
/**
 * get the GameObjects json
 * contains all game objects created
 */
export function getGameObjects() {
    return GameObjects;
}

/**
 * get a specific game object
 * @param {String} type | object's type (Unit, Object, Asset)
 * @param {String} name | object's name
 */
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

/**
 * create a new game object by type
 * @param {String} type | object's type (Unit, Object, Asset)
 * @param {String} params | contains the game object's data
 */
function newGameObject(type, params) {
    return type === 'Unit' ? createNewUnit(params) :
           type === 'Object' ? createNewObject(params) :
           type === 'Asset' ? createNewAsset(params) :
           false;
}

/**
 * define and set all desired game objects
 * @param {Array} objectsArray | 2d array, each inner array contains the game object's data
 */
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
/**
 * create and map a new game object
 * @param {Array} objectArray | contains the object's data
 */
function GameObjectMapper(objectArray) {
    let type = objectArray[0];
    let name = objectArray[1];
    let params = objectArray[2];
    GameObjectsTypes[name] = type;
    GameObjects[`${type}s`].set(name, newGameObject(type, params));
}

// Misc ==================================================================== //
function updateUnitProp(name, prop, value) {
    return GameObjects.Units.get(name)[prop] = value;
}

function updateObjectProp(name, prop, value) {
    return GameObjects.Objects.get(name)[prop] = value;
}

function updateAssetProp(name, prop, value) {
    return GameObjects.Assets.get(name)[prop] = value;
}

function getUnitTypeByName(name) {
    return GameObjectsTypes[name];
}