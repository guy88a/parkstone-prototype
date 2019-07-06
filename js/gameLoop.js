/**
 * GAME LOOP
 * Handles the main game loop
 */

// Imports ================================================================= //
import log from './log.js';
import { getGameAssets, } from './loader.js';
import { getGameObjects, getGameObject } from './objectsManager.js';

// Config ================================================================== //
const EL_CANVAS = document.getElementById('game-canvas');
const CTX = EL_CANVAS.getContext('2d');
const UI_FPS = document.getElementById('fps-log');
const UI_CHILL = document.getElementById('chill-log');

var hero = getGameAssets('loaded')['Hero'];
var uther;

let unitPos = 0;
let unitPosY = 0;
let unitLastPos = 0;
let unitVelocity = 0.3;
let limit = EL_CANVAS.clientWidth - 169;

let timesChilled = 0;
let lastFrameTimeMS = 0;
let delta = 0;
var maxFPS = 90;
var timestep = 1000 / 90;
let fps = maxFPS;
let framesThisSecond = 0;
let lastFpsUpdate = 0;

// manager
let frameID = 0;
let started = false;
let running = false;

// Main ==================================================================== //
/**
 * initiate the requestAnimationFrame loop
 */
export default function initGameLoop() {
    log('Starting game loop', 'info');
    startMainLoop(mainLoop);
}

/**
 * main game loop - invoked by 'requestAnimationFrame'
 * @param {Number} timestamp | passed by default from 'requestAnimationFrame'
 */
function mainLoop(timestamp) {
    // check if entered the frame too soon
    if(shouldSkipFrame(timestamp)) {
        requestAnimationFrame(mainLoop);
        return;
    }

    // update data
    setDelta(calcDelta(timestamp));
    setLastFrameTs(timestamp);
    calcFPS(timestamp);

    // update game state
    let numUpdateSteps = 0;
    while(delta >= timestep) {
        update(timestep);
        stepUpdate();
        // Overload check
        if(++numUpdateSteps >= 240) {
            chill();
            break;
        }
    }

    // draw and request the next frame
    draw(delta / timestep);
    requestAnimationFrame(mainLoop);
}

/**
 * reset delta when overloaded
 */
function chill() {
    timesChilled++;
    delta = 0;
}

// Setters & Getters ======================================================= //
// setters
function setDelta(value) {
    delta = value;
}

function setFPS(value) {
    fps = value;
}

function setLastFrameTs(value) {
    lastFrameTimeMS = value;
}

// getters
function getDelta() {
    return delta;
}

function getTimestep() {
    return timestep;
}

function getMaxFPS() {
    return maxFPS;
}

// Checkers ================================================================ //
/**
 * check if entered a frame too soon
 * @param {Number} ts | timestamp
 * @param {*} lastFrameTs | last rendered frame timestamp
 */
function shouldSkipFrame(ts, lastFrameTs = lastFrameTimeMS) {
    return ts < lastFrameTs + (1000 / getMaxFPS());
}

// Calculations ============================================================ //
/**
 * calculate the delta time
 * @param {Number} ts | timestamp
 * @param {*} lastTs | last frame rendered timestamp
 */
function calcDelta(ts, lastTs = lastFrameTimeMS) {
    return ts - lastTs;
}

/**
 * calculate frames rendered per second
 * @param {Number} ts | timestamp
 */
function calcFPS(ts) {
    if(ts > lastFpsUpdate + 1000) {
        setFPS(0.25 * framesThisSecond + (1 - 0.25) * fps);
        lastFpsUpdate = ts;
        framesThisSecond = 0;
    }
    framesThisSecond++;
}

// Update ================================================================== //
/**
 * update the game state
 * @param {Number} delta | delta time
 * @param {Function} callback | a callback function
 */
function update(delta, callback) {
    if(!uther) {
        uther = getGameObject('Unit', 'Hero');
        uther.position = { x: 0, y: 245 };
        uther.width = uther.width * -1;
    }
    unitLastPos = uther.positionX;
    uther.gravitate();
    uther.updatePosition();
    uther.positionX += Math.round(unitVelocity * delta);
    if(uther.positionX >= limit || uther.positionX <= 0) unitVelocity = -unitVelocity;

    /*unitLastPos = unitPos;
    unitPos += unitVelocity * delta;
    if(unitPos >= limit || unitPos <= 0) unitVelocity = -unitVelocity;*/

    if(typeof callback === 'function') {
        callback();
    }
}

/**
 * update delta after each step
 */
function stepUpdate() {
    setDelta(getDelta() - getTimestep());
}

// Draw ==================================================================== //
function draw(interp, ctx = CTX) {
    let imageLeft = Math.round((unitLastPos + (unitPos - unitLastPos) * interp));
    clearCanvas();
    drawBackground();

    if(!uther) {
        uther = getGameObject('Unit', 'Hero');
        uther.position = { x: 0, y: 245 };
        uther.direction = -1;
    }

    uther.draw(ctx);
    /*if(!hero) {
        hero = getGameAssets('loaded')['Hero'];
    }*/
    //ctx.drawImage(hero ,0, 0, 169, 205, imageLeft, 550, 169, 205);

    printFPS();
    printChill();
}

function clearCanvas(canvas = EL_CANVAS, ctx = CTX) {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);
}

function drawBackground(ctx = CTX) {
    const background = getGameAssets('loaded','background');
    const ground = getGameAssets('loaded','ground');
    const clouds = getGameAssets('loaded','clouds');
    ctx.drawImage(background ,0, 585);
    ctx.drawImage(ground ,0, 655);
    ctx.drawImage(clouds ,0, 50);
}

// Misc ==================================================================== //
function printFPS() {
    UI_FPS.innerHTML = `FPS : ${Math.round(fps)}`;
}

function printChill() {
    UI_CHILL.innerHTML = `Chills : ${timesChilled}`;
}

// Loop Manager ============================================================ //
function startMainLoop(mainLoopCallback) {
    if(!started) {
        started = true;

        // Dummy frame to get our timestamps and initial drawing right.
        // Track the frame ID so we can cancel it if we stop quickly.
        frameID = requestAnimationFrame(function(timestamp) {
            draw(1);
            running = true;
            
            // reset some time tracking variables
            lastFrameTimeMS = timestamp;
            lastFpsUpdate = timestamp;
            framesThisSecond = 0;

            // actually start the main loop
            if(typeof mainLoopCallback === 'function') {
                frameID = requestAnimationFrame(mainLoopCallback);
                log('Game loop started!', 'success');
                return;
            }
            log('mainLoopCallback is not a function', 'error');
        });
    }
}

function stop() {
    running = false;
    started = false;
    cancelAnimationFrame(frameID);
}
