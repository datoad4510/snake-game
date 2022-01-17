import randomPicker from "../helpers/randomPicker.js";

class Game {
	constructor({ canvas, score_span, rows, columns, cell_gap, fps }) {
		this.canvas = canvas;
		this.score_span = score_span;
		this.cell_gap = cell_gap;
		this.fps = fps;
		this.rows = rows;
		this.columns = columns;
		this.cell_width = this.canvas.width / this.columns;
		this.cell_height = this.canvas.height / this.rows;
		this.x_coordinate = Math.floor(Math.random() * this.rows);
		this.y_coordinate = Math.floor(Math.random() * this.columns);
		this.apple_x_coordinate = Math.floor(Math.random() * this.rows);
		this.apple_y_coordinate = Math.floor(Math.random() * this.columns);
		this.context = canvas.getContext("2d");
		({ x_velocity: this.x_velocity, y_velocity: this.y_velocity } =
			randomPicker(this.random_initial_velocity_arr));

		document.addEventListener("keydown", this.keyHandler.bind(this));

		this.threshold = 40;
		const touchableElement = document.getElementsByTagName("html")[0];

		touchableElement.addEventListener(
			"touchstart",
			this.touchStartHandler.bind(this),
			false
		);

		touchableElement.addEventListener(
			"touchend",
			this.touchEndHandler.bind(this),
			false
		);
	}

	random_initial_velocity_arr = [
		{ x_velocity: -1, y_velocity: 0 },
		{ x_velocity: 1, y_velocity: 0 },
		{ x_velocity: 0, y_velocity: -1 },
		{ x_velocity: 0, y_velocity: 1 },
	];

	snake_array = [];
	snake_length = 0;

	touchStartHandler(event) {
		this.touchstartX = event.changedTouches[0].screenX;
		this.touchstartY = event.changedTouches[0].screenY;
	}

	touchEndHandler(event) {
		this.touchendX = event.changedTouches[0].screenX;
		this.touchendY = event.changedTouches[0].screenY;
		this.touchHandler();
	}

	start() {
		this.intervalId = window.setInterval(
			this.render.bind(this),
			1000 / this.fps
		);
	}

	end() {
		window.clearInterval(this.intervalId);
	}

	handleBoundaries() {
		if (this.x_coordinate < 0) {
			this.x_coordinate = this.columns - 1;
		}
		if (this.x_coordinate > this.columns - 1) {
			this.x_coordinate = 0;
		}
		if (this.y_coordinate < 0) {
			this.y_coordinate = this.rows - 1;
		}
		if (this.y_coordinate > this.rows - 1) {
			this.y_coordinate = 0;
		}
	}

	fillBackground() {
		this.context.fillStyle = "black";
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	drawApple() {
		this.context.fillStyle = "red";
		this.context.fillRect(
			this.apple_x_coordinate * this.cell_width + this.cell_gap,
			this.apple_y_coordinate * this.cell_height + this.cell_gap,
			this.cell_width - this.cell_gap,
			this.cell_height - this.cell_gap
		);
	}

	handleLoss() {
		this.snake_array = [];
		this.snake_length = 0;
	}

	drawSnake() {
		this.context.fillStyle = "lime";
		for (let i = 0; i < this.snake_array.length; i++) {
			this.context.fillRect(
				this.snake_array[i].x * this.cell_width + this.cell_gap,
				this.snake_array[i].y * this.cell_height + this.cell_gap,
				this.cell_width - this.cell_gap,
				this.cell_height - this.cell_gap
			);

			if (
				this.snake_array[i].x === this.x_coordinate &&
				this.snake_array[i].y === this.y_coordinate
			) {
				this.handleLoss();
			}
		}
	}

	handleScore() {
		this.score_span.innerText = `Score: ${this.snake_length}`;
	}

	eatApple() {
		if (
			this.x_coordinate === this.apple_x_coordinate &&
			this.y_coordinate === this.apple_y_coordinate
		) {
			this.snake_length++;

			this.apple_x_coordinate = Math.floor(Math.random() * this.columns);
			this.apple_y_coordinate = Math.floor(Math.random() * this.rows);
		}
	}

	render() {
		this.fillBackground();
		this.drawApple();
		this.handleBoundaries();
		this.drawSnake();
		this.eatApple();

		// add current head to tail
		this.snake_array.push({ x: this.x_coordinate, y: this.y_coordinate });

		// keep tail consistent
		while (this.snake_array.length > this.snake_length) {
			this.snake_array.shift();
		}

		// draw head
		this.context.fillRect(
			this.x_coordinate * this.cell_width + this.cell_gap,
			this.y_coordinate * this.cell_height + this.cell_gap,
			this.cell_width - this.cell_gap,
			this.cell_height - this.cell_gap
		);
		this.handleScore();

		this.x_coordinate += this.x_velocity;
		this.y_coordinate += this.y_velocity;
	}

	keyHandler(event) {
		switch (event.code) {
			case "ArrowUp":
				if (this.y_velocity === 0) {
					this.x_velocity = 0;
					this.y_velocity = -1;
				}
				break;
			case "ArrowRight":
				if (this.x_velocity === 0) {
					this.x_velocity = 1;
					this.y_velocity = 0;
				}
				break;

			case "ArrowDown":
				if (this.y_velocity === 0) {
					this.x_velocity = 0;
					this.y_velocity = 1;
				}
				break;
			case "ArrowLeft":
				if (this.x_velocity === 0) {
					this.x_velocity = -1;
					this.y_velocity = 0;
				}
				break;
			default:
				break;
		}
	}

	touchHandler() {
		const xDiff = this.touchendX - this.touchstartX;
		const yDiff = this.touchendY - this.touchstartY;

		if (xDiff < -this.threshold) {
			// console.log("Swiped left");
			if (this.x_velocity === 0) {
				this.x_velocity = -1;
				this.y_velocity = 0;
			}
		}

		if (xDiff > this.threshold) {
			// console.log("Swiped right");
			if (this.x_velocity === 0) {
				this.x_velocity = 1;
				this.y_velocity = 0;
			}
		}

		if (yDiff < -this.threshold) {
			// console.log("Swiped Up");
			if (this.y_velocity === 0) {
				this.x_velocity = 0;
				this.y_velocity = -1;
			}
		}

		if (yDiff > this.threshold) {
			// console.log("Swiped Down");
			if (this.y_velocity === 0) {
				this.x_velocity = 0;
				this.y_velocity = 1;
			}
		}

		// if (touchendY === touchstartY) {
		// 	console.log("Tap");
		// }
	}
}

export default Game;
