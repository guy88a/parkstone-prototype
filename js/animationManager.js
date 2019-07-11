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

    Unit.prototype.getSpritesheetPosition = function(delta, stepRate, next) {
        if(next - delta <= 0) {
            this.settings.spritesheet.next = stepRate;
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
function getSpritesheetPosition(delta) {

}
