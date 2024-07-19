
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url  && !tab.url.startsWith('chrome://')) {
        executeContentScript(tabId);
    }
});

chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url && !tab.url.startsWith('chrome://')) {
            executeContentScript(activeInfo.tabId);
        }
    });
});

function executeContentScript(tabId) {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['src/js/button-handler.js']
    });
}
