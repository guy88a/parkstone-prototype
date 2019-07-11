/**
 * GAME MANAGER
 */

// Imports ================================================================= //
import log from './log.js';
import invokeLoader, { getGameAssets, } from './loader.js';
import initGameLoop from './gameLoop.js';
import initGamePhysics from './physicsManager.js';
import activateAnimations from './animationManager.js';

// Config ================================================================== //
const UI_LOAD = document.getElementById('load-log');

let gameAssets = {
    toLoad: [],
    loaded: {},
};

// Main ==================================================================== //
/**
 * preloading assets and invoking a start game function
 * @param {Function} onloadCallback | operation to perform after loading assets
 */
export default function initGame(onloadCallback) {
    preloadGame(onloadCallback);
}

/**
 * defines what assets should be loaded
 * @param {Array} assets 
 */
export function defineAssets(assets) {
    getGameAssets().toLoad = assets;
}

// Preload ================================================================= //
/**
 * preloading the game assets that were defined
 * attaches a listener to the 'GameAssetsLoaded' event
 * @param {Function} onloadCallback | operation to perform after loading assets (like initiating input / physics)
 * @param {Function} startGameCallback | start running the game (as desired, has a default)
 */
function preloadGame(onloadCallback, startGameCallback = startGame) {
    document.addEventListener('GameAssetsLoaded', function() {
        log('Game is ready to start', 'info');
        if(typeof startGameCallback === 'function') {
            startGameCallback(onloadCallback);
        }
    });
    invokeLoader(getGameAssets('load')); //TODO replace get assets
}

// Start =================================================================== //
/**
 * a default start game function
 * initiates the game loop
 */
function startGame(onloadCallback) {
    log('Game started!', 'success');
    if(typeof onloadCallback === 'function') {
        onloadCallback();
    } else {
        log('onloadCallback is not a function', 'error');
    }
    printLoadTime(new Date().getTime() - window.startTS);
    initGamePhysics();
    activateAnimations();
    initGameLoop();
}

// Misc ==================================================================== //
function printLoadTime(loadTime) {
    UI_LOAD.innerHTML = `Load : ${loadTime}ms`;
}