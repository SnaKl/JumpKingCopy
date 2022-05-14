"use strict";

const kingSettings = {
	left: "ArrowLeft",
	right: "ArrowRight",
	jump: "Space",
};

const terminalYVelocity = 10;
const terminalXVelocity = 6;
const terminalJumpMomentum = 18;
const minimumJumpMomentum = 5;
const jumpXImpulse = 7;

const kingWidth = 50;
const kingHeight = 80;
const kingCrunchHeight = 40;

const gravity = 0.5;

const xVelocity = 0.1;
const yVelocity = 0.4;

export default class King {
	constructor(context, x, y) {
		this.context = context;
		this.x = x;
		this.y = y;

		this.width = kingWidth;
		this.height = kingHeight;

		this.jumpMomentum = 0;
		this.currentYSpeed = 0;
		this.currentXSpeed = 0;

		this.prepareJump = false;
		this.isMoving = false;
		this.isOnGround = false;
	}

	/**
	 * Draw king
	 */
	draw() {
		this.context.beginPath();
		this.context.rect(this.x, this.y, this.width, this.height);
		this.context.fillStyle = "#ff0000";
		this.context.fill();
	}

	/**
	 * Update king
	 */
	update() {
		this.checkInput();
		this.updatePosition();
	}

	/**
	 * Check input pour les controls du player
	 */
	checkInput() {
		let arrayKeysPressed = Object.keys(keysPressed);
		//récupère la première touche pressée entre droite et gauche
		let directionInput = arrayKeysPressed.find((key) =>
			[kingSettings.left, kingSettings.right].includes(key)
		);
		//si on ne saute pas et qu'on veut bouger
		if (!(kingSettings.jump in keysPressed) && directionInput) {
			this.move(directionInput);
		} else if (!directionInput && this.isMoving) this.stopMoving();

		//si on veut sauter
		if (kingSettings.jump in keysPressed) this.jumpChanneling(directionInput);
		else if (!(kingSettings.jump in keysPressed) && this.prepareJump)
			this.jump();
	}

	/**
	 * Le player prépare un saut
	 */
	jumpChanneling() {
		if (!this.isOnGround) return;
		if (this.jumpMomentum >= terminalJumpMomentum) return;

		this.prepareJump = true;
		this.currentXSpeed = 0;

		if (this.height !== kingCrunchHeight) {
			this.y += this.height - kingCrunchHeight;
			this.height = kingCrunchHeight;
		}

		this.jumpMomentum = Math.min(
			this.jumpMomentum + yVelocity,
			terminalJumpMomentum
		);
	}

	/**
	 * Le player saute
	 */
	jump() {
		if (!this.prepareJump) return;
		this.prepareJump = false;

		let yDiff = kingHeight - this.height;
		this.height = kingHeight;
		this.y -= yDiff;

		if (this.jumpMomentum <= 0 || this.jumpMomentum < minimumJumpMomentum)
			return;

		this.currentYSpeed = -this.jumpMomentum;
		this.jumpMomentum = 0;
		this.isOnGround = false;

		let arrayKeysPressed = Object.keys(keysPressed);
		//récupère la première touche pressée entre droite et gauche
		let directionInput = arrayKeysPressed.find((key) =>
			[kingSettings.left, kingSettings.right].includes(key)
		);
		//impulsion en x pour un saut avec une direction
		if (directionInput === kingSettings.left) this.currentXSpeed = -jumpXImpulse;
		else if (directionInput === kingSettings.right) this.currentXSpeed = jumpXImpulse;
	}

	/**
	 * Bouge le player vers la droite ou vers la gauche en fonction de la touche pressée
	 * @param directionInput touche pressée
	 */
	move(directionInput) {
		if (!this.isOnGround) return;
		if (this.prepareJump) return;

		let xDirectionModifier = 0;
		if (directionInput === kingSettings.left) {
			if (this.x <= 0) return;
			if (this.currentXSpeed > 0) this.currentXSpeed = 0; //enlever si besoin de glissade
			xDirectionModifier = -1;
		} else if (directionInput === kingSettings.right) {
			if (this.x >= this.context.canvas.width - this.width) return;
			if (this.currentXSpeed < 0) this.currentXSpeed = 0; //enlever si besoin de glissade
			xDirectionModifier = 1;
		}

		this.currentXSpeed = Math.min(
			this.currentXSpeed + xVelocity * xDirectionModifier,
			terminalXVelocity
		);
		this.isMoving = true;
	}

	/**
	 * Arrête le player quand relâche les touches pour bouger
	 */
	stopMoving() {
		if (!this.isOnGround) return;
		this.currentXSpeed = 0;
		this.isMoving = false;
	}

	/**
	 * Met à jour la position du player en Y
	 */
	applyYMovement() {
		if (this.isOnGround) return;
		//si le player à atteint le bas du canvas
		if (this.y + this.height > this.context.canvas.height || this.y + this.currentYSpeed + this.height > this.context.canvas.height) {
			this.y = this.context.canvas.height - this.height;
			this.isOnGround = true;
			this.currentYSpeed = 0;
			return;
		}

		this.currentYSpeed = Math.min(
			this.currentYSpeed + gravity,
			terminalYVelocity
		);
		this.y += this.currentYSpeed;
	}

	/**
	 * Met à jour la position du player en X
	 */
	applyXMovement() {
		if (!this.isMoving || this.currentXSpeed === 0) return;
		//si le player atteint les bords du canvas le fait rebondir
		if (this.x + this.currentXSpeed + this.width > this.context.canvas.width || this.x + this.currentXSpeed < 0)
			this.currentXSpeed = -this.currentXSpeed / 2;
		this.x += this.currentXSpeed;
	}

	/**
	 * Met à jour la position du player
	 */
	updatePosition() {
		this.applyYMovement();
		this.applyXMovement();
	}
}
