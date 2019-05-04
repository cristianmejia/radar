import 'jquery';
import 'popper.js';
import 'bootstrap';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';

const style = document.createElement('style');

let canvas;
let context;
let pencil;
let head;
let canvas_width;
let canvas_height;
let radar_ratio = 300;
let cursor_dragging = false;
let cursor_drawing = false;
let vector_drawing = {
	x: [],
	y: [],
	trail: []
};

const drawUI = () => {
	context.beginPath();
	context.arc(canvas_width/2, canvas_height/2, radar_ratio, 0, 2 * Math.PI);
	context.stroke();
};

const drawLine = vector => {
	context.strokeStyle = "#000";
	context.lineJoin = "round"
	context.lineWidth = 7;

	for(var i=0; i < vector.x.length; i++) {		
		context.beginPath();
		if (vector.trail[i] && i) {
			context.moveTo(vector.x[i-1], vector.y[i-1]);
		} else {
			context.moveTo(vector.x[i]-1, vector.y[i]);
		}
		context.lineTo(vector.x[i], vector.y[i]);
		context.closePath();
		context.stroke();
	}
};

const updateCanvas = () => {
	// Draw a rect to clear the canvas
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	drawUI();
};

const starDrag = event => {
	cursor_dragging = true;
	canvas.addEventListener('mousemove', dragging, false);
	canvas.addEventListener('touchmove', dragging, false);
};

const dragging = event => {
	console.log('dragging');
};

const stopDrag = event => {
	cursor_dragging = false;
	canvas.removeEventListener('mousemove', dragging, false);
	canvas.removeEventListener('touchmove', dragging, false);
};

const startDraw = event => {
	cursor_drawing = true;
	canvas.addEventListener('mousemove', drawing, false);
	canvas.addEventListener('touchmove', drawing, false);
};

const stopDraw = event => {
	cursor_drawing = false;
	canvas.removeEventListener('mousemove', drawing, false);
	canvas.removeEventListener('touchmove', drawing, false);
};

const drawing = event => {
	const addVector = (x, y, dragging) => {
		vector_drawing.x.push(x);
		vector_drawing.y.push(y);
		vector_drawing.trail.push(dragging);
	};
	addVector(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop, dragging);
	updateCanvas();
	drawLine(vector_drawing);
};

document.addEventListener("DOMContentLoaded", function(event) {
	canvas = document.querySelector('[data-radar="canvas"]');
	pencil = document.querySelector('[data-radar="pencil"]');
	head = document.querySelector('head');

	context = canvas.getContext("2d");

	if (head & style) {
		// Adding boostrap
		style.appendChild(document.createTextNode(bootstrap));
		head.appendChild(style);
	}

	// Full screen canvas
	// canvas.style.width = window.innerWidth + "px";
	// canvas.style.height = window.innerHeight + "px";
	if (pencil) {
		pencil.addEventListener('click', () => {
			if (pencil.checked) {
				canvas.addEventListener('mousedown', startDraw, false);
				canvas.addEventListener('mouseout', stopDraw, false);
				canvas.addEventListener('mouseup', stopDraw, false);

				canvas.addEventListener('touchstart', startDraw, false);
				canvas.addEventListener('touchend', startDraw, false);
			} else {
				cursor_drawing = false;
				canvas.removeEventListener('mousemove', drawing, false);
				canvas.removeEventListener('touchmove', drawing, false);
			}
		}, false);	
	}

	if (canvas) {
		canvas_width = canvas.dataset.radarWidth;
		canvas_height = canvas.dataset.radarHeight;
		drawUI();
		canvas.addEventListener('mousedown', starDrag, false);
		canvas.addEventListener('mouseout', stopDrag, false);
		canvas.addEventListener('mouseup', stopDrag, false);

		canvas.addEventListener('touchstart', starDrag, false);
		canvas.addEventListener('touchend', stopDrag, false);
	}
});
