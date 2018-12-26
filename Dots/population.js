class Population {
    constructor(size) {
        this.generation = 1;
        this.bestStep = Infinity;
        this.initializeDots(size);
    }

    initializeDots(size) {
        this.dots = [];
        for (let i = 0; i < size; i++) {
            this.dots[i] = new Dot();
        }
    }

    show() {
        if (showAllDots) {
            for (let i = 1; i < this.dots.length; i++) {
                this.dots[i].show();
            }
        }
        this.dots[0].show();
    }

    update() {
        this.dots.forEach(dot => {
            if (dot.brain.step > this.bestStep) {
                dot.dead = true;
            }
            else {
                dot.update();
            }
        });
    }

    allDotsHaveStopped() {
        for (let i = 0; i < this.dots.length; i++) {
            if (!this.dots[i].dead && !this.dots[i].reachedGoal)
                return false;
        }
        return true;
    }

    calculateDotsFitness() {
        this.dots.forEach(dot => {
            dot.calculateFitness();
        });
    }

    mutateAllDots() {
        for (let i = 1; i < this.dots.length; i++) {
            this.dots[i].brain.mutate(mutationRate);
        }
    }

    createNextGeneration() {
        let newDots = [];

        // transfer the best dot to the next generation
        this.findBestDotIndex();
        newDots[0] = this.dots[this.bestDotIndex].copy();
        newDots[0].isBest = true;

        for (let i = 1; i < this.dots.length; i++) {
            newDots[i] = this.dots[this.bestDotIndex].copy(); // populate new dots with the best dot
        }

        this.dots = newDots;
        this.generation++;
    }

    findBestDotIndex() {
        let bestIndex = 0;
        let fitnessMax = this.dots[0].fitness;
        for (let i = 0; i < this.dots.length; i++) {
            if (this.dots[i].fitness > fitnessMax) {
                fitnessMax = this.dots[i].fitness;
                bestIndex = i;
            }
        }

        // update best step
        if (this.dots[bestIndex].reachedGoal) {
            this.bestStep = this.dots[bestIndex].brain.step;
        }

        this.bestDotIndex = bestIndex;
    }

    loadBrain(brain) {
        for (let i = 0; i < this.dots.length; i++) {
            this.dots[i].brain = brain.copy();
        }
        this.dots[0].isBest = true;
        this.mutateAllDots();
    }
}