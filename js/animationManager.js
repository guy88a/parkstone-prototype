/**
 * TITLE
 * 
 */

// Imports ================================================================= //
import log from './log.js';
import GameObject from './classes/GameObject.js';
import Unit from './classes/Unit.js';

// Config ================================================================== //
let lastDelta = 0;

// Extanding =============================================================== //
/**
 * add physics prototypes to game objects
 */
function setAnimationsProtos() {
    Unit.prototype.animate = function(status = true) {
        this.anim = true;
    }

    Unit.prototype.getUpdatedSpritesheetPosition = function(delta, stepRate, next) {
        next -= delta;
        if(next <= 0) {
            this.settings.spritesheet.next = stepRate + next;
            this.settings.spritesheet.pos++;

            if((this.settings.spritesheet.pos * this.spritesheetSize('frame').w) > this.spritesheetSize('source').w - 1 /*this.spritesheetSize('frame').w*/) {
                return 0;
            }

            return this.settings.spritesheet.pos;
        }

        this.settings.spritesheet.next -= delta;
        return this.settings.spritesheet.pos;
    }
}

// direction: 1
// frameSize: {w: 169, h: 205}
// next: 200
// pos: 0
// sourceSize: {w: 676, h: 205}
// timestep: 200

// Main ==================================================================== //
/**
 * functionName
 */
export default function activateAnimations() {
    log('Activating animations', 'info');
    setAnimationsProtos();
    log('Animations activated', 'success');
}

// Setters & Getters ======================================================= //


// Checkers ================================================================ //


// Misc ==================================================================== //
