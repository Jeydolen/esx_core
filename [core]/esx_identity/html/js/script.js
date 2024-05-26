let debug = false;
window.addEventListener("message", (event) => {
    if (event.data.type === "enableui") {
        document.body.classList[event.data.enable ? "remove" : "add"]("none");
    }

    if (event.data.debug !== undefined) {
        debug = Boolean(event.data.debug);
    }

    if (event.data.locale) {
        loadLocale(event.data.locale);
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
            `https://cfx-nui-esx_identity/html/locales/${locale}.json`
        ).then(res => res.json());
    } catch {
        debugLog("Ressource unavailable ! Aborting");
        return;
    }

    debugLog("Translation", translation);

    for (const entry of Object.entries(translation)) {
        const key = entry[0];
        const value = entry[1];

        const element = document.getElementById(key);
        const elementLabel = document.getElementById(key + "-label");

        if (element) {
            element.placeholder = value;
        }

        if (elementLabel) {
            elementLabel.innerText = value;
        }
    }

    debugLog("Translation loaded with success !");
}

document.querySelector("#register").addEventListener("submit", (event) => {
    event.preventDefault();

    const dofVal = document.querySelector("#dateofbirth").value;
    if (!dofVal) return;

    const dateCheck = new Date(dofVal);

    const year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(dateCheck);
    const month = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(dateCheck);
    const day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(dateCheck);

    const formattedDate = `${day}/${month}/${year}`;
    fetch("http://esx_identity/register", {
        method: "POST",
        body: JSON.stringify({
            firstname: document.querySelector("#firstname").value,
            lastname: document.querySelector("#lastname").value,
            dateofbirth: formattedDate,
            sex: document.querySelector("input[type='radio'][name='sex']:checked").value,
            height: document.querySelector("#height").value,
        }),
    });

    document.querySelector("#register").reset();
});

document.addEventListener("DOMContentLoaded", () => {
    fetch("http://esx_identity/ready", {
        method: "POST",
        body: JSON.stringify({}),
    });
});
