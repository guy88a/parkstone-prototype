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
        this.health  = 1;
        this.enemy   = false;
        this.jumping = false;
        this.hitting = false;
        this.grv     = true;

        this.settings = {
            spritesheet: {
                sourceSize: { w: 0, h:0 },
                frameSize: { w: 0, h:0 },
                step: 1000 / 40
            },
            animation: {}
        }
    }

    // Setters
    set unitHealth(health) {
        this.health = health;
    }

    set isEnemy(isEnemy) {
        this.enemy = isEnemy;
    }

    set isJumping(isJumping) {
        this.jumping = isJumping;
    }
    
    set isHitting(isHitting) {
        this.hitting = isHitting;
    }

    set spritesheetSettings(settings = this.settings.spritesheet) {
        this.settings.spritesheet = settings;
    }

    set animationSettings(settings = {}) {
        this.settings.animation = settings;
    }

    // Getters
    get unitHealth() {
        return this.health;
    }

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
    isAlive(value = this.health) {
        return this.health = Number(value);
    }

    spritesheetSize(type = 'source', w = this.settings.spritesheet[`${type}Size`].w, h = this.settings.spritesheet[`${type}Size`].h) {
        this.settings.spritesheet[`${type}Size`].w = w;
        this.settings.spritesheet[`${type}Size`].h = h;
        return this.settings.spritesheet[`${type}Size`];
    }

    spritesheetStep(stepRate = this.settings.spritesheet.step) {
        return this.settings.spritesheet.step = stepRate;
    }
}