/**
 * GAME LOOP
 * Handles the main game loop
 */

// Imports ================================================================= //
import log from './log.js';
import { getGameAssets, } from './loader.js';
import { getGameObjects, getGameObject } from './objectsManager.js';

//for tests
import { detectBoxCollision } from './physicsManager.js';

// Config ================================================================== //
const EL_CANVAS = document.getElementById('game-canvas');
const CTX = EL_CANVAS.getContext('2d');
const UI_FPS = document.getElementById('fps-log');
const UI_CHILL = document.getElementById('chill-log');
const UI_COLL = document.getElementById('collisions-log');

var hero = getGameAssets('loaded')['Hero'];
var uther;
let obstacle;
let collisions = 0;
let collided = false;

let unitPos = 0;
let unitPosY = 0;
let unitLastPos = 0;
let unitVelocity = 0.5;
let limit = EL_CANVAS.clientWidth - 169;

let timesChilled = 0;
let lastFrameTimeMS = 0;
let delta = 0;
// var maxFPS = 30;
// var timestep = 1000 / 90;
var maxFPS = 100;
var timestep = 1000 / 150;
let fps = maxFPS;
let framesThisSecond = 0;
let lastFpsUpdate = 0;

// manager
let frameID = 0;
let started = false;
let running = false;

let oldDirTS = 0;
let newDirTS = 0;

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
    
    let originalDelta = delta;
    
    // update game state
    let numUpdateSteps = 0;
    while(delta >= timestep) {
        update(timestep, null, timestamp);
        stepUpdate();
        // Overload check
        if(++numUpdateSteps >= 240) {
            chill();
            break;
        }
    }

    // draw and request the next frame
    draw(delta / timestep, originalDelta);
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
function update(delta, callback, timestamp) {
    if(!uther) {
        uther = getGameObject('Unit', 'Hero');
        uther.animate = true;
        uther.position = { x: 0, y: 245 };
        uther.velocityX = unitVelocity;
        //uther.width = uther.width * -1;

        obstacle = getGameObject('Object', 'Obstacle');
        //obstacle.velocityX = unitVelocity;
    }
    unitLastPos = uther.positionX;
    uther.gravitate(delta);
    obstacle.gravitate(delta);
    //uther.positionX += Math.round(unitVelocity * delta);
    uther.updatePosition(delta);
    obstacle.updatePosition(delta);
    unitPos = uther.positionX;
    if(uther.positionX >= limit || uther.positionX <= 0) {
        newDirTS = timestamp;
        log(newDirTS - oldDirTS);
        oldDirTS = newDirTS;
        let fixedPos = [0, limit].reduce(function(prev, curr) {
            return (Math.abs(curr - uther.positionX) < Math.abs(prev - uther.positionX) ? curr : prev);
        });
        uther.positionX = fixedPos;
        uther.velocityX = -uther.velocityX;
    };

    if(obstacle.positionX < (0 - obstacle.width)) {
        obstacle.positionX = EL_CANVAS.clientWidth;
    }

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
function draw(interp, delta, ctx = CTX) {

    clearCanvas();

    /* test 
    if(detectBoxCollision(uther, obstacle)) {
        //detectBoxCollision(uther, obstacle);
        if(!collided) {
            collided = true;
            collisions++;
        }
    } else {
        if(collided) {
            collided = false;
        }
    }
    /* test */

    //let imageLeft = Math.round((unitLastPos + (unitPos - unitLastPos) * interp));
    if(!uther) {
        var gom = getGameObjects();
        uther = getGameObject('Unit', 'Hero');
        uther.animate = true;
        uther.position = { x: 100, y: 245 };
        //uther.velocity = { x: unitVelocity, y: 0 };
        //uther.width = uther.width * -1;

        obstacle = getGameObject('Object', 'Obstacle');
        obstacle.position = { x: 1000, y: 445 };
        obstacle.velocity = { x: unitVelocity, y: 0 };
        obstacle.motion();
    }
    //uther.positionX = Math.round((unitLastPos + (uther.positionX - unitLastPos) * interp));
    clearCanvas();
    drawBackground();
    uther.positionX = Math.round(uther.positionX);
    obstacle.positionX = Math.round(obstacle.positionX);
    uther.draw(ctx, delta);
    obstacle.draw(ctx, delta);

    /*if(!hero) {
        hero = getGameAssets('loaded')['Hero'];
    }*/
    //ctx.drawImage(uther.image ,0, 0, 169, 205, imageLeft, 550, 169, 205);

    printFPS();
    printChill();
    printCollisions();
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

function printCollisions() {
    UI_COLL.innerHTML = `Collisions : ${collisions}`;
}

// Loop Manager ============================================================ //
function startMainLoop(mainLoopCallback) {
    if(!started) {
        started = true;

        // Dummy frame to get our timestamps and initial drawing right.
        // Track the frame ID so we can cancel it if we stop quickly.
        frameID = requestAnimationFrame(function(timestamp) {
            draw(1, 0);
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
