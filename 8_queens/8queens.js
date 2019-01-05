// General
var canvas;
var canvasWidth = 1200;
var canvasHeight = 680;
var fps = 60;
var animationSpeed = 100;
var fastForward = false;
var boards = [];
var populationCount = 24;

// UI
var boardImg;
var queenImg;
var leftColumnWidth = canvasWidth * 0.25;
var bestBoardSize;
var bestBoardPosition;
var blocksHeightWidthRatio = 1.1;
var columns;
var rows;
var topMargin;
var blockWidth;
var blockPaddingRatio = 0.1;
var blockPadding;
var smallBoardSize;
var separatorThickness = 2.5;

// Step control
var step = 0;
var nextStep = false;

// Genetic algorithm
var gaMode = 0; // 0: only mutation    1: crossover + mutation
var numberOfTriesOnEachBoard = 0; // number of extra tries to get better fitness from mutating a board (only affects mutation-only mode)

function preload() {
	boardImg = loadImage('img/board.png');
	queenImg = loadImage('img/queen.png');
}

function setup() {
	frameRate(fps);
	canvas = createCanvas(canvasWidth, canvasHeight);
	centerCanvas();
	calculateBestBoardSize();
	calculateBoardsPositions();
}

function draw() {
	handlePanelWidthChange();
	handleSpeedChange();
	handlePopulationChange();

	if (fastForward) {
		if ((frameCount % Math.floor(1000 / animationSpeed) == 0)) {
			nextStep = true;
		}
	}

	GAProcess(); // run genetic algorithm process

	displayObjects();
	displayUI();
	// displayFPS();
}

function displayObjects() {
	// Draw background
	background(245);

	// Draw separator
	strokeWeight(separatorThickness);
	stroke(color(30));
	line(leftColumnWidth, 0, leftColumnWidth, height);

	// Draw boards
	if (!fastForward) {
		boards.forEach(function (b) {
			b.display()
		});
	}
	if (currentBoard != null) {
		currentBoard.display();
	}
	if (previousBoard != null) {
		previousBoard.display();
	}
	if (helperBoard1 != null) {
		helperBoard1.display();
	}
	if (helperBoard2 != null) {
		helperBoard2.display();
	}
}

function finishAllAnimations() {
	boards.forEach(function (b) {
		b.finishAnimation()
	});
	if (currentBoard != null) {
		currentBoard.finishAnimation();
	}
}

function reset() {
	boards = [];
	newTwoBests = null;
	previousBoard = null;
	currentBoard = null;
	helperBoard1 = null;
	helperBoard2 = null;
	step = 0;
	fastForward = false;
}

function keyPressed() {
	switch (keyCode) {
		case ENTER:
		case 32: // Space-bar
			nextStep = true;
			break;
		case 70: // F key
			fastForward = !fastForward;
			break;
		case 77: // M key
			toggleMode();
			break;
		case 82: // R key
			reset();
			break;
		default:
			break;
	}
}

function toggleMode() {
	if (gaMode == 0)
		gaMode = 1;
	else
		gaMode = 0;

	finishAllAnimations();
	removeHightlights();
	findAndHighlightBestBoards(0);
}

function updateBoards() {
	calculateBestBoardSize();
	calculateSmallBoardSize(boards.length);
	calculateBoardsPositions();
	for (let i = 0; i < boards.length; i++) {
		boards[i].setSize(smallBoardSize);
		boards[i].position = calculatePosition(i);
	}
	if (currentBoard != null) {
		currentBoard.setSize(bestBoardSize);
		currentBoard.position = bestBoardPosition;
	}
}

function windowResized() {
	centerCanvas();
}

function centerCanvas() {
	canvas.position(windowWidth / 2 - width / 2, windowHeight / 2 - height / 2);
}

function getRandomRow() {
	return Math.floor(random(8));
}

function getRandomBoard() {
	let queens = [getRandomRow(), getRandomRow(), getRandomRow(), getRandomRow(), getRandomRow(), getRandomRow(), getRandomRow(), getRandomRow()];
	return new ChessBoard(queens);
}

function timeToFrames(seconds) {
	return (100 / animationSpeed) * seconds * fps;
}