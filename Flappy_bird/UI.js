function displayUI() {
    noStroke();
    textAlign(CENTER, TOP);
    textSize(26);
    textStyle(BOLD);
    fill(10);
    if (mode == 0) {
        text("score: " + population.score, width / 2, 10);
        textAlign(LEFT, TOP);
        textStyle(NORMAL);
        textSize(12);
        text("[M] Mode: " + ((mode == 0) ? "free play" : "train AI"), 5, height - 15);
    }
    else {
        text("Generation: " + population.generation, width / 2, 10);
        textSize(20);
        text("highscore: " + population.highscore, width / 2, 40);
        text("score: " + population.score, width / 2, 65);
        textAlign(LEFT, TOP);
        textStyle(NORMAL);
        textSize(12);
        text("[R] Reset", 5, height - 120);
        text("[P] Pause", 5, height - 105);
        text("[L] Load trained AI", 5, height - 90);
        text("[S] Show all birds: " + ((showAllBirds) ? "true" : "false"), 5, height - 75);
        text("[M] Mode: " + ((mode == 0) ? "free play" : "train AI"), 5, height - 60);
        text("[+/-] Cycles per frame: " + cyclesPerFrame, 5, height - 45);
        text("[up/down] Mutation rate: " + nf(mutationRate, 0, 3), 5, height - 30);
        text("[Left/Right] Population: " + populationSize, 5, height - 15);
    }
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

        population.setLearningRate(mutationRate);
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

        population.setLearningRate(mutationRate);
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