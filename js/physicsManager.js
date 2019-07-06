/**
 * GAME PHYSICS
 * 
 */

// Imports ================================================================= //
import log from './log.js';
import GameObject from './classes/GameObject.js';
import Unit from './classes/Unit.js';

// Config ================================================================== //
let Physics = new Map([
    ['force', 1],
    ['gravity', true],
    ['ground', 750],
    ['jumpPower', 2],
    ['power', 1],
    ['velocity', 0.3]
]);

// Extanding =============================================================== //
/**
 * add physics prototypes to game objects
 */
function setPhysicsProtos() {
    GameObject.prototype.gravitate = function(groundHit = Physics.get('ground') - this.height) {
        let gravFx = getGravityEffect();
        //let groundHit = Physics.get('ground') - this.height;

        if((this.positionY + this.velocityY + gravFx) > groundHit) {
            this.velocityY = 0;
            this.hang = false;
            gravFx = 0;
            this.pos = {
                x: this.pos.x,
                y: groundHit
            };
        }

        this.velocityY += gravFx;
    }
    
    Unit.prototype.jump = function(forced = false, cap) {
        let jumpPower = getPoweredValue(Physics.get('jumpPower') * -1);
        //if(cap && this.velocityY)
        if(forced || (!this.hang)) {
            this.velocityY = jumpPower;
        }
    }
}

// Main ==================================================================== //
/**
 * initiate all game physics
 */
export default function initGamePhysics() {
    log('initGamePhysics function', 'info');
    setPhysicsProtos();
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
    return (Physics.get('velocity') * power);
}

function getPoweredValue(value) {
    return value * Physics.get('power');
}