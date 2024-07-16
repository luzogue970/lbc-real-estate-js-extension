let maxPrice;
let debounceTimeout;

console.log("extension leBoncoin loaded");

function updateMaxPrice() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get('maxPrice', function (response) {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                maxPrice = response.maxPrice;
                resolve(response.maxPrice);
            }
        });
    });
}

function firstLoading() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', afterDOMLoaded);
    } else {
        afterDOMLoaded();
    }
    window.addEventListener('popstate', afterDOMLoaded); // Pour navigation dans l'historique
    window.addEventListener('hashchange', afterDOMLoaded); // Pour changement de hash
}

function afterDOMLoaded() {
    observeDOMChanges();
    hideExpensiveApartments();
}

function observeDOMChanges() {
    const targetNode = document.body;
    const config = {childList: true, subtree: true};

    const callback = function (mutationsList, observer) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    hideExpensiveApartments();
                    break;
                }
            }
        }, 200);
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
}

function hideExpensiveApartments() {
    let apartmentsCount = 0;
    const apartments = document.getElementsByClassName("styles_adCard__JzKik");
    for (let apartment of apartments) {
        const priceByMeterWrapper = apartment.getElementsByClassName("flex items-center text-caption text-on-background/dim-1 ml-sm text-small")[0];
        if (!priceByMeterWrapper) continue;
        const priceByMeter = priceByMeterWrapper.querySelector("p");
        if (!priceByMeter) continue;
        const priceWithText = priceByMeter.textContent;
        let princeWithTextWithoutSpace = priceWithText.replace(/\s+/g, '');
        let price = princeWithTextWithoutSpace.replace(/\D/g, '');
        price = parseInt(price);
        if (price > maxPrice) {
            apartmentsCount += 1;
            apartment.style.display = 'none';
        }
    }
}

function removeAccentsAndSpecialChars(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getImmoInfo() {
    return new Promise((resolve) => {
        const observer = new MutationObserver((mutations) => {
            try {
                mutations.forEach((mutation) => {
                    const wrapper = document.getElementsByClassName("z-base size-full print:hidden")
                    let brutImmoInfo = wrapper[0].firstChild.lastChild.firstChild.textContent
                    if (!brutImmoInfo.includes('1', '2', '3', '4', '5', '6', '7', '8', '9')) {
                        brutImmoInfo = wrapper[0].firstChild.lastChild.lastChild.textContent
                    }
                    brutImmoInfo = brutImmoInfo.toLowerCase();
                    brutImmoInfo = brutImmoInfo.replace(/\(/g, "-").replace(/\)/g, "");
                    brutImmoInfo = removeAccentsAndSpecialChars(brutImmoInfo);
                    brutImmoInfo = brutImmoInfo.replace(/[^a-z0-9-]/g, ' ');
                    brutImmoInfo = brutImmoInfo.replace(/\s+/g, ' ').trim();
                    resolve(brutImmoInfo);
                    observer.disconnect();
                });
            } catch (ignored) {
            }
        });
        observer.observe(document.body, {childList: true, subtree: true});
    });
}

async function main() {
    try {
        maxPrice = await updateMaxPrice();
        firstLoading();
    } catch (error) {
        console.error("Error getting maxPrice: ", error);
    }
}

main();


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'immo_found') {
        console.log("immo found");
        getImmoInfo().then((immoData) => {
        let bestAgentLink = "https://www.meilleursagents.com/prix-immobilier/" + immoData;
            window.open(bestAgentLink, '_blank');
        });
    }
});
