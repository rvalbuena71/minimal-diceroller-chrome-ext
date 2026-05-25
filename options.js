import { DieRoller, Dice, DicePool, DiceResult, diceKeys, diceValues, getDiceDataByUniqueID, commonDice, extraDice, findDefaultDice } from './dice.js';
import { loadAllSettings, saveAllSettings, saveOneSetting, parseFromSettings } from './common.js';
import { addDefaultKeys } from './popup.js';

var diceList;

function buildTableStart() {
    let tableHtml = document.createElement("table");
    let row1 = tableHtml.insertRow(-1);
    row1.insertCell(0).innerText = "Show";
    row1.insertCell(1).innerText = "Type";
    row1.insertCell(2).innerText = "Min";
    row1.insertCell(3).innerText = "Max";
    row1.insertCell(4);
    return tableHtml;
};

function buildCommonDiceTable(diceDataList){
    let tableHtml = buildTableStart();
    let counter = 0;
    diceDataList.forEach((value,key) => {
        if (counter < commonDice.length) {
            buildRow2(key, value, 'commonDice', tableHtml);
        }
        counter++;
    });
    document.getElementById('commonDice').appendChild(tableHtml);
};

function buildExtraDiceTable(diceDataList){
    let tableHtml = buildTableStart();
    let counter = 0;
    diceDataList.forEach((value,key) => {
        if (counter >= commonDice.length) {
            buildRow2(key, value, 'extraDice', tableHtml);
        }
        counter++;
    });
    document.getElementById('extraDice').appendChild(tableHtml);
};

function buildRow2(keyId, dice, extraClass, targetTable) {
    //console.log(keyId + " : " + JSON.stringify(dice));
    let newRow = targetTable.insertRow(-1);
    newRow.id = keyId;
    // handle special case
    if (dice.name == "DF") {
        let c0 = newRow.insertCell(0);
        c0.setAttribute("class","checkCell");
        let checkbox1 = document.createElement("input");
        checkbox1.setAttribute("id","show-"+keyId);
        checkbox1.setAttribute("type","checkbox");
        checkbox1.setAttribute("class",`checkbox cBox ${extraClass}`);
        c0.appendChild(checkbox1);

        let c1 = newRow.insertCell(1);
        let type1 = document.createElement("div");
        type1.innerText = dice.name;
        type1.setAttribute("id","type-"+keyId);
        type1.setAttribute("data-type",keyId);
        c1.appendChild(type1);

        let c2 = newRow.insertCell(2);
        let min1 = document.createElement("div");
        min1.innerText = dice.min;
        c2.appendChild(min1);
        
        let c3 = newRow.insertCell(3);
        let max1 = document.createElement("div");
        max1.innerText = dice.max;
        c3.appendChild(max1);

        let c4 = newRow.insertCell(4);
    }
    else {
        let c0 = newRow.insertCell(0);
        c0.setAttribute("class","checkCell");
        let checkbox1 = document.createElement("input");
        checkbox1.setAttribute("id","show-"+keyId);
        checkbox1.setAttribute("type","checkbox");
        checkbox1.setAttribute("class",`checkbox cBox ${extraClass}`);
        c0.appendChild(checkbox1);

        let c1 = newRow.insertCell(1);
        let type1 = document.createElement("div");
        type1.innerText = dice.name;
        type1.setAttribute("id","type-"+keyId);
        type1.setAttribute("data-type",keyId);
        c1.appendChild(type1);

        let c2 = newRow.insertCell(2);
        let min1 = document.createElement("input");
        min1.setAttribute("id","min-"+keyId);
        min1.setAttribute("size",4);
        min1.setAttribute("type","number");
        min1.setAttribute("class","countField minField");
        min1.setAttribute("data-type",keyId);
        min1.value = dice.min;
        c2.appendChild(min1);

        let c3 = newRow.insertCell(3);
        let max1 = document.createElement("input");
        max1.setAttribute("id","max-"+keyId);
        max1.setAttribute("size",4);
        max1.setAttribute("min",1);
        max1.setAttribute("type","number");
        max1.setAttribute("class","countField maxField");
        max1.setAttribute("data-type",keyId);
        max1.value = dice.max;
        c3.appendChild(max1);

        let c4 = newRow.insertCell(4);
        let button1 = document.createElement("button");
        button1.setAttribute("id","reset-"+keyId)
        button1.setAttribute("class","resetbutton");
        button1.setAttribute("data-type",keyId);
        button1.innerText = "Reset";
        c4.appendChild(button1);
    }
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
        //console.log(event.target.dataset.type);
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
            //console.log(keyId);
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
    //console.log(dataType);
    //console.log(isChecked);
    let checkboxArray = document.getElementsByClassName(dataType);
    for (let i = 0; i < checkboxArray.length; i++) {
        checkboxArray[i].checked = isChecked;
        checkboxArray[i].dispatchEvent(new Event('change', { bubbles: true }));
    }
    document.getElementById(id+"-label").innerText = labels[isChecked == true ? 1 : 0];
};


loadAllSettings()
    .then(function(result){ 
        //console.log(result);
        return buildOptionsUI(result)
    })
    .catch(error => console.log(error));
