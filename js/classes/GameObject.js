/**
 * UNIT CLASS
 * Constructs a new game unit
 */

 // Imports ================================================================= //
import log from '../log.js';

// Config ================================================================== //
const DEFAULTS = {
    source: '_.png',
    position: { x: 0, y: 0 },
    collision: false,
    gravity: false,
    velocity: { x: 0, y: 0 },
    animated: false
}

// Main ==================================================================== //
export default class GameObject {
    constructor(source = DEFAULTS.source, position = DEFAULTS.position, collision = DEFAULTS.collision, gravity = DEFAULTS.gravity, velocity = DEFAULTS. velocity, animated = DEFAULTS.animated) {
        log('Constructing a new Game Object', 'info');
        this.src    = source;
        this.pos    = position;
        this.col    = collision;
        this.grv    = gravity;
        this.vel    = velocity;
        this.anim   = animated;
    }

    // Setters
    set source(source) {
        this.src = source;
    }
    
    set position(position) {
        this.pos = position;
    }
    
    set collision(collision) {
        this.col = collision;
    }
    
    set velocity(velocity) {
        this.vel = velocity;
    }

    set isAnimating(isAnimating) {
        this.animating = isAnimating;
    }

    // Getters
    get source() {
        return this.src;
    }

    get position() {
        return this.pos;
    }

    get collision() {
        return this.col;
    }

    get velocity() {
        return this.vel;
    }

    get isAnimating() {
        return this.animating;
    }
}