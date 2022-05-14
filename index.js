"use strict";
import King from "./king.js";
import Map from "./map.js";

let canvas;
let context;
let king;
let map;

let editMode = false;

window.onload = init;

function init() {
	canvas = document.querySelector("canvas");
	context = canvas.getContext("2d");

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	map = new Map(context);
	king = new King(context, canvas.width / 2, canvas.height / 2);

	//sauvegarde les touches appuyées
	window.addEventListener("keydown", (event) => {
		keysPressed[event.code] = true;
		switch (event.code) {
			case "KeyE":
				console.log("Switch to edit mode");
				editMode = !editMode;
				break;

			case "KeyS":
				if (!editMode) return;
				map.save();
				break;
		}
	});

	//enlève les touches appuyées
	window.addEventListener("keyup", (event) => {
		delete keysPressed[event.code];
	});

	window.addEventListener("click", (event) => {
		console.log(event);
		if (editMode) {
			map.addObstacle(event.clientX, event.clientY);
		}
	});

	window.addEventListener("mousemove", (event) => {
		if (editMode) {
			map.updateMousePosition(event.clientX, event.clientY);
		}
	});

	document.addEventListener('contextmenu', (event) => {
		event.preventDefault();
		if(editMode) {
			map.stopDrawing();
		}
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
	if (editMode) {
		map.update();
	} else {
		king.update();
	}
}

function drawGame() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	if (editMode) {
		map.draw();
	} else {
		king.draw();
	}
}

