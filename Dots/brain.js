class Brain {
    constructor(size) {
        this.step = 0;
        this.instructions = [];
        this.randomizeInstructions(size);
    }

    randomizeInstructions(size) {
        for (let i = 0; i < size; i++) {
            this.instructions[i] = p5.Vector.fromAngle(random(2 * PI));
        }
    }

    mutate(rate) {
        for (let i = 0; i < this.instructions.length; i++) {
            if (random(1) < rate) {
                this.instructions[i] = p5.Vector.fromAngle(random(2 * PI));
            }
        }
    }

    copy() {
        let brain = new Brain(this.instructions.length);
        for (let i = 0; i < this.instructions.length; i++) {
            brain.instructions[i] = this.instructions[i];
        }

        return brain;
    }

    static deserialize(data) {
        if (typeof data == 'string') {
            data = JSON.parse(data);
        }
        let brain = new Brain(data.instructions.length);
        for (let i = 0; i < data.instructions.length; i++) {
            brain.instructions[i].set(data.instructions[i].x, data.instructions[i].y);
        }
        return brain;
    }
}