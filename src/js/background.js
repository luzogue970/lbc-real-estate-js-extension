chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        if (changeInfo.url && changeInfo.url.startsWith('https://www.leboncoin.fr/ad/ventes_immobilieres/')) {
            chrome.tabs.sendMessage(tabId, {
                message: 'immo_found',
                url: changeInfo.url
            })
        }
    }
);

