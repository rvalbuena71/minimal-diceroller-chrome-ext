
// load all the stored config settings as a Map for iteration
export function loadAllSettings() {
    return new Promise((resolve) => {
        console.log("loadAllSettings START");
        var result = new Map();
        chrome.storage.sync.get().then((items) => {
            //console.log(items);
            for (const [key, value] of Object.entries(items)) {
                //console.log("loaded::"+key+":" + value);
                result.set(key,value);
            }
            console.log(result);
            console.log("loadAllSettings END");
            resolve(result);
        })
    })
};

// save all the config settings from the given Map
export function saveAllSettings(settings) {
    console.log("saveAllSettings START");
        return new Promise((resolve) => {
            settings.forEach((value, key) => {
            // square brackets around keyname to use variable value
            chrome.storage.sync.set({ [key] : value }).then(() => {
                    console.log("changed::"+key+":"+value);
                }).catch(error => console.log(error));
        });
        console.log("saveAllSettings END");
        resolve(true);
    })
};

export function saveOneSetting(key, value) {
    console.log("saveOneSetting");
    // square brackets around keyname to use variable value
    chrome.storage.sync.set({ [key] : value }).then(() => {
        console.log("changed::"+key+":"+value);
    }).catch(error => console.log(error));
}

export function isNumber(val) {
    return Number.parseInt(val) != NaN;
}
/*
export function parseFromSettings(keyList, settings) {
    let result = new Map();
    keyList.forEach((key) => {
        result.set(key, JSON.parse(settings.get(key)));
    });
    return result;
}
*/
export function parseFromSettings(map, keyList, settings) {
    keyList.forEach((key) => {
        map.set(key, JSON.parse(settings.get(key)));
    });
    return map;
}

export function parseOneFromSettings(key, settings) {
    return JSON.parse(settings.get(key));
}

