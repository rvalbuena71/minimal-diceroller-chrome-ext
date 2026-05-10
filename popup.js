import { DieRoller, diceKeys, diceValues, getDiceDataByUniqueID, sortDiceMapByMax, commonDice, extraDice } from './dice.js';
import { loadAllSettings, saveAllSettings, saveOneSetting, parseFromSettings } from './common.js';

// diceList will be populated on page load
var diceList;

function buildRow2(keyId, dice) {
    console.log(keyId + " : " + JSON.stringify(dice));
    return `<tr id="${keyId}">
    <td><input id="count-${keyId}" value="1" size="2" min="1" type="number" class="countField"></td>`+
    `<td><button id="roll-${keyId}" data-type="${dice.name}" class="rollbutton">${dice.name}</button></td>`+
    `<td class="checkCell" ><input type="checkbox" class="checkbox" id="percentile-${keyId}"></td>`+
    `<td><input id="result-${keyId}" size="4" class="resultField"></td>
    </tr>`;
};

function buildLogWindow() {
    return `<tr>
      <td colspan="2">Dice Pool</td>
      <td colspan="2"><button id="clearAll" title="Clear all results fields">Clear All</button></td>
    </tr>
    <tr>
      <td colspan="4"><input id="logwindow"></input></td>
    </tr>`;
};

function buildMainTable(diceData,settings) {
    // safety check
    var targetDiv = document.getElementById('mainDiv');
    if (targetDiv == undefined) return;
    console.log("buildMainTable START");
    console.log(diceData);
    let tableHtml = 
    `<table class="mainTable">`+
    `<tr>
      <td title="Number of dice to roll">#</td>
      <td>Type</td>
      <td class="centeredText" title="Treat results as 'percentile dice'">%</td>
      <td>Result</td>
    </tr>`;
    diceData.forEach((value,key) => {
        let showRow = settings.get(`show-${key}`);
        if (showRow != undefined && showRow == true) {
            tableHtml += buildRow2(key, value);
        }
    });

    tableHtml += buildLogWindow();
    tableHtml += `</table>`;
    //tableHtml += buildButtonTable();
    //console.log(tableHtml);
    targetDiv.innerHTML = tableHtml;
    console.log("buildMainTable END");
};


function clearAllButtonClickHandler() {
    // clear the result field
    let resultArray = document.getElementsByClassName('resultField');
    for (let i = 0; i < resultArray.length; i++) {
        resultArray[i].value = '';
        resultArray[i].dispatchEvent(new Event('input', { bubbles: true }));
    }
    var logwindow = document.getElementById('logwindow');
    if (logwindow != undefined) {
        logwindow.value = '';
        logwindow.dispatchEvent(new Event('input', { bubbles: true }));
    }
};

function rollButtonClickHandler(buttonElement) {
    // use data-type tag to find input controls that go with the clicked button
    var diceType = buttonElement.dataset.type;
    var keyId = buttonElement.closest("tr").id;
    console.log(keyId);
    // input box gives us the number of dice to roll (defaults to 1)
    var num = Number.parseInt(document.getElementById('count-' + keyId).value);
    var dice = diceList.get(keyId);
    var diceResult = DieRoller.rollCount(dice,num);
    var isPercentile = document.getElementById('percentile-' + keyId).checked;
    var resultField = document.getElementById('result-' + keyId);
    resultField.value = (isPercentile == true) ? diceResult.percent : diceResult.total;
    resultField.dispatchEvent(new Event('input', { bubbles: true }));
    var logwindow = document.getElementById('logwindow');
    // show the individual rolls
    logwindow.value = diceResult.rolls;
    logwindow.dispatchEvent(new Event('input', { bubbles: true }));
};

function hookClickEvents() {
    //console.log("hookClickEvents");
    let buttonArray = document.getElementsByClassName('rollButton');
    for (let i = 0; i < buttonArray.length; i++) {
        //console.log(buttonArray[i].id);
        buttonArray[i].addEventListener("click", (event) => {
            rollButtonClickHandler(event.target);
        });
    }
    var clearAll = document.getElementById('clearAll');
    if (clearAll != undefined) {
        clearAll.addEventListener("click", (event) => {
            clearAllButtonClickHandler();
        });
    }
};


function assignCountFieldValues(storedSettings) {
    let countArray = document.getElementsByClassName('countField');
    //console.log(countArray);
    for (let i = 0; i < countArray.length; i++) {
        let fieldVal = storedSettings.get(countArray[i].id);
        //console.log(countArray[i].id);
        //console.log(fieldVal);
        if (fieldVal != undefined) {
            countArray[i].value = fieldVal;
        } 
    }
};

