window.onload = () => {
	/** @type {HTMLCanvasElement} */
	const canvas = document.getElementsByClassName("snake-game")[0];

	const context = canvas.getContext("2d");

	const fps = 15;
	window.setInterval(render, 1000 / fps);

	const score_span = document.getElementsByClassName("score")[0];

	let x_velocity = 1;
	let y_velocity = 0;

	let x_coordinate = (y_coordinate = 0);
	let apple_x_coordinate = (apple_y_coordinate = 15);

	let snake_array = [];
	let snake_length = 0;

	const rows = (columns = 20);
	const cell_gap = 1;
	const cell_width = canvas.width / columns;
	const cell_height = canvas.height / rows;

	function render() {
		x_coordinate += x_velocity;
		y_coordinate += y_velocity;

		// handle boundaries
		if (x_coordinate < 0) {
			x_coordinate = columns - 1;
		}
		if (x_coordinate > columns - 1) {
			x_coordinate = 0;
		}
		if (y_coordinate < 0) {
			y_coordinate = rows - 1;
		}
		if (y_coordinate > rows - 1) {
			y_coordinate = 0;
		}

		context.fillStyle = "black";
		context.fillRect(0, 0, canvas.width, canvas.height);

		context.fillStyle = "red";
		context.fillRect(
			apple_x_coordinate * cell_width + cell_gap,
			apple_y_coordinate * cell_height + cell_gap,
			cell_width - cell_gap,
			cell_height - cell_gap
		);

		context.fillStyle = "lime";
		for (let i = 0; i < snake_array.length; i++) {
			context.fillRect(
				snake_array[i].x * cell_width + cell_gap,
				snake_array[i].y * cell_height + cell_gap,
				cell_width - cell_gap,
				cell_height - cell_gap
			);

			if (
				snake_array[i].x === x_coordinate &&
				snake_array[i].y === y_coordinate
			) {
				snake_array = [];
				snake_length = 0;
			}
		}

		if (
			x_coordinate === apple_x_coordinate &&
			y_coordinate === apple_y_coordinate
		) {
			snake_length++;

			apple_x_coordinate = Math.floor(Math.random() * columns);
			apple_y_coordinate = Math.floor(Math.random() * rows);
		}

		snake_array.push({ x: x_coordinate, y: y_coordinate });

		while (snake_array.length > snake_length) {
			snake_array.shift();
		}

		context.fillRect(
			x_coordinate * cell_width + cell_gap,
			y_coordinate * cell_height + cell_gap,
			cell_width - cell_gap,
			cell_height - cell_gap
		);

		score_span.innerText = `Score: ${snake_length}`;
	}

	document.addEventListener("keydown", (event) => {
		switch (event.code) {
			case "ArrowUp":
				if (y_velocity === 0) {
					x_velocity = 0;
					y_velocity = -1;
				}
				break;
			case "ArrowRight":
				if (x_velocity === 0) {
					x_velocity = 1;
					y_velocity = 0;
				}
				break;

			case "ArrowDown":
				if (y_velocity === 0) {
					x_velocity = 0;
					y_velocity = 1;
				}
				break;
			case "ArrowLeft":
				if (x_velocity === 0) {
					x_velocity = -1;
					y_velocity = 0;
				}
				break;
			default:
				break;
		}
	});

	const threshold = 30;
	const touchableElement = document.getElementsByTagName("body")[0];

	touchableElement.addEventListener(
		"touchstart",
		function (event) {
			touchstartX = event.changedTouches[0].screenX;
			touchstartY = event.changedTouches[0].screenY;
		},
		false
	);

	touchableElement.addEventListener(
		"touchend",
		function (event) {
			touchendX = event.changedTouches[0].screenX;
			touchendY = event.changedTouches[0].screenY;
			handleGesture();
		},
		false
	);

	function handleGesture() {
		const xDiff = touchstartX - touchendX;
		const yDiff = touchstartY - touchendY;

		if (xDiff < -threshold) {
			// console.log("Swiped Left");
			if (x_velocity === 0) {
				x_velocity = -1;
				y_velocity = 0;
			}
		}

		if (xDiff > threshold) {
			// console.log("Swiped Right");
			if (x_velocity === 0) {
				x_velocity = 1;
				y_velocity = 0;
			}
		}

		if (yDiff < -threshold) {
			// console.log("Swiped Up");
			if (y_velocity === 0) {
				x_velocity = 0;
				y_velocity = -1;
			}
		}

		if (yDiff > threshold) {
			// console.log("Swiped Down");
			if (y_velocity === 0) {
				x_velocity = 0;
				y_velocity = 1;
			}
		}

		// if (touchendY === touchstartY) {
		// 	console.log("Tap");
		// }
	}
};
