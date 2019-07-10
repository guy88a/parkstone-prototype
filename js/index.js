// Imports ================================================================= //
import log from './log.js';
import initGame, { defineAssets } from './gameManager.js';
import initInputManager, { inputMapHandlers } from './inputManager.js';
import Unit from './classes/Unit.js';
import initObjectsManager, { getGameObjects } from './objectsManager.js';

// Consts ================================================================== //
const EL_GAME = document.getElementById('game-canvas');

const IMG_GROUND = 'ground_t-a_a-0.png';
const IMG_BACKGROUND = 'background_t-a_a-1.png';
const IMG_CLOUDS = 'clouds_t-a_a-1.png';
const IMG_UNIT = 'hero_t-u_s-676x205f4_c-1.png';

// Setters & Getters ======================================================= //


// Exports ================================================================= //


// Test ==================================================================== //
window.startTS = new Date().getTime();

function onLoadInvoker() {
    function a() { log('function a') }
    function b() { log('function b') }
    function jump() {
        this.jump();
    }
    inputMapHandlers(['down_40', 'up_38', 'press_32'], [[a,false], [b,false], [jump, 'Unit,Hero']]);
    initInputManager();
}

/*var gameObjsArr = [
    ['Unit', 'Uther', {}],
    ['Unit', 'Enemy', {}],
    ['Object', 'Obstacle', {}],
    ['Asset', 'Clouds', {}]
]
initObjectsManager(gameObjsArr); // must be invoked after assets were loaded, and before game loop  was initiated
*/

defineAssets([IMG_GROUND, IMG_BACKGROUND, IMG_CLOUDS, IMG_UNIT]);
initGame(onLoadInvoker);

var gom = getGameObjects();
var testse = 0;

