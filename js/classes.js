import { HEALTH_DECREASE_ON_HIT, GRAVITY } from './constants';
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

class Sprite {
    constructor({
        position,
        imageSrc,
        scale = 1,
        framesMax = 1,
        framesTotal = framesMax,
        framesOffset = 0,
        offset = { x: 0, y: 0 },
    }) {
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesTotal = framesTotal;
        this.framesOffset = framesOffset;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.offset = offset;
        this.flipX = false;
        this.currentSprite = imageSrc;
    }

    draw() {
        const frameWidth = this.image.width / this.framesTotal;
        const drawX = this.position.x - this.offset.x + ((this.color === 'red') && this.flipX ? -44 : 0) + ((this.color === 'blue') && this.flipX ? 15 : 0);
        const drawY = this.position.y - this.offset.y;
        const drawWidth = frameWidth * this.scale;
        const drawHeight = this.image.height * this.scale;

        c.save();
        if (this.flipX) {
            c.translate(drawX + drawWidth, drawY);
            c.scale(-1, 1);
            c.drawImage(
                this.image,
                (this.framesOffset + this.framesCurrent) * frameWidth,
                0,
                frameWidth,
                this.image.height,
                0,
                0,
                drawWidth,
                drawHeight
            );
        } else {
            c.drawImage(
                this.image,
                (this.framesOffset + this.framesCurrent) * frameWidth,
                0,
                frameWidth,
                this.image.height,
                drawX,
                drawY,
                drawWidth,
                drawHeight
            );
        }
        c.restore();
    }

    animateFrames() {
        this.framesElapsed++;

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            } else if (this.currentSprite !== 'death') {
                // Only loop if not on death animation
                this.framesCurrent = 0;
            }
        }
    }

    update() {
        this.draw();
        this.animateFrames();
    }
}

class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        color = 'red',
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 },
        sprites,
         audio= {
				jump: '../music/jump.wav',
				takeHit: '../music/hitHurt.wav',
				walk: '../music/walk.m4a',
				bgm: '../music/bgm.wav',
				punch: '../music/punch.wav',
			}, // NEW: Audio dictionary parameter
        attackBox = {
            offset: { x: 0, y: 0 },
            width: undefined,
            height: undefined,
        },
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset,
        });
       
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.velocity = velocity;
        this.width = 60;
        this.height = 150;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height,
        };
        this.color = color;
        this.isAttacking = false;
        this.health = 100;
        this.sprites = sprites;
        this.dead = false;

        // NEW: Initialize audio objects
        this.sounds = {};
        for (const soundName in audio) {
            this.sounds[soundName] = new Audio(audio[soundName]);
        }

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }

        // Ensure sprites have optional framesTotal and framesOffset defaults
        for (const sprite in this.sprites) {
            if (this.sprites[sprite].framesTotal === undefined)
                this.sprites[sprite].framesTotal = this.sprites[sprite].framesMax;
            if (this.sprites[sprite].framesOffset === undefined)
                this.sprites[sprite].framesOffset = 0;
        }
    }

    // NEW: Helper method to play sounds safely and allow overlapping
   playSound(soundName, preventSelfOverlap = true, muteOthers = false) {
        if (!this.sounds[soundName]) return;

        // 1. Mute all other sounds on this fighter (great for hits and deaths)
        if (muteOthers) {
            for (const key in this.sounds) {
                if (key !== soundName) {
                    this.sounds[key].pause(); // Stop playing
                    this.sounds[key].currentTime = 0; // Rewind
                }
            }
        }

        // 2. Prevent the sound from overlapping/restarting itself (great for long voice lines)
        if (preventSelfOverlap) {
            if (!this.sounds[soundName].paused) {
                return; // If it's already playing, do nothing and let it finish
            }
        } else {
            // Default: Restart the sound for rapid, snappy inputs
            this.sounds[soundName].currentTime = 0; 
        }

        this.sounds[soundName].play().catch(error => console.warn('Audio play prevented:', error)); 
    }

    update() {
        this.draw();

        // Continue animating death sprite until complete
        if (this.currentSprite === 'death') {
            this.animateFrames();
            // Set dead flag when death animation completes
            if (this.framesCurrent === this.framesMax - 1) {
                this.dead = true;
            }
            return;
        }

        if (this.dead) return;
        this.animateFrames();

        const directionMultiplier = this.flipX ? -1 : 1;

        if (this.flipX) {
            this.attackBox.position.x = this.position.x - this.attackBox.offset.x - this.attackBox.width + this.width;
        } else {
            // Standard right-facing calculation
            this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        }

        // Y position stays exactly the same
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        this.position.x += this.velocity.x;
        if (this.velocity.x < 0) { 
            this.flipX = this.color == 'red' ? true : false;
        } else if (this.velocity.x > 0) {
            this.flipX = this.color == 'red' ? false : true;
        }
		if (this.velocity.x != 0&& this.velocity.y == 0) {
this.playSound('walk',true);
		}
        // stop fighter from going out of frame
        if (this.position.x < 0) {
            this.position.x = 0;
        } else if (this.position.x >= 950) {
            this.position.x = 950;
        }

        this.position.y += this.velocity.y;
		
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0;
            this.position.y = 330;
        } else {
            this.velocity.y += GRAVITY;
        }
    }

    attack() {
        this.switchSprite('attack1');
        this.isAttacking = true;
       this.playSound('punch'); // NEW: Play attack sound
    }

    takeHit() {
        this.health -= HEALTH_DECREASE_ON_HIT;
        if (this.health < 0) this.health = 0;
        
        if (this.health <= 0) {
            this.switchSprite('death');
            this.playSound('death'); // NEW: Play death sound
        } else {
            this.switchSprite('takeHit');
            this.playSound('takeHit'); // NEW: Play hit sound
        }
    }

    switchSprite(sprite) {
        if (this.currentSprite === sprite) return;

        // If death animation is playing, don't switch sprites
        if (this.image === this.sprites.death.image) {
            return;
        }

        // If it is still attack frames, don't draw idle
        if (
            this.image === this.sprites.attack1.image &&
            this.framesCurrent < this.sprites.attack1.framesMax - 1
        )
            return;

        // If fight gets hit override
        if (
            this.image === this.sprites.takeHit.image &&
            this.framesCurrent < this.sprites.takeHit.framesMax - 1
        )
            return;

        // Always update animation parameters for the requested sprite
        this.image = this.sprites[sprite].image;
        this.framesMax = this.sprites[sprite].framesMax;
        this.framesTotal = this.sprites[sprite].framesTotal || this.framesMax;
        this.framesOffset = this.sprites[sprite].framesOffset || 0;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.currentSprite = sprite;
    }
}

export { Fighter, Sprite };