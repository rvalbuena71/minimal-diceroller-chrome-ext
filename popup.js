import { Dice, DicePool, DiceResult, diceBag } from './dice.js';

function buildRow(name, dicePool) {
    console.log(name + " : " + JSON.stringify(dicePool));
    return `<tr id="row-${name}">
    <td><input id="count-${dicePool.name}" value="${dicePool.count}" size="2" min="1" type="number" class="countField"></td>`+
    `<td><button id="roll-${dicePool.name}" data-type="${dicePool.name}" class="rollbutton">${dicePool.name}</button></td>`+
    `<td><input id="result-${dicePool.name}" size="4" class="resultField"></td>
    </tr>`;
}

function buildLogWindow() {
    return `<tr>
      <td colspan="2">Dice Pool</td>
      <td><button id="clearAll">Clear</button></td>
    </tr>
    <tr>
      <td colspan="3"><input id="logwindow"></input></td>
    </tr>`;
}

function buildButtonTable() {
    return `<table class="buttonTable">
    <tr>
      <td><button id="clearAll">Clear</button></td>
      <td><button id="resetAll">Reset</button></td>
    </tr>
  </table>`;
}

function buildMainTable() {
    console.log("buildMainTable START");
    let tableHtml = 
    `<table class="mainTable">`+
    `<tr>
      <td>#</td>
      <td>Type</td>
      <td>Result</td>
    </tr>`;

    diceBag.forEach((value,key) => {
        tableHtml += buildRow(key, value);
    });

    tableHtml += buildLogWindow();
    tableHtml += `</table>`;
    //tableHtml += buildButtonTable();
    //console.log(tableHtml);
    document.getElementById('mainDiv').innerHTML = tableHtml;
    console.log("buildMainTable END");
}


function clearAllButtonClickHandler() {
    // clear the result field
    let resultArray = document.getElementsByClassName('resultField');
    for (let i = 0; i < resultArray.length; i++) {
        resultArray[i].value = '';
    }
    document.getElementById('logwindow').value = '';
}

function rollButtonClickHandler(buttonElement) {
    // data-type tag determines what dice type to roll (D6, D10, D20, etc)
    // and matches naming convention of input controls that go with the clicked button
    var diceType = buttonElement.dataset.type;
    // input box gives us the number of dice to roll (defaults to 1)
    var num = Number.parseInt(document.getElementById('count-' + diceType).value);
    var dicePool = diceBag.get(diceType);
    dicePool.count = num;
    var diceResult = dicePool.roll();
   document.getElementById('result-' + diceType).value = (dicePool.isPercentile == true) ? diceResult.percent : diceResult.total;
   // show the individual rolls
   document.getElementById('logwindow').value = diceResult.rolls;
}

function hookClickEvents() {
    //console.log("hookClickEvents");
    let buttonArray = document.getElementsByClassName('rollButton');
    for (let i = 0; i < buttonArray.length; i++) {
        //console.log(buttonArray[i].id);
        buttonArray[i].addEventListener("click", (event) => {
            rollButtonClickHandler(event.target);
        });
    }
    document.getElementById('clearAll').addEventListener("click", (event) => {
            clearAllButtonClickHandler();
    });
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
buildMainTable();
hookClickEvents();
hookCountChangeEvents();
