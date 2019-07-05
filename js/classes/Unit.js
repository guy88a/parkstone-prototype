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
    constructor(...args) {
        super(...args);
        log('Constructing a new Character', 'info');
        this.health  = 1;
        this.enemy   = false;
        this.jumping = false;
        this.hitting = false;
        this.grv     = true;

        this.settings = args[args.length - 1];
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

    set spritesheetSettings(settings) {
        this.settings.spritesheet = settings;
    }

    set animationSettings(settings) {
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
    draw(context) {
        context.drawImage(
            this.img,
            this.settings.spritesheet.pos.x,
            this.settings.spritesheet.pos.y,
            this.settings.spritesheet.frameSize.w,
            this.settings.spritesheet.frameSize.h,
            this.pos.x,
            this.pos.y,
            this.settings.spritesheet.frameSize.w,
            this.settings.spritesheet.frameSize.h
            );
    }

    isAlive(value = this.health) {
        return this.health = Number(value);
    }

    spritesheetSize(type = 'source', w = this.settings.spritesheet[`${type}Size`].w, h = this.settings.spritesheet[`${type}Size`].h) {
        this.settings.spritesheet[`${type}Size`].w = w;
        this.settings.spritesheet[`${type}Size`].h = h;
        return this.settings.spritesheet[`${type}Size`];
    }

    spritesheetStep(stepRate = this.settings.spritesheet.timestep) {
        return this.settings.spritesheet.timestep = stepRate;
    }
}