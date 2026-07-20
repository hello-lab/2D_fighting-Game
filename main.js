import './style.css';
import {
	getDefaultBackgroundInstance,
	getDefaultBackgroundInstance1,
	getDefaultShopInstance,
	getDefaultPlayerInstance,
	getDefaultEnemyInstance,
} from './js/instances.js';
import { rectangularCollision, determineWinner } from './js/utils.js';
import { DEFAULT_TIMER } from './js/constants.js';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

// instantiate default state
let background = getDefaultBackgroundInstance();
let background1 = getDefaultBackgroundInstance1();
let shop = getDefaultShopInstance();
let player = getDefaultPlayerInstance();
let enemy = getDefaultEnemyInstance();
let hasGameStarted = false;
let keys = {
	a: {
		pressed: false,
	},
	d: {
		pressed: false,
	},
	ArrowRight: {
		pressed: false,
	},
	ArrowLeft: {
		pressed: false,
	},
};

let timer = DEFAULT_TIMER;
let timerId;
let bgmMuted = false;

function resolveFighterOverlap() {
	const playerLeft = player.position.x;
	const playerRight = player.position.x + player.width;
	const enemyLeft = enemy.position.x;
	const enemyRight = enemy.position.x + enemy.width;

	const horizontalOverlap =
		Math.min(playerRight, enemyRight) - Math.max(playerLeft, enemyLeft);
	if (horizontalOverlap <= 0) return;

	const playerTop = player.position.y;
	const playerBottom = player.position.y + player.height;
	const enemyTop = enemy.position.y;
	const enemyBottom = enemy.position.y + enemy.height;

	const verticalOverlap =
		Math.min(playerBottom, enemyBottom) - Math.max(playerTop, enemyTop);
	if (verticalOverlap <= 0) return;

	const separation = horizontalOverlap / 2;
	if (player.position.x <= enemy.position.x) {
		player.position.x -= separation;
		enemy.position.x += separation;
	} else {
		player.position.x += separation;
		enemy.position.x -= separation;
	}

	player.position.x = Math.max(0, Math.min(950, player.position.x));
	enemy.position.x = Math.max(0, Math.min(950, enemy.position.x));
}
export function decreaseTimer() {
	if (timer > 0) {
		timerId = setTimeout(decreaseTimer, 1000);
		timer--;
		document.querySelector('#timer').innerHTML = timer;
	} else {
		determineWinner({ player, enemy, timerId });
	}
}
function pollGamepad() {
const gamepads = navigator.getGamepads();
console.log(gamepads)
    const gp = gamepads[0];
	const ge = gamepads[1] // Assuming one controller
    if (!gp) return;
	if(!ge) return

    // Movement (Axes: 0 is horizontal)
    if (gp.axes[0] < -0.5) { // Left
        keys.a.pressed = true;
        player.lastKey = 'a';
    } else if (gp.axes[0] > 0.5) { // Right
        keys.d.pressed = true;
        player.lastKey = 'd';
    } else {
        keys.a.pressed = false;
        keys.d.pressed = false;
    }

    // Jumping & Attacking (Buttons: 0=A, 1=B, etc.)
	if (gp.buttons[0].pressed && player.velocity.y === 0) { // A button
		player.velocity.y = -16;
		player.playSound('jump', true);
    }
    if (gp.buttons[2].pressed) { // X button for attack
        player.attack();
    }
	

	 if (ge.axes[0] < -0.5) { // Left
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = 'ArrowLeft';
    } else if (ge.axes[0] > 0.5) { // Right
        keys.ArrowRight.pressed = true;
        enemy.lastKey = 'ArrowRight';
    } else {
        keys.ArrowLeft.pressed = false;
        keys.ArrowRight.pressed = false;
    }

    // Jumping & Attacking (Buttons: 0=A, 1=B, etc.)
	if (ge.buttons[0].pressed && enemy.velocity.y === 0) { // A button
		enemy.velocity.y = -16;
		enemy.playSound('jump', true);
    }
    if (ge.buttons[2].pressed) { // X button for attack
        enemy.attack();
    }
}