function assignResultFieldValues(storedSettings) {
    let isSaveResults = storedSettings.get('save-results');
    console.log(storedSettings.get("save-results"));
    if (isSaveResults == undefined || isSaveResults == false) return;
    let resultArray = document.getElementsByClassName('resultField');
    //console.log(countArray);
    for (let i = 0; i < resultArray.length; i++) {
        let fieldVal = storedSettings.get(resultArray[i].id);
        //console.log(resultArray[i].id);
        //console.log(fieldVal);
        if (fieldVal != undefined) {
            resultArray[i].value = fieldVal;
        } 
    }
    let logwindowVal = storedSettings.get("logwindow");
    if (logwindowVal != undefined) {
        let logwindow = document.getElementById('logwindow');
        if (logwindow != undefined) {
            logwindow.value = logwindowVal;
        }
    }
};

function hookChangeEvents(storedSettings) {
    console.log("hookChangeEvents");
    let countArray = document.getElementsByClassName('countField');
    for (let i = 0; i < countArray.length; i++) {
        countArray[i].addEventListener("change", (event) => {
            // save when countField value is changed
            saveOneSetting(event.target.id, event.target.value);
        });
    }
    let checkboxArray = document.getElementsByClassName('checkbox');
    for (let i = 0; i < checkboxArray.length; i++) {
        checkboxArray[i].addEventListener("change", (event) => {
            // save when checkbox is changed
            saveOneSetting(event.target.id, event.target.checked);
        });
    }
    let isSaveResults = storedSettings.get("save-results");
    if (isSaveResults != undefined && isSaveResults == true) {
        let resultArray = document.getElementsByClassName('resultField');
        for (let i = 0; i < resultArray.length; i++) {
            resultArray[i].addEventListener("input", (event) => {
                // save when resultArray value is changed
                saveOneSetting(event.target.id, event.target.value);
            });
        }
        let logwindow = document.getElementById('logwindow');
        if (logwindow != undefined) {
            logwindow.addEventListener("input", (event) => {
                // save when logwindow value is changed
                saveOneSetting(event.target.id, event.target.value);
            });
        }
    }
};

function assignCheckboxValues(storedSettings) {
    let checkboxArray = document.getElementsByClassName('checkbox');
    for (let i = 0; i < checkboxArray.length; i++) {
        let fieldVal = storedSettings.get(checkboxArray[i].id); 
        //console.log(checkboxArray[i].id);
        //console.log(fieldVal);
        if (fieldVal != undefined) {
            checkboxArray[i].checked = fieldVal;
        }
    }
};

function assignValues(storedSettings) {
    console.log("assignValues");
    assignCountFieldValues(storedSettings);
    assignCheckboxValues(storedSettings);
    assignResultFieldValues(storedSettings);
    return storedSettings;
};

function buildPopupUI(settings){
    return new Promise((resolve) => {
        // sort the dice list by "max" value
        diceList = sortDiceMapByMax(getDiceDataByUniqueID());
        console.log(diceList);
        addDefaultKeys(diceList,settings);
        buildMainTable(diceList,settings);
        assignValues(settings);
        hookClickEvents(settings);
        hookChangeEvents(settings);
        resolve(settings);
    });
};

// check for new settings and add them if necessary
export function addDefaultKeys(diceList, settings){
    console.log("addDefaultKeys");
    diceList.forEach((dice) => {
        let checkKey = dice.id;
        // is there a copy of this dice data in storage?
        let savedDice = settings.get(checkKey);
        if (savedDice == undefined) {
            // 
            saveOneSetting(checkKey,dice);
            settings.set(checkKey,dice);
        }
        else {
            console.log("addDefaultKeys - overrding defaults :"+checkKey +": "+JSON.stringify(savedDice));
            // copy any user-edited settings onto the dice
            dice.name = savedDice.name;
            dice.min = Number.parseInt(savedDice.min);
            dice.max = Number.parseInt(savedDice.max);
        }
    });
    if (!settings.has("save-results")) {
        saveOneSetting("save-results",true);
        settings.set("save-results",true);
    }
    let counter = 0;
    diceKeys.forEach((key) => {
        // should this dice be shown?
        let checkKey = `show-${key}`;
        if (!settings.has(checkKey)) {
            if (counter > 8) return;
            saveOneSetting(checkKey,true);
            settings.set(checkKey,true);
        }
        counter++;
    });
};

loadAllSettings()
    .then(function(result){ 
        console.log(result);
        return buildPopupUI(result)
    })
    .catch(error => console.log(error));
