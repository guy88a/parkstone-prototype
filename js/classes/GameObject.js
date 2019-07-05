/**
 * UNIT CLASS
 * Constructs a new game unit
 */

 // Imports ================================================================= //
import log from '../log.js';

// Config ================================================================== //
const DEFAULTS = {
    image: new Image(),
    position: { x: 0, y: 0 },
    lastPosition: { x: 0, y: 0 },
    collision: false,
    gravity: false,
    hangs: false,
    velocity: { x: 0, y: 0 },
    animated: false
}

// Main ==================================================================== //
export default class GameObject {
    constructor(image = DEFAULTS.image,
        position        = DEFAULTS.position,
        lastPosition    = DEFAULTS.lastPosition,
        collision       = DEFAULTS.collision,
        gravity         = DEFAULTS.gravity,
        hangs           = DEFAULTS.hangs,
        velocity        = DEFAULTS.velocity,
        animated        = DEFAULTS.animated
        ) {
        log('Constructing a new Game Object', 'info');
        this.img    = image;
        this.w      = image.width;
        this.h      = image.height;
        this.pos    = position;
        this.lpos   = lastPosition;
        this.col    = collision;
        this.grv    = gravity;
        this.hang   = hangs;
        this.vel    = velocity;
        this.anim   = animated;
    }

    // Setters
    set image(source) {
        this.img = image;
    }

    set width(width) {
        this.w = width;
    }

    set height(height) {
        this.h = height;
    }
    
    set position(position) {
        this.pos = position;
    }
    
    set positionX(position) {
        this.pos.x = position;
    }
    
    set positionY(position) {
        this.pos.y = position;
    }
    
    set lastPosition(position) {
        this.lpos = position;
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
    get image() {
        return this.img;
    }

    get width() {
        return this.w;
    }

    get height() {
        return this.h;
    }

    get position() {
        return this.pos;
    }

    get positionX() {
        return this.pos.x;
    }

    get positionY() {
        return this.pos.y;
    }
    
    get lastPosition() {
        return this.lpos;
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

    // Methods
    draw(context) {
        context.drawImage(this.img, this.pos.x, this.pos.y, this.w, this.h);
    }

    lastPosition(position = this.pos.last) {
        return this.pos.last = position;
    }
}