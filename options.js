(() => {
    const DEFAULT_WIDTH = 350;
    const DEFAULT_HEIGHT = 400;
    const MIN_SIZE = 300;
    const MAX_SIZE = 800;
    const widthInput = document.getElementById('popup-width');
    const heightInput = document.getElementById('popup-height');
    const saveBtn = document.getElementById('save-btn');
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    const toastIcon = document.getElementById('toast-icon');
    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }
    function enforceLimitsOnBlur(input) {
        input.addEventListener('blur', () => {
            const val = parseInt(input.value, 10);
            if (!isNaN(val)) {
                const min = parseInt(input.min, 10);
                const max = parseInt(input.max, 10);
                input.value = clamp(val, min, max);
            }
        });
    }
    enforceLimitsOnBlur(widthInput);
    enforceLimitsOnBlur(heightInput);
    chrome.storage.sync.get(
        { popupWidth: DEFAULT_WIDTH, popupHeight: DEFAULT_HEIGHT },
        ({ popupWidth, popupHeight }) => {
            widthInput.value = popupWidth;
            heightInput.value = popupHeight;
        }
    );
    function showToast(msg, type = 'success') {
        toastMsg.textContent = msg;
        toastIcon.textContent = type === 'success' ? '✓' : '✕';
        toast.className = `show ${type}`;
        setTimeout(() => { toast.className = type; }, 3000);
    }
    saveBtn.addEventListener('click', () => {
        let w = parseInt(widthInput.value, 10) || DEFAULT_WIDTH;
        let h = parseInt(heightInput.value, 10) || DEFAULT_HEIGHT;
        w = clamp(w, MIN_SIZE, MAX_SIZE);
        h = clamp(h, MIN_SIZE, MAX_SIZE);
        widthInput.value = w;
        heightInput.value = h;
        chrome.storage.sync.set({ popupWidth: w, popupHeight: h }, () => {
            if (chrome.runtime.lastError) {
                showToast('Save failed: ' + chrome.runtime.lastError.message, 'error');
            } else {
                showToast('Settings saved!', 'success');
            }
        });
    });
    const restoreBtn = document.getElementById('restore-btn');
    restoreBtn.addEventListener('click', () => {
        widthInput.value = DEFAULT_WIDTH;
        heightInput.value = DEFAULT_HEIGHT;
        chrome.storage.sync.set({ popupWidth: DEFAULT_WIDTH, popupHeight: DEFAULT_HEIGHT }, () => {
            if (chrome.runtime.lastError) {
                showToast('Restore failed: ' + chrome.runtime.lastError.message, 'error');
            } else {
                showToast('Defaults restored!', 'success');
            }
        });
    });
})();