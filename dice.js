

export class Dice {

    constructor(name, min, max) {
        this.name = name;
        this.min = min;
        this.max = max;
    }

    roll() {
        return this.min + Math.floor(Math.random() * (this.max - this.min + 1));
    }

}

export class DiceResult {

    constructor(list) {
        this.rolls = list;
        this.total = this.#sum(list);
        this.percent = this.#percentile(list);
    }

    #sum(list) {
		return list.reduce(
			(accumulator, currentValue) => accumulator + currentValue
		);
	}

    #percentile(list) {
       return list.reduce(
			(accumulator, currentValue) => (accumulator * 10) + currentValue
		);
    }

}

export class DicePool {

    constructor(name, dice, count, isPercentile) {
        this.name = name;
        this.dice = dice;
        this.count = count;
        this.isPercentile = isPercentile;
    }

    roll() {
        let result = new Array(this.count);
        for (let i = 0; i < this.count; i++) {
            result[i] = this.dice.roll();
        }
        return new DiceResult(result);
    }

}

export const diceBag = new Map();
let d4 = new DicePool("D4", new Dice("D4", 1, 4,), 1, false);
diceBag.set("D4", d4);
let d6 = new DicePool("D6", new Dice("D6", 1, 6), 1, false);
diceBag.set("D6", d6);
let d8 = new DicePool("D8", new Dice("D8", 1, 8), 1, false);
diceBag.set("D8", d8);
let d10 = new DicePool("D10", new Dice("D10", 1, 10), 1, false);
diceBag.set("D10", d10);
let d12 = new DicePool("D12", new Dice("D12", 1, 12), 1, false)
diceBag.set("D12", d12);
let d20 = new DicePool("D20", new Dice("D20", 1, 20), 1, false);
diceBag.set("D20", d20);
let d100 = new DicePool("D100", new Dice("D100", 1, 100), 1, false);
diceBag.set("D100", d100);
let dF = new DicePool("DF", new Dice("DF", -1, 1), 4, false);
diceBag.set("DF", dF);