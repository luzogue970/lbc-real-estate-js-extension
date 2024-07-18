const saveOptions = () => {
    const maxPrice = document.getElementById('maxPrice').value;
    chrome.storage.sync.set(
        { maxPrice: maxPrice },
        () => {
            const status = document.getElementById('status');
            status.textContent = 'Options saved';
            setTimeout(() => {
                status.textContent = '';
            }, 750);
        }
    );
    chrome.tabs.reload()
};

const restoreOptions = () => {
    chrome.storage.sync.get(
        { maxPrice: 0, currentLink: '' },
        (items) => {
            document.getElementById('maxPrice').value = items.maxPrice;
            if (items.currentLink) {
                document.getElementById('bestAgentLink').href = items.currentLink;
            }
        }
    );
};

document.addEventListener('DOMContentLoaded', () => {
    restoreOptions();
    console.log("link well saved")
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'sync' && changes.currentLink) {
            document.getElementById('bestAgentLink').href = changes.currentLink.newValue;
        }
    });
});


// document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
