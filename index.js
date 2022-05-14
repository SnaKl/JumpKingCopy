"use strict";
import King from "./king.js";

let canvas;
let context;
let king;

window.onload = init;

function init() {
	canvas = document.querySelector("canvas");
	context = canvas.getContext("2d");

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	king = new King(context, canvas.width / 2, canvas.height / 2);

	//sauvegarde les touches appuyées
	window.addEventListener("keydown", (event) => {
		keysPressed[event.code] = true;
	});

	//enlève les touches appuyées
	window.addEventListener("keyup", (event) => {
		delete keysPressed[event.code];
	});

	window.requestAnimationFrame(gameLoop);
}

function gameLoop() {
	//update the game
	updateGame();
	//draw the game
	drawGame();
	//new frame
	window.requestAnimationFrame(gameLoop);
}

function updateGame() {
	king.update();
}

function drawGame() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	king.draw();
}