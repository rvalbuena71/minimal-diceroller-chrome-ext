import { rollDice, rollFudgeDice, rollNumDice } from './dice.js';

function buttonClickHandler(buttonElement) {
    // data-type tag determines what dice type to roll (D6, D10, D20, etc)
    // and matches naming convention of input controls that go with the clicked button
    var diceType = buttonElement.dataset.type;
    // input box gives us the number of dice to roll (defaults to 1)
    var num = Number.parseInt(document.getElementById('count-' + diceType).value);
    // parse out data-min and data-max 
    var min = Number.parseInt(buttonElement.dataset.min);
    var max = Number.parseInt(buttonElement.dataset.max);
    // get the individual rolls
    let diceArray = (diceType == 'DF') ? rollFudgeDice(num) : rollNumDice(num, min, max);
    // show the summed result    
    document.getElementById('result-' + diceType).value = diceArray.reduce(
        (accumulator, currentValue) => accumulator + currentValue
    );
    // show the individual rolls
    document.getElementById('logwindow').value = diceArray;
}

function hookClickEvents() {
    //console.log("hookClickEvents");
    let buttonArray = document.getElementsByTagName('button');
    //    let buttonArray = document.getElementsByName('button');
    for (let i = 0; i < buttonArray.length; i++) {
        //console.log(buttonArray[i].id);
        buttonArray[i].addEventListener("click", (event) => {
            buttonClickHandler(event.target);
        });
    }
};

function hookCountChangeEvents() {
    //console.log("hookCountChangeEvents");
    let countArray = document.getElementsByClassName('countField');
    for (let i = 0; i < countArray.length; i++) {
        countArray[i].addEventListener("change", (event) => {
            // save when countField value is changed
            // square brackets around keyname to use variable value
            chrome.storage.sync.set({ [event.target.id] : event.target.value }).then(() => {
                console.log("changed::"+event.target.id+":"+event.target.value);
            }).catch(error => console.log(error));
        });
    }
}

async function loadStoredValues() {
    //console.log("loadStoredValues");
    let countArray = document.getElementsByClassName('countField');
    // get all the stored values in one go
    chrome.storage.sync.get().then((items) => {
        //console.log(items);
        // assign valid stored values to the corresponding field
        for (const [key, value] of Object.entries(items)) {
            console.log("loaded::"+key+":" + value);
            if (value != undefined && value > 0) {
                countArray[key].value = value;
            }
        }
    }).catch(error => console.log(error));    
}

loadStoredValues();
hookClickEvents();
hookCountChangeEvents();
