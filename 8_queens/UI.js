function displayInfo() {
    var lineNumber = 0;
    var lineHeight = 15;

    fill(20);
    noStroke();
    textSize(10);
    textAlign(LEFT, TOP);

    text("[-/+] Population: " + populationCount, 3, lineNumber++ * lineHeight + 3);
    text("[up/down] Animation speed: " + animationSpeed, 3, lineNumber++ * lineHeight + 3);
    text("[M] Mode: " + ((mode == 0) ? "Mutation" : "CrossOver"), 3, lineNumber++ * lineHeight + 3);
    text("[Enter] Next step", 3, lineNumber++ * lineHeight + 3);
    text("[F] Fast forward: " + ((fastForward == 0) ? "Off" : "On"), 3, lineNumber++ * lineHeight + 3);
    text("[R] Reset", 3, lineNumber++ * lineHeight + 3);

    if (mode != 0) {
        var cmode = "";
        switch (crossoverMode) {
            case 0:
                cmode = "2-best";
                break;
            case 1:
                cmode = "2-worst";
                break;
            case 2:
                cmode = "best & worst";
                break;
            case 3:
                cmode = "random";
                break;
            default:
                break;
        }
        text("[C] CrossOver Mode: " + cmode, 3, lineNumber++ * lineHeight + 3);
    }

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
    var fps = Math.round(frameRate());
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
        if (populationCount < 1)
            populationCount = 1;
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
    var x = leftColumnWidth + (index % columns) * blockWidth + blockPadding;
    var y = topMargin + Math.floor(index / columns) * blockWidth * blocksHeightWidthRatio + blockPadding;
    return { x: x, y: y };
}

function calculateSmallBoardSize(total) {
    var areaRatio = height / (width - leftColumnWidth);

    // calculate optimal number of columns
    for (var i = 1; i <= total; i++) {
        rows = (Math.floor(total / i) + ((Math.floor(total % i) ? 1 : 0)));
        var ratio = (rows * blocksHeightWidthRatio) / i;
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
    if(mode == 0){
        bestBoardSize = height / 1.7;
    }
    else {
        bestBoardSize = height / 3;
    }
    if (bestBoardSize > leftColumnWidth * 0.9) {
        bestBoardSize = leftColumnWidth * 0.9;
    }
}

function calculateBoardsPositions() {
    var x = (leftColumnWidth - bestBoardSize) / 2;
    var y = height / 2 - bestBoardSize / 2;
    bestBoardPosition = { x: x, y: y };
    var y1 = height / 2 - bestBoardSize * 1.15;
    var y2 = height / 2 + bestBoardSize * 0.15;
    parent1Position = { x: x, y: y1 };
    parent2Position = { x: x, y: y2 };
}