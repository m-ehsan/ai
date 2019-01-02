function displayUI() {
    noStroke();
    textSize(30);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    fill(color(20, 114, 55));
    text("Generation: " + population.generation, 120, 150);
    textSize(22);
    text("steps: " + ((population.bestStep == Infinity) ? '-' : population.bestStep), 120, 210);
    textStyle(NORMAL);
    textSize(12);
    text("[R] Reset", 10, height - 120);
    text("[P] Pause", 10, height - 105);
    text("[L] Load trained AI", 10, height - 90);
    text("[S] Show all dots: " + ((showAllDots) ? "true" : "false"), 10, height - 75);
    text("[+/-] Cycles per frame: " + cyclesPerFrame, 10, height - 60);
    text("[F] Fast-forward generations: " + ((fastForward) ? "On" : "Off"), 10, height - 45);
    text("[Up/Down] Mutation rate: " + nf(mutationRate, 0, 3), 10, height - 30);
    text("[Left/Right] Population: " + populationSize, 10, height - 15);
}

function displayFPS() {
    fill(color(30, 180, 40));
    strokeWeight(0.5);
    stroke(0);
    textSize(14);
    textAlign(LEFT, TOP);
    var fps = Math.round(frameRate());
    text(fps + " fps", 0, 0);
}

function handleMutationRateChange() {
    if (keyIsDown(UP_ARROW)) {
        if (keyIsDown(CONTROL) || keyIsDown(SHIFT)) {
            mutationRate += 0.01;
        }
        else {
            if (frameCount % 4 == 0)
                mutationRate += 0.001;
        }
        if (mutationRate > 1)
            mutationRate = 1;
    }
    if (keyIsDown(DOWN_ARROW)) {
        if (keyIsDown(CONTROL) || keyIsDown(SHIFT)) {
            mutationRate -= 0.01;
        }
        else {
            if (frameCount % 4 == 0)
                mutationRate -= 0.001;
        }
        if (mutationRate < 0.001)
            mutationRate = 0.001;
    }
}

function handleCyclePerFrameChange() {
    if (keyIsDown(187)) { // = key
        if (keyIsDown(CONTROL) || keyIsDown(SHIFT)) {
            cyclesPerFrame += 5;
        }
        else {
            if (frameCount % 4 == 0)
                cyclesPerFrame += 1;
        }
        if (cyclesPerFrame > 100)
            cyclesPerFrame = 100;
    }
    if (keyIsDown(189)) { // - key
        if (keyIsDown(CONTROL) || keyIsDown(SHIFT)) {
            cyclesPerFrame -= 5;
        }
        else {
            if (frameCount % 4 == 0)
                cyclesPerFrame -= 1;
        }
        if (cyclesPerFrame < 1)
            cyclesPerFrame = 1;
    }
}