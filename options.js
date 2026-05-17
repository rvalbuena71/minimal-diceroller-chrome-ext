import { DieRoller, Dice, DicePool, DiceResult, diceKeys, diceValues, getDiceDataByUniqueID, commonDice, extraDice, findDefaultDice } from './dice.js';
import { loadAllSettings, saveAllSettings, saveOneSetting, parseFromSettings } from './common.js';
import { addDefaultKeys } from './popup.js';

var diceList;

function buildTableStart() {
    return `<table class="mainTable">`+
    `<tr>
      <td>Show</td>
      <td>Type</td>
      <td >Min</td>
      <td >Max</td>
      <td></td>
    </tr>`;
};

function buildTableEnd() {
    return `</table>`;
};

function buildCommonDiceTable(diceDataList){
    let tableHtml = buildTableStart();
    let counter = 0;
    diceDataList.forEach((value,key) => {
        if (counter < commonDice.length) {
            tableHtml += buildRow2(key, value, 'commonDice');
        }
        counter++;
    });
    tableHtml += buildTableEnd();
    document.getElementById('commonDice').innerHTML = tableHtml;
};

function buildExtraDiceTable(diceDataList){
    let tableHtml = buildTableStart();
    let counter = 0;
    diceDataList.forEach((value,key) => {
        if (counter >= commonDice.length) {
            tableHtml += buildRow2(key, value, 'extraDice');
        }
        counter++;
    });
    tableHtml += buildTableEnd();
    document.getElementById('extraDice').innerHTML = tableHtml;
};

function buildRow2(keyId, dice, extraClass) {
    console.log(keyId + " : " + JSON.stringify(dice));
    // handle special case
    if (dice.name == "DF") {
        return `<tr id="${keyId}">
    <td class="checkCell" ><input type="checkbox" class="checkbox cBox ${extraClass}" id="show-${keyId}"></td>
    <td><div id="type-${keyId}" data-type="${keyId}" >${dice.name}</div></td>
    <td><div id="min-${keyId}" >${dice.min}</div></td>
    <td><div id="max-${keyId}" >${dice.max}</div></td>
    <td></td>
    </tr>`;
    }
    return `<tr id="${keyId}">
    <td class="checkCell" ><input type="checkbox" class="checkbox cBox ${extraClass}" id="show-${keyId}"></td>
    <td><div id="type-${keyId}" data-type="${keyId}" >${dice.name}</div></td>
    <td><input id="min-${keyId}" value="${dice.min}" size="4" type="number" class="countField minField"></td>
    <td><input id="max-${keyId}" value="${dice.max}" size="4" min="1" type="number" class="countField maxField"></td>
    <td><button id="reset-${keyId}" class="resetbutton">Reset</button></td>
    </tr>`;
};

function buildOptionsUI(settings){
    return new Promise((resolve) => {
        diceList = getDiceDataByUniqueID();

        addDefaultKeys(diceList,settings);
        buildCommonDiceTable(diceList);
        buildExtraDiceTable(diceList);

        assignValues(settings);
        hookChangeEvents(settings);
        resolve(settings);
    });
};

function assignCheckboxValues(storedSettings) {
    let checkboxArray = document.getElementsByClassName('cBox');
    for (let i = 0; i < checkboxArray.length; i++) {
        let fieldVal = storedSettings.get(checkboxArray[i].id); 
        //console.log(checkboxArray[i].id);
        //console.log(fieldVal);
        if (fieldVal != undefined) {
            checkboxArray[i].checked = fieldVal;
        }
    }
};

