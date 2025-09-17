
// generate a number between the min and max representing a single die roll
export function rollDice(min, max) {
    //console.log('rollDice:'+min+':'+max);
    return min + Math.floor(Math.random() * (max - min + 1));
}

// generate an array of num dice rolls
export function rollNumDice(num, min, max) {
    let result = new Array(num);
    for (let i = 0; i < num; i++) {
        result[i] = rollDice(min, max);
    }
    return result;
}

// fudge dice are typically d6 where 1-2 is "-1", 3-4 is "0" and 5-6 is "+1"
export function rollFudgeDice(num) {
    return convertToFudgeDice(rollNumDice(num, 1, 6));
}

// convert numbers to fudge values
function convertToFudgeDice(dieRolls) {
    let result = new Array(dieRolls.length);
    for (let i = 0; i < dieRolls.length; i++) {
        if (dieRolls[i] < 3) {
            result[i] = -1;
        }
        else
            if (dieRolls[i] > 4) {
                result[i] = 1;
            }
            else {
                result[i] = 0;
            }
    }
    return result;
}