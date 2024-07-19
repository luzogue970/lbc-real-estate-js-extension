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

if (window.location.href.startsWith('https://www.leboncoin.fr/ad/ventes_immobilieres')) {
    getImmoInfo().then((immoData) => {
        const currentLink = "https://www.meilleursagents.com/prix-immobilier/" + immoData;
        chrome.storage.sync.set(
            { currentLink: currentLink }
        );
    });
}
else {
    chrome.storage.sync.set(
        { currentLink: 'no-link' }
    );
}

