/**
 * GAME PHYSICS
 * 
 */

// Imports ================================================================= //
import log from './log.js';
import Unit from './classes/Unit.js';

// Config ================================================================== //
let Physics = new Map(
    ['force', 1],
    ['gravity', true],
    ['ground', 750],
    ['jumpPower', 1]
    ['power', 1],
);


// Main ==================================================================== //
/**
 * initiate all game physics
 */
export default function initGamePhysics() {
    log('initGamePhysics function', 'info');
}

export function getGravityEffect(power) {
    return calcGravityEffect(power);
}

export function detectCollision(obj1, obj2) {
    // TODO check collision
}

// Setters & Getters ======================================================= //


// Checkers ================================================================ //


// Misc ==================================================================== //
function calcGravityEffect(power = Physics.get('power')) {
    return (Physics.get('force') * power) * -1;
}