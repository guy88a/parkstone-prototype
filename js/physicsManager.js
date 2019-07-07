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
    GameObject.prototype.gravitate = function(delta, ground = Physics.get('ground') - this.height) {
        let gravFx = getGravityEffect();

        if((this.positionY + this.velocityY + gravFx) > ground - 50) {
            this.positionY;
        }

        if((this.positionY + ((this.velocityY + gravFx) * delta)) > ground) {
            this.velocityY = 0;
            this.hang = false;
            gravFx = 0;
            this.pos = {
                x: this.pos.x,
                y: ground
            };
        }
        this.velocityY += gravFx;
    }
    
    Unit.prototype.jump = function(forced = false) {
        if(forced || (!this.hang)) {
            this.velocityY = getPoweredValue(Physics.get('jumpPower') * -1);
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