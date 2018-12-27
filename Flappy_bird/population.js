class Population {
    constructor(size) {
        this.generation = 1;
        this.highscore = 0;
        this.score = 0;
        this.initializeBirds(size);
    }

    initializeBirds(size) {
        this.birds = [];
        for (let i = 0; i < size; i++) {
            this.birds[i] = new Bird();
        }
    }

    show(showDeads = false) {
        if (showAllBirds) {
            for (let i = 1; i < this.birds.length; i++) {
                if (!showDeads) {
                    if (!this.birds[i].dead)
                        this.birds[i].show();
                }
                else {
                    this.birds[i].show();
                }
            }
        }
        if (!showDeads) {
            if (!this.birds[0].dead)
                this.birds[0].show();
        }
        else {
            this.birds[0].show();
        }
    }

    update() {
        this.birds.forEach(bird => {
            bird.update();
        });
        this.score++;
    }

    think() {
        this.birds.forEach(bird => {
            bird.think();
        });
    }

    allBirdsDead() {
        for (let i = 0; i < this.birds.length; i++) {
            if (!this.birds[i].dead)
                return false;
        }
        return true;
    }

    mutateAllBirds() {
        for (let i = 1; i < this.birds.length; i++) {
            this.birds[i].mutate();
        }
    }

    nextGeneration() {
        let newBirds = [];
        
        this.calculateFitness();

        // transfer the best bird to the next generation
        this.findBestBirdIndex();
        newBirds[0] = this.birds[this.bestBirdIndex].copy();
        newBirds[0].isBest = true;

        // populate new birds using natural selection
        for (let i = 1; i < this.birds.length; i++) {
            newBirds[i] = this.birds[this.bestBirdIndex].copy();
            // newBirds[i] = this.naturalSelect();
        }

        this.birds = newBirds;
        this.mutateAllBirds();
        this.generation++;
        this.score = 0;
    }

    // calculate and normalize fitnesses
    calculateFitness() {
        this.birds.forEach(bird => {
            bird.fitness = pow(bird.score, 2);
        });

        let sum = 0
        this.birds.forEach(bird => {
            sum += bird.fitness;

        });

        this.birds.forEach(bird => {
            bird.fitness = bird.fitness / sum;
        });
    }

    findBestBirdIndex() {
        let bestIndex = 0;
        let bestScore = this.birds[0].score;
        for (let i = 0; i < this.birds.length; i++) {
            if (this.birds[i].score > bestScore) {
                bestScore = this.birds[i].score;
                bestIndex = i;
            }
        }

        // update best score
        if (bestScore > this.highscore)
            this.highscore = bestScore;

        // update best bird index
        this.bestBirdIndex = bestIndex;
    }

    naturalSelect() {
        let index = 0;
        let r = random(1);
        while (r > 0) {
            r -= this.birds[index++].fitness;
        }
        index--;
        return this.birds[index].copy();
    }

    setLearningRate(rate) {
        this.birds.forEach(bird => {
            bird.setLearningRate(rate);
        });
    }

    loadBrain(brain) {
        for (let i = 0; i < this.birds.length; i++) {
            this.birds[i] = new Bird(brain.copy());
        }
        this.birds[0].isBest = true;
        this.mutateAllBirds();
    }
}