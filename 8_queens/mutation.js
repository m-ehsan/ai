var best1;
var best2;
var newBest;
var numberOfTries = 0;
var bestBoardPosition;

function mutationProcess() {
	// initialize population
	if (boards.length == 0) {
		initialzePopulation();
	}

	// process next step
	if (nextStep) {
		nextStep = false;

		if (best1 != null) {
			if (best1.fitness == 1) {
				return;
			}
		}

		step++;
		finishAllAnimations();

		best2 = best1;
		var delayNextGeneration = false;

		if (best1 == null) {
			best1 = newBest;
			delayNextGeneration = true;
			animateBestBoard();
		}
		else if (newBest.heuristic < best1.heuristic) {
			best1 = newBest;
			delayNextGeneration = true;
			animateBestBoard();
			animatePreviousBestBoard();
		}
		else {
			if (numberOfTries < numberOfTriesOnEachBoard) {
				numberOfTries++;
			}
			else {
				numberOfTries = 0;
				best1 = newBest;
				delayNextGeneration = true;
				animateBestBoard();
				animatePreviousBestBoard();
			}
		}

		// mutate the best
		generateMutatedPopulation(delayNextGeneration);
	}
}

function initialzePopulation() {
	calculateSmallBoardSize(populationCount);
	for (var i = 0; i < populationCount; i++) {
		var newBoard = getRandomBoard();
		newBoard.opacityAnimation = {
			from: 0,
			to: 1,
			length: timeToFrames(1 / populationCount),
			progress: 0,
			delay: i * timeToFrames(1 / populationCount)
		};
		newBoard.size = smallBoardSize;
		newBoard.opacity = 0;
		newBoard.position = calculatePosition(i);
		boards.push(newBoard);
	}
	newBest = findTheBest();
	newBest.highlightAnimation = {
		from: 0,
		to: 1,
		length: timeToFrames(0.5),
		progress: 0,
		delay: timeToFrames(1)
	};
}

function generateMutatedPopulation(delay) {
	if (best1.fitness != 1) {
		boards = [];
		calculateSmallBoardSize(populationCount);
		for (var i = 0; i < populationCount; i++) {
			var temp = mutateBoard(best1);
			temp.opacityAnimation = {
				from: 0,
				to: 1, length: timeToFrames(1 / populationCount),
				progress: 0,
				delay: i * timeToFrames(1 / populationCount) + ((delay) ? timeToFrames(0.6) : 0)
			};
			temp.size = smallBoardSize;
			temp.opacity = 0;
			temp.position = calculatePosition(i);
			boards.push(temp);
		}
		newBest = findTheBest();
		newBest.highlightAnimation = {
			from: 0,
			to: 1,
			length: timeToFrames(0.5),
			progress: 0,
			delay: timeToFrames(1) + ((delay) ? timeToFrames(0.6) : 0)
		};
	}
}

function findTheBest() {
	var bestBoards = [];
	var bestHeuristic = boards[0].heuristic;
	// find the best heuristic value
	boards.forEach(b => {
		if (b.heuristic < bestHeuristic) {
			bestHeuristic = b.heuristic;
		}
	});
	// find all the boards with the same heuristic value
	boards.forEach(b => {
		if (b.heuristic == bestHeuristic) {
			bestBoards.push(b);
		}
	});

	return bestBoards[Math.floor(random(bestBoards.length))];
}

function mutateBoard(parent) {
	var queens = parent.queens.slice();
	var randomColumn = getRandomRow();
	var randomRow = getRandomRow();
	while (queens[randomColumn] == randomRow) {
		randomRow = getRandomRow();
	}
	queens[randomColumn] = randomRow;
	return new ChessBoard(queens);
}

function animateBestBoard() {
	if (fastForward) {
		best1.size = bestBoardSize;
		best1.position = { x: bestBoardPosition.x, y: bestBoardPosition.y };
		best1.highlightOpacity = 0;
	}
	else {
		best1.sizeAnimation = {
			from: best1.size,
			to: bestBoardSize,
			length: timeToFrames(0.5),
			progress: 0,
			delay: 0
		};
		best1.positionAnimation = {
			startX: best1.x,
			endX: bestBoardPosition.x,
			startY: best1.y,
			endY: bestBoardPosition.y,
			length: timeToFrames(0.5),
			progress: 0,
			delay: 0
		};
		best1.highlightAnimation = {
			from: 1,
			to: 0,
			length: timeToFrames(0.3),
			progress: 0,
			delay: 0
		};
	}
}

function animatePreviousBestBoard() {
	if (fastForward) {
		best2.opacity = 0;
	}
	else {
		best2.opacityAnimation = {
			from: 1,
			to: 0,
			length: timeToFrames(0.4),
			progress: 0,
			delay: 0
		};
	}
}