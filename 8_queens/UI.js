function displayUI() {
    let lineNumber = 0;
    let lineHeight = 15;

    fill(20);
    noStroke();
    textSize(10);
    textAlign(LEFT, TOP);
    text("[-/+] Population: " + populationCount, 3, lineNumber++ * lineHeight + 3);
    text("[Up/Down] Animation speed: " + animationSpeed, 3, lineNumber++ * lineHeight + 3);
    text("[Right/Left] Resize panel", 3, lineNumber++ * lineHeight + 3);
    text("[M] GA method: " + ((gaMode == 0) ? "mutation" : "crossover + mutation"), 3, lineNumber++ * lineHeight + 3);
    text("[Enter] Next step", 3, lineNumber++ * lineHeight + 3);
    text("[F] Fast forward: " + ((fastForward == 0) ? "Off" : "On"), 3, lineNumber++ * lineHeight + 3);
    text("[R] Reset", 3, lineNumber++ * lineHeight + 3);

    textSize(30);
    textStyle(BOLD);
    text("Step: " + step, 3, lineNumber++ * lineHeight + 2 + 3);
    textStyle(NORMAL);
}

function displayFPS() {
    fill(color(30, 180, 40));
    strokeWeight(0.5);
    stroke(0);
    textSize(12);
    textAlign(LEFT, TOP);
    let fps = Math.round(frameRate());
    text(fps + " fps", 0, 0);
}

function handlePanelWidthChange() {
    if (keyIsDown(RIGHT_ARROW)) {
        if (keyIsDown(CONTROL) || keyIsDown(SHIFT)) {
            leftColumnWidth += 5;
        }
        else {
            leftColumnWidth += 2;
        }
        if (leftColumnWidth > width / 2)
            leftColumnWidth = width / 2;
        updateBoards();
    }
    if (keyIsDown(LEFT_ARROW)) {
        if (keyIsDown(CONTROL) || keyIsDown(SHIFT)) {
            leftColumnWidth -= 5;
        }
        else {
            leftColumnWidth -= 2;
        }
        if (leftColumnWidth < 10)
            leftColumnWidth = 10;
        updateBoards();
    }
}

function handleSpeedChange() {
    if (keyIsDown(UP_ARROW)) {
        if (keyIsDown(CONTROL) || keyIsDown(SHIFT)) {
            animationSpeed += 15;
        }
        else {
            animationSpeed += 5;
        }
        if (animationSpeed > 1000)
            animationSpeed = 1000;
    }
    if (keyIsDown(DOWN_ARROW)) {
        if (keyIsDown(CONTROL) || keyIsDown(SHIFT)) {
            animationSpeed -= 15;
        }
        else {
            animationSpeed -= 5;
        }
        if (animationSpeed < 50)
            animationSpeed = 50;
    }
}

function handlePopulationChange() {
    if (keyIsDown(189)) {
        if (keyIsDown(CONTROL) || keyIsDown(SHIFT)) {
            populationCount -= 5;
        }
        else {
            if (frameCount % 4 == 0)
                populationCount--;
        }
        if (populationCount < 2)
            populationCount = 2;
    }
    if (keyIsDown(187)) {
        if (keyIsDown(CONTROL) || keyIsDown(SHIFT)) {
            populationCount += 5;
        }
        else {
            if (frameCount % 4 == 0)
                populationCount++;
        }
        if (populationCount > 500)
            populationCount = 500;
    }
}

function calculatePosition(index) {
    let x = leftColumnWidth + (index % columns) * blockWidth + blockPadding;
    let y = topMargin + Math.floor(index / columns) * blockWidth * blocksHeightWidthRatio + blockPadding;
    return { x: x, y: y };
}

function calculateSmallBoardSize(total) {
    let areaRatio = height / (width - leftColumnWidth);

    // calculate optimal number of columns
    for (let i = 1; i <= total; i++) {
        rows = (Math.floor(total / i) + ((Math.floor(total % i) ? 1 : 0)));
        let ratio = (rows * blocksHeightWidthRatio) / i;
        columns = i;
        if (ratio <= areaRatio) {
            break;
        }
    }

    if (columns > 1)
        blockWidth = (width - leftColumnWidth) / columns;
    else
        blockWidth = (width - leftColumnWidth) / 2;
    smallBoardSize = (1 - 2 * blockPaddingRatio) * blockWidth;
    blockPadding = (blockWidth - smallBoardSize) / 2;
    topMargin = (height - (rows * blockWidth * blocksHeightWidthRatio)) / 2;
}

function calculateBestBoardSize() {
    bestBoardSize = height / 1.8;
    if (bestBoardSize > leftColumnWidth * 0.9) {
        bestBoardSize = leftColumnWidth * 0.9;
    }
}

function calculateBoardsPositions() {
    let x = (leftColumnWidth - bestBoardSize) / 2;
    let y = height / 2 - bestBoardSize / 2;
    bestBoardPosition = { x: x, y: y };
    let y1 = height / 2 - bestBoardSize * 1.15;
    let y2 = height / 2 + bestBoardSize * 0.15;
    parent1Position = { x: x, y: y1 };
    parent2Position = { x: x, y: y2 };
}