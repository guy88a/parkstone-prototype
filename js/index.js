// Imports ================================================================= //
import log from './log.js';
import initGame, { defineAssets } from './gameManager.js';
import initInputManager, { mapHandlers } from './inputManager.js';
import Unit from './classes/Unit.js';
import initObjectsManager, { getGameObjects } from './objectsManager.js';

// Consts ================================================================== //
const EL_GAME = document.getElementById('game-canvas');

const IMG_GROUND = 'ground.png';
const IMG_BACKGROUND = 'background.png';
const IMG_CLOUDS = 'clouds_a2.png';
const IMG_UNIT = 'hero--uther_s1-4d205-676.png';

// Setters & Getters ======================================================= //


// Exports ================================================================= //


// Test ==================================================================== //
function onLoadInvoker() {
    mapHandlers(['down_40', 'up_38'], [a, b]);
    initInputManager();
}

defineAssets([IMG_GROUND, IMG_BACKGROUND, IMG_CLOUDS, IMG_UNIT]);
initGame(onLoadInvoker);

function a() { log('function a') }
function b() { log('function b') }

var gameObjsArr = [
    ['Unit', 'Uther', {}],
    ['Unit', 'Enemy', {}],
    ['Object', 'Obstacle', {}],
    ['Asset', 'Clouds', {}]
]

initObjectsManager(gameObjsArr);
var gom = getGameObjects();
var testse = 0;

//let uther = new Unit();

