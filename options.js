(() => {
    const DEFAULT_WIDTH = 350;
    const DEFAULT_HEIGHT = 400;

    const widthInput = document.getElementById('popup-width');
    const heightInput = document.getElementById('popup-height');
    const saveBtn = document.getElementById('save-btn');
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    const toastIcon = document.getElementById('toast-icon');

    /** Load current settings from storage */
    chrome.storage.sync.get(
        { popupWidth: DEFAULT_WIDTH, popupHeight: DEFAULT_HEIGHT },
        ({ popupWidth, popupHeight }) => {
            widthInput.value = popupWidth;
            heightInput.value = popupHeight;
        }
    );

    /** Show a toast notification */
    function showToast(msg, type = 'success') {
        toastMsg.textContent = msg;
        toastIcon.textContent = type === 'success' ? '✓' : '✕';
        toast.className = `show ${type}`;
        setTimeout(() => { toast.className = type; }, 3000);
    }

    /** Save */
    saveBtn.addEventListener('click', () => {
        const w = parseInt(widthInput.value, 10) || DEFAULT_WIDTH;
        const h = parseInt(heightInput.value, 10) || DEFAULT_HEIGHT;

        chrome.storage.sync.set({ popupWidth: w, popupHeight: h }, () => {
            if (chrome.runtime.lastError) {
                showToast('Save failed: ' + chrome.runtime.lastError.message, 'error');
            } else {
                showToast('Settings saved!', 'success');
            }
        });
    });
})();
