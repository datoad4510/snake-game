import SnakeGame from "./javascript/classes/Game.js";

window.onload = () => {
	/** @type {HTMLCanvasElement} */
	const canvas = document.getElementsByClassName("snake-game")[0];

	const borderWidth = 2;

	canvas.width = canvas.height =
		(Math.min(document.body.clientHeight, document.body.clientWidth) -
			borderWidth) /
		1.5;

	console.log(Math.min(window.innerHeight, window.innerWidth));
	console.log(window.innerWidth, window.innerHeight);
	console.log(canvas.width, canvas.height);

	const options = {
		canvas,
		score_span: document.getElementsByClassName("score")[0],
		rows: 20,
		columns: 20,
		cell_gap: 1,
		fps: 15,
	};

	const game = new SnakeGame(options);

	game.start();
};
