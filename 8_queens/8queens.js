// General
var canvas;
var canvasWidth = 1200;
var canvasHeight = 680;
var fps = 60;
var animationSpeed = 100;
var mode = 0; // 0: mutation	1: crossOver
var fastForward = false;
var boards = [];
var populationCount = 24;

// UI
var bgColor = 245;
var boardImg;
var queenImg;
var leftColumnWidth = canvasWidth * 0.25;
var bestBoardSize;
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

// Mutation alg
var numberOfTriesOnEachBoard = 0;

// Crossover alg
var crossoverMode = 0; // 0: two best    1: two worst    2: best and worst    3: random

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

	if (mode == 0) {
		mutationProcess();
	}
	else {
		crossoverProcess();
	}

	displayObjects();
	displayInfo();
	// displayFPS();
}

function displayObjects() {
    // Draw background
    background(bgColor);

    // Draw separator
    strokeWeight(separatorThickness);
    stroke(color(30));
    line(leftColumnWidth, 0, leftColumnWidth, height);

    // Draw boards
    if (!fastForward) {
        boards.forEach(b => { b.display(); });
    }
    if (best1 != null) {
        best1.display();
    }
    if (best2 != null) {
        best2.display();
    }
    if (parent1 != null && parent2 != null) {
        parent1.display();
        parent2.display();
    }
}

function finishAllAnimations() {
    boards.forEach(b => { b.finishAnimation(); });
    if (best1 != null) {
        best1.finishAnimation();
    }
    if (best2 != null) {
        best2.finishAnimation();
    }
    if (parent1 != null && parent2 != null) {
        parent1.finishAnimation();
        parent2.finishAnimation();
    }
}

function reset() {
	boards = [];
	parent1 = null;
	parent2 = null;
	best2 = null;
	best1 = null;
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
		case 82: // R key
			reset();
			break;
		case 77: // M key
			toggleMode();
			break;
		case 67: // C key
			crossoverMode++;
			if (crossoverMode > 3)
				crossoverMode = 0;
			break;
		default:
			break;
	}
}

function toggleMode(){
	if(mode == 0){
		mode = 1;
		leftColumnWidth = canvasWidth * 0.46;
	}
	else{
		mode = 0;
		leftColumnWidth = canvasWidth * 0.25;
	}
	reset();
	updateBoards();
}

function updateBoards() {
	calculateBestBoardSize();
	calculateSmallBoardSize(boards.length);
	calculateBoardsPositions();
	for (var i = 0; i < boards.length; i++) {
		boards[i].size = smallBoardSize;
		boards[i].position = calculatePosition(i);
	}
	if (best1 != null) {
		best1.size = bestBoardSize;
		best1.position = bestBoardPosition;
	}
	if (best2 != null) {
		best1.size = bestBoardSize;
		best1.position = bestBoardPosition;
	}
	if (parent1 != null && parent2 != null) {
		parent1.size = bestBoardSize;
		parent1.position = parent1Position;
		parent2.size = bestBoardSize;
		parent2.position = parent2Position;
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
	return new ChessBoard([getRandomRow(), getRandomRow(), getRandomRow(), getRandomRow(), getRandomRow(), getRandomRow(), getRandomRow(), getRandomRow()], 0);
}

function timeToFrames(seconds) {
	return (100 / animationSpeed) * seconds * fps;
}