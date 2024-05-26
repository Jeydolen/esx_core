let locale = "en";
let debug = false;
const money = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
});

// Dictionnary between element id in dom and keys to get in data dictionnary
// Sent from main.lua
const idToValues = {
    "name-value": { type: "text", values: ["firstname", "lastname"], },
    "job-value": { type: "text", values: ["job"], },
    "money-value": { type: "money", values: ["money"], },
    "bank-value": { type: "money", values: ["bank"], },
    "dob-value": { type: "text", values: ["dateofbirth"], },
    "gender-value": { type: "text", values: ["sex"] },
};

window.addEventListener("message", function (event) {
    debugLog(event.data)
    if (event.data.locale) {
        locale = event.data.locale;
    }

    if (event.data.debug) {
        debug = Boolean(event.data.debug);
    }

    switch (event.data.action) {
        case "openui":
            showUI(event.data.character);
            break;
        case "closeui":
            closeUI();
            break;
    }
});

function debugLog(...args) {
    if (!debug) {
        return;
    }

    console.log(...args);
}

async function loadLocale(locale) {
    debugLog("loadLocale", locale);
    // Fetch of locale ressource
    let translation;
    try {
        translation = await fetch(
            `https://cfx-nui-esx_multicharacter/html/locales/${locale}.json`
        ).then(res => res.json());
    } catch {
        debugLog("Ressource unavailable ! Aborting");
        return;
    }

    debugLog("Translation", translation);

    for (const entry of Object.entries(translation)) {
        const key = entry[0];
        const value = entry[1];

        const elementLabel = document.getElementById(key + "-label");
        if (elementLabel) {
            elementLabel.innerText = value;
        }
    }

    debugLog("Translation loaded with success !");
}

async function showUI(data) {
    await loadLocale(locale);

    document.querySelector("body").style.display = "block";
    document.querySelector(".main-container").style.display = "block";

    for (const entry of Object.entries(idToValues)) {
        const id = entry[0];
        const { values, type } = entry[1];

        const element = document.getElementById(id);
        if (!element) {
            debugLog("Element id: ", id, "is not a valid element in DOM !");
            continue;
        }

        // Element text reset (when switching between characters)
        element.innerText = "";
        for (const value of values) {
            let text = data[value] ?? "";
            if (type === "money") {
                text = money.format(text);
            }

            element.innerText += " " + text;
        }
    }
}

function closeUI() {
    document.querySelector("body").style.display = "none";
    document.querySelector(".main-container").style.display = "none";
}