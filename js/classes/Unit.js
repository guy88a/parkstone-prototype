/**
 * CHARACTER CLASS
 * Constructs a new interactive game unit
 */

// Imports ================================================================= //
import log from '../log.js';
import GameObject from './GameObject.js';

// Config ================================================================== //
const DEFAULTS = {}

// Main ==================================================================== //
export default class Unit extends GameObject {
    constructor() {
        super();
        log('Constructing a new Character', 'info');
        this.enemy   = false;
        this.jumping = false;
        this.hitting = false;
        
        if(!this.anim) { return; }

        this.settings = {
            spritesheet: {
                sourceSize: { w: 0, h:0 },
                frameSize: { w: 0, h:0 }
            },
            animation: {}
        }
    }

    // Setters
    set isEnemy(isEnemy = true) {
        this.enemy = isEnemy;
    }

    set isJumping(isJumping = true) {
        this.jumping = isJumping;
    }
    
    set isHitting(isHitting = true) {
        this.hitting = isHitting;
    }

    set animationSettings(settings = {}) {
        this.settings.animation = settings;
    }

    // Getters
    get isEnemy() {
        return this.enemy;
    }

    get isJumping() {
        return this.jumping;
    }
    
    get isHitting() {
        return this.hitting;
    }

    get animationSettings() {
        return this.settings.animation;
    }

    // Methods
    spritesheetSize(type = 'source', w = this.settings.spritesheet[`${type}Size`].w, h = this.settings.spritesheet[`${type}Size`].h) {
        this.settings.spritesheet[`${type}Size`].w = w;
        this.settings.spritesheet[`${type}Size`].h = h;
        return this.settings.spritesheet[`${type}Size`];
    }
}