function animate() {
	window.requestAnimationFrame(animate);
	c.fillStyle = 'black';
	pollGamepad();
	c.fillRect(0, 0, canvas.width, canvas.height);
	background.update();
	background1.update();
	//shop.update();
	c.fillStyle = 'rgba(255,255,255,0.15)';
	c.fillRect(0, 0, canvas.width, canvas.height);
	if (!bgmMuted) {
		player.playSound('bgm', true);
	}
	player.update();
	enemy.update();
	resolveFighterOverlap();
if(!hasGameStarted){
	player.switchSprite('idle');
	enemy.switchSprite('idle');
	if(player.health==enemy.health==0)
	player.health<=0?player.switchSprite('death'):enemy.switchSprite('death');

		return}
	// player movement
		const playerIsAttacking =
			player.currentSprite === 'attack1' &&
			player.framesCurrent < player.sprites.attack1.framesMax - 1;
		if (!playerIsAttacking) {
	const playerLastKey = player.lastKey;
	player.velocity.x = 0;
	if (keys.a.pressed && playerLastKey === 'a') {
		player.velocity.x = -5;
		if (player.velocity.y === 0) player.switchSprite('run');
	} else if (keys.d.pressed && playerLastKey === 'd') {
		player.velocity.x = 5;
		if (player.velocity.y === 0) player.switchSprite('run');
	} else {
		if (player.velocity.y === 0) player.switchSprite('idle');
	}
}

	// jumping
	if (player.velocity.y < 0) {
		player.switchSprite('jump');
	} else if (player.velocity.y > 0) {
		player.switchSprite('fall');
	}

	// enemy movement
	const enemyIsAttacking =
		enemy.currentSprite === 'attack1' &&
		enemy.framesCurrent < enemy.sprites.attack1.framesMax - 1;
	if (!enemyIsAttacking) {
	const enemyLastKey = enemy.lastKey;
	enemy.velocity.x = 0;
	if (keys.ArrowLeft.pressed && enemyLastKey === 'ArrowLeft') {
		enemy.velocity.x = -5;
		if (enemy.velocity.y === 0) enemy.switchSprite('run');
	} else if (keys.ArrowRight.pressed && enemyLastKey === 'ArrowRight') {
		enemy.velocity.x = 5;
		if (enemy.velocity.y === 0) enemy.switchSprite('run');
	} else {
		if (enemy.velocity.y === 0) enemy.switchSprite('idle');
	}
}

	// jumping
	if (enemy.velocity.y < 0) {
		enemy.switchSprite('jump');
	} else if (enemy.velocity.y > 0) {
		enemy.switchSprite('fall');
	}

	// detect for collision
	if (
		rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
		player.isAttacking &&
		player.framesCurrent === 4
	) {
		enemy.takeHit();
		player.isAttacking = false;
		gsap.to('#enemyHealth', {
			width: enemy.health + '%',
		});
		document.querySelector('.enemy-health-percentage').innerHTML =
			enemy.health + '%';
	}

	// if player misses
	if (player.isAttacking && player.framesCurrent === 4) {
		player.isAttacking = false;
	}

	if (
		rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
		enemy.isAttacking &&
		enemy.framesCurrent === 2
	) {
		player.takeHit();
		enemy.isAttacking = false;
		gsap.to('#playerHealth', {
			width: player.health + '%',
		});
		document.querySelector('.player-health-percentage').innerHTML =
			player.health + '%';
	}

	// if enemy misses
	if (enemy.isAttacking && enemy.framesCurrent === 2) {
		enemy.isAttacking = false;
	}

	// end game based on health
	if (enemy.health <= 0 || player.health <= 0 || timer <= 0) {
		determineWinner({ player, enemy, timerId });
		hasGameStarted = false;
	}
}

animate();

window.addEventListener('keydown', ({ key }) => {
	if (key === 'm' || key === 'M') {
		bgmMuted = !bgmMuted;
		if (bgmMuted && player.sounds?.bgm) {
			player.sounds.bgm.pause();
		} else if (!bgmMuted && player.sounds?.bgm && player.sounds.bgm.paused) {
			player.playSound('bgm', true);
		}
		return;
	}

	if (!timer || !hasGameStarted) return;

	if (!player.dead) {
		switch (key) {
			case 'a':
				keys.a.pressed = true;
				player.lastKey = 'a';
				break;
			case 'd':
				keys.d.pressed = true;
				player.lastKey = 'd';
				break;
			case 'w':
				if (player.velocity.y === 0) {
					player.velocity.y = -16;
					player.playSound('jump', true);
				}
				break;
			case 's':
				player.attack();
				break;
			default:
				break;
		}
	}
	if (!enemy.dead) {
		switch (key) {
			case 'ArrowRight':
				keys.ArrowRight.pressed = true;
				enemy.lastKey = 'ArrowRight';
				break;
			case 'ArrowLeft':
				keys.ArrowLeft.pressed = true;
				enemy.lastKey = 'ArrowLeft';
				break;
			case 'ArrowUp':
				if (enemy.velocity.y === 0) {
					enemy.velocity.y = -16;
					enemy.playSound('jump', true);
				}
				break;
			case 'ArrowDown':
				enemy.attack();
				break;
			default:
				break;
		}
	}
});

window.addEventListener('keyup', ({ key }) => {
	switch (key) {
		case 'a':
			keys.a.pressed = false;
			break;
		case 'd':
			keys.d.pressed = false;
			break;
		case 'ArrowRight':
			keys.ArrowRight.pressed = false;
			break;
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false;
			break;

		default:
			break;
	}
});

const resetButton = document.querySelector('.reset-btn');
resetButton.addEventListener('click', () => {
	background = getDefaultBackgroundInstance();
	shop = getDefaultShopInstance();
	player = getDefaultPlayerInstance();
	enemy = getDefaultEnemyInstance();

	gsap.to('#playerHealth', {
		width: player.health + '%',
	});
	gsap.to('#enemyHealth', {
		width: enemy.health + '%',
	});

	document.querySelector('.player-health-percentage').innerHTML = '100%';
	document.querySelector('.enemy-health-percentage').innerHTML = '100%';

	document.querySelector('.result-container').style.display = 'none';
	document.querySelector('.reset').style.display = 'none';

	timer = DEFAULT_TIMER;
	hasGameStarted = true;
	decreaseTimer();
});

const startButton = document.querySelector('.start-btn');
startButton.addEventListener('click', () => {
	document.querySelector('.start').style.display = 'none';
	hasGameStarted = true;
	decreaseTimer();
});
