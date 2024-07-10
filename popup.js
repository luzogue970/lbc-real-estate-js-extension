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
        { maxPrice: 0 },
        (items) => {
            document.getElementById('maxPrice').value = items.maxPrice;
        }
    );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
// document.getElementById('maxPrice').addEventListener('change', saveOptions);
document.getElementById('save').addEventListener('click', saveOptions);
