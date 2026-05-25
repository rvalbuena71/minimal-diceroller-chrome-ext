import { DieRoller, diceKeys, diceValues, getDiceDataByUniqueID, sortDiceMapByMax, commonDice, extraDice } from './dice.js';
import { loadAllSettings, saveAllSettings, saveOneSetting, parseFromSettings, removeOneSetting } from './common.js';

// diceList will be populated on page load
var diceList;
var sortedList;

function buildRow2(keyId, dice, targetTable) {
    //console.log(keyId + " : " + JSON.stringify(dice));
    let newRow = targetTable.insertRow(-1);

    let c0 = newRow.insertCell(0);
    let count1 = document.createElement("input");
    count1.setAttribute("id","count-"+keyId);
    count1.setAttribute("size",2);
    count1.setAttribute("min",1);
    count1.setAttribute("type","number");
    count1.setAttribute("class","countField");
    count1.value = 1;
    c0.appendChild(count1);

    let c1 = newRow.insertCell(1);
    let button1 = document.createElement("button");
    button1.setAttribute("id","roll-"+keyId)
    button1.setAttribute("data-id",keyId)
    button1.setAttribute("class","rollbutton");
    button1.innerText = dice.name;
    c1.appendChild(button1);

    let c2 = newRow.insertCell(2);
    let checkbox1 = document.createElement("input");
    checkbox1.setAttribute("id","percentile-"+keyId);
    checkbox1.setAttribute("type","checkbox");
    checkbox1.setAttribute("class","checkbox");
    c2.appendChild(checkbox1);
    if (dice.name == "DF") {
        checkbox1.setAttribute("disabled","true");        
    }

    let c3 = newRow.insertCell(3);
    let result1 = document.createElement("input");
    result1.setAttribute("id","result-"+keyId);
    result1.setAttribute("size",4);
    result1.setAttribute("class","resultField");
    c3.appendChild(result1);
};

function buildLogWindow(targetTable) {
    let logWindowRow1 = targetTable.insertRow(-1);
    let c0 = logWindowRow1.insertCell(0);
    c0.colSpan = 2;
    c0.innerText = "Dice Pool";

    let c1 = logWindowRow1.insertCell(1);
    c1.colSpan = 2;
    let clearAll = document.createElement("button");
    c1.appendChild(clearAll);
    clearAll.title = "Clear all results fields";
    clearAll.innerText = "Clear All";

    let logWindowRow2 = targetTable.insertRow(-1);
    let c2 = logWindowRow2.insertCell(0);
    c2.colSpan = 4;
    let logwindow = document.createElement("input");
    c2.appendChild(logwindow);
    logwindow.id = "logwindow";
};

function buildMainTable(diceData,settings) {
    // safety check
    var targetDiv = document.getElementById('mainDiv');
    if (targetDiv == undefined) return;
    console.log("buildMainTable START");
    //console.log(diceData);
    let tableHtml = document.createElement("table");
    tableHtml.class = "mainTable";

    let headerRow = tableHtml.insertRow(0);
    let c0 = headerRow.insertCell(0);
    c0.title = "Number of dice to roll";
    c0.innerText = "#";
    let c1 = headerRow.insertCell(1);
    c1.innerText = "Type";
    let c2 = headerRow.insertCell(2);
    c2.title = "Treat as 'percentile'";
    c2.innerText = "%";
    c2.setAttribute("class","checkCell");
    let c3 = headerRow.insertCell(3);
    c3.innerText = "Result";

    diceData.forEach((value,key) => {
        let showRow = settings.get(`show-${key}`);
        if (showRow != undefined && showRow == true) {
            buildRow2(key, value, tableHtml);
        }
    });

    buildLogWindow(tableHtml);
    //console.log(tableHtml);
    targetDiv.appendChild(tableHtml);
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
    // keyid will tell us dice type to use
    var keyId = buttonElement.dataset.id;
    //console.log(keyId);
    // countfield gives us the number of dice to roll (defaults to 1)
    var num = Number.parseInt(document.getElementById('count-' + keyId).value);
    // retrieve dicetype
    var dice = diceList.get(keyId);
    // do the rolls
    var diceResult = DieRoller.rollCount(dice,num);
    // should we treat this as percentile instead of sum
    var isPercentile = document.getElementById('percentile-' + keyId).checked;
    var resultField = document.getElementById('result-' + keyId);
    resultField.value = (isPercentile == true) ? diceResult.percent : diceResult.total;
    // fire the resultfield event
    resultField.dispatchEvent(new Event('input', { bubbles: true }));
    var logwindow = document.getElementById('logwindow');
    // show the individual rolls
    logwindow.value = diceResult.rolls;
    // fire the logwindow event
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
    //console.log(storedSettings.get("save-results"));
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
        // retrieve original dice data
        diceList = getDiceDataByUniqueID();
        //console.log(diceList);
        // merge in any user changed settings
        addDefaultKeys(diceList,settings);
        // sort the dice list by "max" value 
        // *after* getting user changed settings
        sortedList = sortDiceMapByMax(diceList);
        buildMainTable(sortedList,settings);
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
        let checkName = dice.name;
        // is there a copy of this dice data in storage?
        let savedDice = settings.get(checkKey);
        if (savedDice == undefined) {
            // 
            saveOneSetting(checkKey,dice);
            settings.set(checkKey,dice);
        }
        else {
            //console.log("addDefaultKeys - overrding defaults :"+checkKey +": "+JSON.stringify(savedDice));
            // copy any user-edited settings onto the dice
            dice.name = savedDice.name;
            dice.min = Number.parseInt(savedDice.min);
            dice.max = Number.parseInt(savedDice.max);
        }
        // is there an old saved count for this dice data?
        let savedNum = settings.get("count-"+checkName);
        if (savedNum != undefined) {
            saveOneSetting("count-"+checkKey,savedNum);
            settings.set("count-"+checkKey,Number.parseInt(savedNum));
            removeOneSetting("count-"+checkName);
        } 
        else {
            // special case for DF
            if (checkName == "DF") {
                saveOneSetting("count-"+checkKey,4);
                settings.set("count-"+checkKey,Number.parseInt(4));
            }
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
            // hide the extra dice by default
            if (counter >= commonDice.length) return;
            saveOneSetting(checkKey,true);
            settings.set(checkKey,true);
        }
        counter++;
    });
};

loadAllSettings()
    .then(function(result){ 
        //console.log(result);
        return buildPopupUI(result)
    })
    .catch(error => console.log(error));
