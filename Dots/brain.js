function Brain(size) {
    this.step = 0;
    this.instructions = [];
    this.randomizeInstructions(size);
}

Brain.prototype.randomizeInstructions = function (size) {
    for (let i = 0; i < size; i++) {
        this.instructions[i] = p5.Vector.fromAngle(random(2 * PI));
    }
}

Brain.prototype.mutate = function (rate) {
    for (let i = 0; i < this.instructions.length; i++) {
        if (random(1) < rate) {
            this.instructions[i] = p5.Vector.fromAngle(random(2 * PI));
        }
    }
}

Brain.prototype.copy = function () {
    let brain = new Brain(this.instructions.length);
    for (let i = 0; i < this.instructions.length; i++) {
        brain.instructions[i] = this.instructions[i];
    }

    return brain;
}

Brain.prototype.deserialize = function (data) {
    if (typeof data == 'string') {
        data = JSON.parse(data);
    }
    let brain = new Brain(data.instructions.length);
    for (let i = 0; i < data.instructions.length; i++) {
        brain.instructions[i].set(data.instructions[i].x, data.instructions[i].y);
    }
    return brain;
}