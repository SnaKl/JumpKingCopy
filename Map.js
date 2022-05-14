"use strict";

const savedMap = "";

import Line from "./Line.js";

export default class Map {
	constructor(context) {
		this.context = context;

		this.lines = [];
		this.drawing = false;
		this.mouse = {
			x: 0,
			y: 0
		};
		this.drawingLine = null;
	}

	addLine(line) {
		this.lines.push(line);
	}

	update() {
		if (this.drawing && this.drawingLine) {
			this.drawingLine.movePoint("end", this.mouse.x, this.mouse.y);
		}

		this.lines.forEach(line => {
			line.update();
		});
	}

	draw() {
		if (this.drawing && this.drawingLine) {
			this.drawingLine.draw();
		}

		for (const line of this.lines) {
			line.draw();
		}
		/*
		this.context.beginPath();
		this.context.rect(this.x, this.y, this.width, this.height);
		this.context.fillStyle = "#ff0000";
		this.context.fill();
		*/
	}

	addObstacle(x, y) {
		if (!this.drawing) {
			this.drawing = true;
			this.drawingLine = new Line(this.context, x, y, x, y);
		} else {
			this.drawingLine.x2 = x;
			this.drawingLine.y2 = y;
			this.lines.push(this.drawingLine);
			this.drawingLine = new Line(this.context, x, y, x, y);
		}
	}

	stopDrawing() {
		this.drawing = false;
		this.drawingLine = null;
	}

	updateMousePosition(x, y) {
		this.mouse.x = x;
		this.mouse.y = y;
	}

	save() {
		console.log(this.lines.toString());
	}
}