function hookChangeEvents(storedSettings) {
    let commonDiceArray = document.getElementsByClassName('commonDice');
    for (let i = 0; i < commonDiceArray.length; i++) {
        commonDiceArray[i].addEventListener("change", (event) => {
            // save when checkbox is changed
            saveOneSetting(event.target.id, event.target.checked);
        });
    }
    let extraDiceArray = document.getElementsByClassName('extraDice');
    for (let i = 0; i < extraDiceArray.length; i++) {
        extraDiceArray[i].addEventListener("change", (event) => {
            // save when checkbox is changed
            saveOneSetting(event.target.id, event.target.checked);
        });
    }
    document.getElementById("save-results").addEventListener("change", (event) => {
        // save when checkbox is changed
        saveOneSetting(event.target.id, event.target.checked);
    });
    document.getElementById("show-common").addEventListener("change", (event) => {
        // 
        console.log(event.target.dataset.type);
        selectAllHandler(event.target.id, event.target.checked);
    });
    document.getElementById("show-extra").addEventListener("change", (event) => {
        // 
        selectAllHandler(event.target.id, event.target.checked);
    });
    let typeArray = document.getElementsByClassName('typeField');
    for (let i = 0; i < typeArray.length; i++) {
        typeArray[i].addEventListener("change", (event) => {
            // 
            var keyId = event.target.closest("tr").id;
            console.log(keyId);
            saveOneRow(keyId);
        });
    }
    let minArray = document.getElementsByClassName('minField');
    for (let i = 0; i < minArray.length; i++) {
        minArray[i].addEventListener("change", (event) => {
            // 
            var keyId = event.target.closest("tr").id;
            var minFieldVal = document.getElementById("min-"+keyId).value;
            var maxFieldVal = document.getElementById("max-"+keyId).value;
            document.getElementById("type-"+keyId).innerText = "D" + DieRoller.countSides({ min: minFieldVal, max: maxFieldVal });

            saveOneRow(keyId);
        });
    }
    let maxArray = document.getElementsByClassName('maxField');
    for (let i = 0; i < maxArray.length; i++) {
        maxArray[i].addEventListener("change", (event) => {
            // 
            var keyId = event.target.closest("tr").id;
            var minFieldVal = document.getElementById("min-"+keyId).value;
            var maxFieldVal = document.getElementById("max-"+keyId).value;
            document.getElementById("type-"+keyId).innerText = "D" + DieRoller.countSides({ min: minFieldVal, max: maxFieldVal });

            saveOneRow(keyId);
        });
    }
    let buttonArray = document.getElementsByClassName('resetbutton');
    for (let i = 0; i < buttonArray.length; i++) {
        //console.log(buttonArray[i].id);
        buttonArray[i].addEventListener("click", (event) => {
            var keyId = event.target.closest("tr").id;
            resetOneRow(keyId);
        });
    }
};

// save the edited dice values
function saveOneRow(keyId){
    var editedDice = diceList.get(keyId);
    var minFieldVal = document.getElementById("min-"+keyId).value;
    var maxFieldVal = document.getElementById("max-"+keyId).value;
    var nameFieldVal = document.getElementById("type-"+keyId).innerText;
    editedDice.min = Number.parseInt(minFieldVal);
    editedDice.max = Number.parseInt(maxFieldVal);
    editedDice.name = nameFieldVal;
    saveOneSetting(keyId,editedDice);
};

// restore dice displayed settings from original defaults
function resetOneRow(keyId){
    var originalDice = findDefaultDice(keyId);
    saveOneSetting(keyId,originalDice);
    var minField = document.getElementById("min-"+keyId);
    var maxField = document.getElementById("max-"+keyId);
    var nameField = document.getElementById("type-"+keyId);
    minField.value = originalDice.min;
    maxField.value = originalDice.max;
    nameField.innerText = originalDice.name;
}

function assignValues(storedSettings) {
    console.log("assignValues");
    assignCheckboxValues(storedSettings);
    //assignCountFieldValues(storedSettings);
    //assignResultFieldValues(storedSettings);
    return storedSettings;
};

function selectAllHandler(id, isChecked) {
    console.log("selectAllHandler");
    let labels = [ "Select All", "Unselect All" ];
    let dataType = document.getElementById(id).dataset.type;
    console.log(dataType);
    console.log(isChecked);
    let checkboxArray = document.getElementsByClassName(dataType);
    for (let i = 0; i < checkboxArray.length; i++) {
        checkboxArray[i].checked = isChecked;
        checkboxArray[i].dispatchEvent(new Event('change', { bubbles: true }));
    }
    document.getElementById(id+"-label").innerText = labels[isChecked == true ? 1 : 0];
};


loadAllSettings()
    .then(function(result){ 
        console.log(result);
        return buildOptionsUI(result)
    })
    .catch(error => console.log(error));
