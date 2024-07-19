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
            const link = document.getElementById('bestAgentLink');
            if (items.currentLink !== 'no-link') {
                link.href = items.currentLink;
            }
            else {
                link.disabled = true;
                link.style.backgroundColor = 'grey'
                link.style.cursor = 'not-allowed'
                link.textContent = 'aucun lien disponible X'
                link.addEventListener('click', function(event) {
                    event.preventDefault();
                });            }
        }
    );
};

document.addEventListener('DOMContentLoaded', () => {
    restoreOptions();
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'sync' && changes.currentLink) {
            document.getElementById('bestAgentLink').href = changes.currentLink.newValue;
        }
    });
});

document.getElementById('save').addEventListener('click', saveOptions);
