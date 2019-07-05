/**
 * LOADER
 * Load assets (images, sounds, etc..) into the game
 */

 // Imports ================================================================ //
 import log from './log.js';
 import { capFirstChar, } from './utils/filename.js';
 import { createNewGameObject } from './objectsManager.js';

 // Config ================================================================= //
const IMG_MAIN_PATH = '../images/gameobjects/';
const EVENT_LOADED = new Event('GameAssetsLoaded');

let filesToLoad = 0;
let filesLoaded = 0;

let gameAssets = {
    toLoad: [],
    loaded: {},
};

let loadTime = 0;

// Main ==================================================================== //
/**
 * check if any assets to load
 * @param {Array} gameAssetsArray | contains images names
 */
export default function invokeLoader(gameAssetsArray = []) {
    if(gameAssetsArray.length > 0) {
        loadAllAssets(gameAssetsArray);
    } else {
        log('No assets to load', 'info');
    }
}

export function getGameAssets(status = '', name) {
    return status === 'load' ? name ? gameAssets.toLoad[capFirstChar(name)] : gameAssets.toLoad :
           status === 'loaded' ? name ? gameAssets.loaded[capFirstChar(name)] : gameAssets.loaded : gameAssets;
}

/**
 * get the Image of a loaded asset
 * @param {String} name | asset's name
 */
export function getLoadedAsset(name = "") {
    return gameAssets.loaded[capFirstChar(name)];
}

// Misc ==================================================================== //
/**
 * load all assets to the scene
 * triggers an event when done
 * @param {Array} assets | an array of images names
 */
function loadAllAssets(assets) {
    filesToLoad = assets.length;

    log(`Loading ${filesToLoad} assets...`, 'info');
    
    for(var i = 0; i < assets.length; i++) {
        loadAsset(assets[i]);
    }
}

/**
 * set a new image and load it
 * @param {String} asset | file's name (includeing image type)
 */
function loadAsset(asset) {
    let image = new Image();
    image.onload = onAssetLoad.bind(asset);
    image.src = getAssetPath(asset);
    getGameAssets().loaded[getAssetName(getImageName(asset))] = image;
}

/**
 * get an image path
 * @param {String} imageName | name of the image to load (includeing image type)
 */
function getAssetPath(imageName) {
    return `${IMG_MAIN_PATH}${imageName}`;
}

/**
 * trigger when an asset was loaded
 * count the number of files that was loaded
 * if all files are loaded, invoke a 'done' function
 * @param {Function} callback | gets a callback from isDoneLoading (if not a function - will not try to invoke)
 */
function assetLoaded(callback) {
    if(typeof callback === 'function') {
        log('All assets loaded!', 'success');
        callback();
    }
}

/**
 * check if all assets are loaded
 * @param {Function} donaloadingCallback | function to invoke when done loading
 */
function isDoneLoading(donaLoadingCallback = onDoneLoading) {
    return filesLoaded >= filesToLoad ? donaLoadingCallback: false;
}

/**
 * triggeres when an assets has been loaded
 * @param {String} asset | file name
 */
function onAssetLoad() {
    filesLoaded++;
    createNewGameObject(this);
    assetLoaded(isDoneLoading());
}

/**
 * triggers the 'GameAssetsLoaded' event
 */
function onDoneLoading() {
    log('Dispatching \'GameAssetsLoaded\' event', 'info');
    document.dispatchEvent(EVENT_LOADED);
}

// Utils =================================================================== //
/**
 * remove a file name's extension
 * @param {String} fileName | full file name (path excluded)
 */
function getImageName(fileName) {
    return fileName.split('.').slice(0, -1).join('.');
}

/**
 * generate a unit's name by image's name
 * @param {*} imageName | file name (extension excluded)
 */
function getAssetName(imageName) {
    let name = imageName;
    if(name.includes('_')) {
        name = name.split('_')[0];
        if(name.includes('--')) {
            name = name.split('--')[1];
        }
    }
    return capFirstChar(name);
}