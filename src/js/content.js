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

async function main() {
    try {
        maxPrice = await updateMaxPrice();
        firstLoading();
    } catch (error) {
        console.error("Error getting maxPrice: ", error);
    }
}

main().then(r => {
    console.log("all work")
});