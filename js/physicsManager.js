/**
 * GAME PHYSICS
 * 
 */

// Imports ================================================================= //
import log from './log.js';
import GameObject from './classes/GameObject.js';
import Unit from './classes/Unit.js';

// Config ================================================================== //
let Changes = {
    changed: [],
    force: false,
    gravity: false,
    ground: false,
    jumpPower: false,
    power: false,
    velocity: false,
    motion: false
}

let Physics = new Map([
    ['force', 1],
    ['gravity', true],
    ['ground', 750],
    ['jumpPower', 2.5],
    ['power', 0.5],
    ['velocity', 0.006],
    ['motion', -0.6]
]);

// Extanding =============================================================== //
/**
 * add physics prototypes to game objects
 */
function setPhysicsProtos() {
    GameObject.prototype.gravitate = function(delta, ground = Physics.get('ground') - this.height) {
        let gravFx = getGravityEffect();

        if((this.positionY + ((this.velocityY + gravFx) * delta)) > ground) {
            this.velocityY = 0;

            if(this.hang) {
                if(this.settings && this.settings.spritesheet) {
                    this.settings.spritesheet.pos = 2;
                    this.settings.spritesheet.next = this.settings.spritesheet.timestep;
                }
            }

            this.hang = false;
            gravFx = 0;
            this.pos = {
                x: this.pos.x,
                y: ground
            };
        }

        this.velocityY += gravFx * delta;
        if(this.velocityY > 1) {
            this.velocityY = 1;
        }
    }

    GameObject.prototype.motion = function(setVelocity = true) {
        this.motion = true;
        if(setVelocity) {
            this.motionUpdate();
        }
    }

    GameObject.prototype.motionUpdate = function() {
        this.velocityX = Physics.get('motion');
    }
    
    Unit.prototype.jump = function(forced = false) {
        if(forced || (!this.hang)) {
            this.hang = true;
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


// Physics Controllers ===================================================== //
function motionIncrease(amount = Physics.get('motion') * 0.1) {
    Physics.set('motion', Physics.get('motion') + amount)
}

function motionDecrease(amount = Physics.get('motion') * 0.1) {
    Physics.set('motion', Physics.get('motion') - amount)
}

// Misc ==================================================================== //
function calcGravityEffect(power = Physics.get('power')) {
    return (Physics.get('velocity') * power);
}

function getPoweredValue(value) {
    return value * Physics.get('power');
}