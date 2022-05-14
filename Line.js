"use strict";

export default class Line {
	constructor(context, x1, y1, x2, y2) {
		this.context = context;
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
	}

	draw() {
		this.context.beginPath();
		this.context.moveTo(this.x1, this.y1);
		this.context.lineTo(this.x2, this.y2);
		this.context.stroke();
	}

	movePoint(point, x, y) {
		if (point === "start") {
			this.x1 = x;
			this.y1 = y;
		} else if (point === "end") {
			this.x2 = x;
			this.y2 = y;
		}
	}

	toString() {
		return "["+this.x1 + "," + this.y1 + "," + this.x2 + "," + this.y2 + "]";
	}

	update() {}
}