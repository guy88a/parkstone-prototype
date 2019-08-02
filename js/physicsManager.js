/**
 * GAME PHYSICS
 * 
 */

// Imports ================================================================= //
import log from './log.js';
import GameObject from './classes/GameObject.js';
import Unit from './classes/Unit.js';
import { getCollosionDetector } from './utils/image.js';

// Config ================================================================== //
let collisionDetector;
const EL_CANVAS = document.getElementById('game-canvas');

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
    ['gravityPower', 0.6],
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

    GameObject.prototype.motion = function(setVelocity = true, adjustment = 0) {
        this.motion = true;
        if(setVelocity) {
            //this.motionUpdate();
            let m = parseFloat(Physics.get('motion'));
            m = adjustment ? m * adjustment : m;
            this.velocityX = m;
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
    setCollisionDetector();
    setPhysicsProtos();
}

export function getGravityEffect(power) {
    return calcGravityEffect(power);
}

export function detectBoxCollision(source, target, ctx) {
    let areaData = isColliding(source, target);
    if(areaData.length != 0 && areaData[2] >= 1 && areaData[3] >= 1) {
        let sImgData = getObjectImageData(ctx, source, areaData);
        let tImgData = getObjectImageData(ctx, target, areaData);
        let pixelHit = checkPixelCollision(sImgData, tImgData);
        return pixelHit;
    } else {
        return false;
    }
}

// Setters & Getters ======================================================= //
function setCollisionDetector() {
    collisionDetector = getCollosionDetector();
}

// Physics Controllers ===================================================== //
function motionIncrease(amount = Physics.get('motion') * 0.1) {
    Physics.set('motion', Physics.get('motion') + amount)
}

function motionDecrease(amount = Physics.get('motion') * 0.1) {
    Physics.set('motion', Physics.get('motion') - amount)
}

// Misc ==================================================================== //
function calcGravityEffect(power = Physics.get('gravityPower')) {
    return (Physics.get('velocity') * power);
}

function getPoweredValue(value) {
    return value * Physics.get('power');
}

/**
 * 
 * @param {GameObject} source 
 * @param {GameObject} target 
 * returns the collision area:
 * - [x, y, w, h]
 */
function isColliding(source, target) {
    let endCoords = getEndCoords(source, target);

    if(endCoords[0] > target.positionX && source.positionX < endCoords[2] &&
       endCoords[1] > target.positionY && source.positionY < endCoords[3])
    {
        let cStartX = source.positionX < target.positionX ? target.positionX : source.positionX;
        let cStartY = source.positionY < target.positionY ? target.positionY : source.positionY;
        let cEndX = endCoords[0] > endCoords[2] ? endCoords[2] : endCoords[0];
        let cEndY = endCoords[1] > endCoords[3] ? endCoords[3] : endCoords[1];
    
        return [
            cStartX,
            cStartY,
            cEndX - cStartX,
            cEndY - cStartY
        ];
    } else {
        return [];
    }
}

function getEndCoords(source, target) {
    let sourceW = source.settings ? source.spritesheetSize('frame').w : source.width;
    let targetW = target.settings ? target.spritesheetSize('frame').w : target.width;
    return [
        source.positionX + sourceW,
        source.positionY + source.height,
        target.positionX + targetW,
        target.positionY + target.height
    ]
}

function getObjectImageData(ctx, gameObject, areaData) {
    ctx.clearRect(areaData[0], areaData[1], areaData[2], areaData[3])
    gameObject.draw(ctx, 0, true);
    return ctx.getImageData(areaData[0], areaData[1], areaData[2], areaData[3]);
}

function checkPixelCollision(sData, tData) {
    let l = sData.data.length;
    let r = 4 * 5;
    for(var i = 0; i < l; i += r) {
        if(!sData.data[i+3] || !tData.data[i+3]) {
            continue;
        } else {
            return true;
        }
    }
    return false;
}