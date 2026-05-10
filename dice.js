
export class DieRoller {

    static roll(dice) {
        return dice.min + Math.floor(Math.random() * (dice.max - dice.min + 1));
    }

    static rollCount(dice, count) {
        let result = new Array(count);
        for (let i = 0; i < count; i++) {
            result[i] = DieRoller.roll(dice);
        }
        return new DiceResult(result);
    }

    static countSides(dice) {
        return (dice.max - dice.min) +1;
    }

    static isValid(dice) {
        return (
            (dice.min <= dice.max) &&
            (dice.name != undefined && dice.name != '') 
        );
    }

}

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
        /*
       return list.reduce(
			(accumulator, currentValue) => 
                (accumulator * (10 ** DiceResult.countDigits(currentValue))) + 
                    currentValue)
                    */
        return Number.parseInt(
            list.reduce(
            (accumulator, currentValue) => accumulator + currentValue.toString()
            )
        );
    }

    static countDigits(num) {
        return Math.floor(Math.log10(num) + 1);
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

export const diceKeys = [
    "dice01",
    "dice02",
    "dice03",
    "dice04",
    "dice05",
    "dice06",
    "dice07",
    "dice08",
    "dice09",
    "dice10",
    "dice11",
    "dice12",
    "dice13",
    "dice14",
    "dice15",
    "dice16",
    "dice17",
    "dice18"
];

export const commonDice = [
    "D4", "D6", "D8", "D10", "D12", "D20", "D100", "DF"
];
export const extraDice = [
    "D2", "D3", "D5", "D7", "D14", "D16", "D24", "D30", "D60", "D120"
];

export const diceValues = [
    {"id":"dice01", "name":"D4",  "min":1, "max":4},
    {"id":"dice02", "name":"D6",  "min":1, "max":6},
    {"id":"dice03", "name":"D8",  "min":1, "max":8},
    {"id":"dice04", "name":"D10", "min":1, "max":10},
    {"id":"dice05", "name":"D12", "min":1, "max":12},
    {"id":"dice06", "name":"D20", "min":1, "max":20},
    {"id":"dice07", "name":"D100","min":1, "max":100},
    {"id":"dice08", "name":"DF",  "min":-1,"max":1},
    {"id":"dice09", "name":"D2",  "min":1, "max":2},
    {"id":"dice10", "name":"D3",  "min":1, "max":3},
    {"id":"dice11", "name":"D5",  "min":1, "max":5},
    {"id":"dice12", "name":"D7",  "min":1, "max":7},
    {"id":"dice13", "name":"D14", "min":1, "max":14},
    {"id":"dice14", "name":"D16", "min":1, "max":16},
    {"id":"dice15", "name":"D24", "min":1, "max":24},
    {"id":"dice16", "name":"D30", "min":1, "max":30},
    {"id":"dice17", "name":"D60", "min":1, "max":60},
    {"id":"dice18", "name":"D120","min":1, "max":120}
];

export function findDefaultDice(keyId) {
    var result;
    // get original value from const
    diceValues.forEach((value) => {
        if (value.id == keyId) {
            result = value;
        }
    });
    return result;
}

export function getDefaultDiceData(){
    var diceMap = new Map();
    var i = 0;
    diceKeys.forEach((key) => {
        diceMap.set(key,val);
        i++
    });
    return diceMap;
}


export function getDiceDataByUniqueID(){
    var diceMap = new Map();
    var i = 0;
    diceKeys.forEach((key) => {
        var val = JSON.parse(JSON.stringify(diceValues[i]));
        diceMap.set(key,val);
        i++
    });
    return diceMap;
}

export function sortDiceMapByMax(diceMap) {
    return new Map([...diceMap.entries()].sort((a,b) =>{
            return a[1].max - b[1].max;
        }))
}

