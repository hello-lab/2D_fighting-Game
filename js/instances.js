import { Fighter, Sprite } from './classes';

// shop and background images
import backgroundImageUrl from '../img/background1acm.png';
import shopImageUrl from '../img/logo.png';
import backgroundImageUrl1 from '../img/background2.png';

// player sprites
import playerIdleImageUrl from '../img/samuraiMack/Idle1.png';
import playerRunImageUrl from '../img/samuraiMack/Runn.png';
import playerJumpImageUrl from '../img/samuraiMack/Jump1.png';
import playerFallImageUrl from '../img/samuraiMack/Fall.png';
import playerAttack1ImageUrl from '../img/samuraiMack/Attack_1.png';
import playerTakeHitImageUrl from '../img/samuraiMack/hurt.png';
import playerDeathImageUrl from '../img/samuraiMack/Death.png';

// enemy sprites
import enemyIdleImageUrl from '../img/Gangsters_3/Idle.png';
import enemyRunImageUrl from '../img/Gangsters_3/Run.png';
import enemyJumpImageUrl from '../img/Gangsters_3/Jump.png';
import enemyFallImageUrl from '../img/Gangsters_3/Jump.png';
import enemyAttack1ImageUrl from '../img/Gangsters_3/Attack.png';
import enemyTakeHitImageUrl from '../img/Gangsters_3/Hurt.png';
import enemyDeathImageUrl from '../img/Gangsters_3/Dead.png';

export const getDefaultBackgroundInstance = () =>
	new Sprite({
		position: { x: 0, y: 0 },
		imageSrc: backgroundImageUrl,
		//scale: 0.375,
	});
export const getDefaultBackgroundInstance1 = () =>
	new Sprite({
		position: { x: 0, y: 0 },
		imageSrc: backgroundImageUrl1,
		scale: 1,
	});

export const getDefaultShopInstance = () =>
	new Sprite({
		position: { x: 750, y: 48 },
		imageSrc: shopImageUrl,
		scale: 0.15,
		//framesMax: 6,
	});

export const getDefaultPlayerInstance = () =>
	new Fighter({
		position: { x: 10, y: 0 },
		velocity: { x: 0, y: 1 },
		imageSrc: playerIdleImageUrl,
		framesMax: 10,
		scale: 2,
		offset: {
			x: 75,
			y: 105,
		},
		
		sprites: {
			idle: {
				imageSrc: playerIdleImageUrl,
				framesMax: 6,
			},
			run: {
				imageSrc: playerRunImageUrl,
				framesMax: 10,
			},
			jump: {
				imageSrc: playerJumpImageUrl,
				// Jump and fall are on the same spritesheet; total frames in sheet
				framesTotal: 10,
				// first half: jump (5 frames)
				framesMax: 5,
				framesOffset: 0,
			},
			fall: {
				imageSrc: playerJumpImageUrl,
				framesTotal: 10,
				// second half: fall (5 frames), offset starts after jump frames
				framesMax: 5,
				framesOffset: 5,
			},
			attack1: {
				imageSrc: playerAttack1ImageUrl,
				framesMax: 6,
			},
			takeHit: {
				imageSrc: playerTakeHitImageUrl,
				framesMax: 4,
			},
			death: {
				imageSrc: playerDeathImageUrl,
				framesMax: 6,
			},
		},
		attackBox: {
			offset: { x: 60, y: 30 },
			width: 50,
			height: 50,
		},
	});

export const getDefaultEnemyInstance = () =>
	new Fighter({
		position: { x: 950, y: 100 },
		velocity: { x: 0, y: 0 },
		offset: { x: -50, y: 0 },
		color: 'blue',
		imageSrc: enemyIdleImageUrl,
		framesMax: 8,
		scale: 2,
		offset: {
			x: 105,
			y: 105,
		},
		sprites: {
			idle: {
				imageSrc: enemyIdleImageUrl,
				framesMax: 7,
			},
			run: {
				imageSrc: enemyRunImageUrl,
				framesMax: 10,
			},
			jump: {
				imageSrc: enemyJumpImageUrl,
				framesTotal: 10,
				framesMax: 5,
			},
			fall: {
				imageSrc: enemyFallImageUrl,
				framesTotal: 10,
				framesMax: 5,
				framesOffset: 5
			},
			attack1: {
				imageSrc: enemyAttack1ImageUrl,
				framesMax: 5,
			},
			takeHit: {
				imageSrc: enemyTakeHitImageUrl,
				framesMax: 4,
			},
			death: {
				imageSrc: enemyDeathImageUrl,
				framesMax: 5,
			},
		},
		attackBox: {
			offset: { x: -50, y: 30 },
			width: 50,
			height: 50,
		},
	});
