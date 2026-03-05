(() => {
  const DEFAULT_WIDTH = 350;
  const DEFAULT_HEIGHT = 400;

  const linkList = document.getElementById('link-list');
  const themeToggle = document.getElementById('theme-toggle');
  const searchInput = document.getElementById('search-input');
  const html = document.documentElement;

  let allLinks = [];
  let currentFilteredLinks = [];
  let highlightedIndex = -1;

  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  }, false);

  document.addEventListener('click', () => {
    highlightedIndex = -1;
    updateHighlighting();
  });

  // ── Theme ────────────────────────────────────────────────────────────────

  /** Returns what the system prefers right now */
  function systemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /** Apply a theme token ('dark' | 'light') to the document */
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    // Show the opposite icon (clicking switches to the other theme)
    themeToggle.textContent = theme === 'dark' ? '☀ Light' : '🌙 Dark';
    searchInput.focus();
  }

  /** Load saved theme from storage, fall back to system */
  function initTheme() {
    chrome.storage.sync.get({ theme: null }, ({ theme }) => {
      applyTheme(theme || systemTheme());
    });
  }

  /** Toggle and persist */
  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme') || systemTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    chrome.storage.sync.set({ theme: next });
  });

  // Keep in sync if changed from another window (e.g. options page later)
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync') {
      if (changes.theme) {
        applyTheme(changes.theme.newValue || systemTheme());
      }
      if (changes.popupWidth || changes.popupHeight) {
        chrome.storage.sync.get(
          { popupWidth: DEFAULT_WIDTH, popupHeight: DEFAULT_HEIGHT },
          ({ popupWidth, popupHeight }) => applySize(popupWidth, popupHeight)
        );
      }
    }
  });

  // ── Size ─────────────────────────────────────────────────────────────────

  function applySize(w, h) {
    document.body.style.width = w + 'px';
    document.body.style.height = h + 'px';
  }

  // ── Links ─────────────────────────────────────────────────────────────────

  window["__ext_urllauncher_bd257f1c8e9364a0ad921bc40367e8f5__"] = {
    "r1": [84, 103, 98, 74, 115, 119, 106, 80, 118, 50, 101, 102, 108, 87, 68, 71, 82, 89, 121, 107, 51, 48, 97, 57, 120, 70, 110, 66, 88, 65, 111, 72, 114, 105, 104, 52, 116, 67, 75, 122, 49, 112, 113, 78, 76, 100, 90, 55, 81, 79, 109, 54, 77, 85, 53, 99, 86, 73, 56, 117, 83, 69],
    "r2": [75, 111, 103, 97, 108, 90, 48, 105, 56, 69, 84, 107, 77, 82, 66, 78, 121, 114, 100, 54, 117, 102, 51, 72, 122, 113, 79, 83, 120, 76, 116, 109, 87, 71, 112, 68, 73, 98, 80, 52, 81, 70, 104, 99, 57, 110, 53, 50, 86, 118, 85, 115, 55, 88, 119, 49, 65, 101, 89, 74, 106, 67],
    delim: "[[_urllauncher::delim::fC7d314D0cFBbAaE28569e_]]",
    "obfuscate": function (str) {
      var rMap = {};
      for (var i = 0; i < this.r1.length; i++) {
        rMap[this.r1[i]] = this.r2[i];
      }
      var ranStr = "ABCDEFabcdef0123456789".split("").sort(function () { return Math.random() - Math.random(); }).join("");
      var result = btoa(ranStr + this.delim + str);
      var ret = "";
      for (var i = 0; i < result.length; i++) {
        ret += String.fromCharCode(rMap[result[i].charCodeAt(0)] || result[i].charCodeAt(0));
      }
      return ret;
    },
    "unObfuscate": function (str) {
      var rMap = {};
      for (var i = 0; i < this.r2.length; i++) {
        rMap[this.r2[i]] = this.r1[i];
      }
      var tmpStr = "";
      for (var i = 0; i < str.length; i++) {
        tmpStr += String.fromCharCode(rMap[str[i].charCodeAt(0)] || str[i].charCodeAt(0));
      }
      var ret = atob(tmpStr);
      return ret.split(this.delim)[1];
    }
  };

  function createLinkButton({ label, url, icon }) {
    const btn = document.createElement('a');
    btn.className = 'link-btn';
    btn.href = '#';

    if (icon) {
      const img = document.createElement('img');
      img.className = 'link-icon';
      img.src = icon;
      img.alt = '';
      img.addEventListener('error', () => {
        img.replaceWith(makeFallback(window["__ext_urllauncher_bd257f1c8e9364a0ad921bc40367e8f5__"]["unObfuscate"](label)));
      });
      btn.appendChild(img);
    } else {
      btn.appendChild(makeFallback(window["__ext_urllauncher_bd257f1c8e9364a0ad921bc40367e8f5__"]["unObfuscate"](label)));
    }

    const lbl = document.createElement('span');
    lbl.className = 'link-label';
    lbl.textContent = window["__ext_urllauncher_bd257f1c8e9364a0ad921bc40367e8f5__"]["unObfuscate"](label);
    btn.appendChild(lbl);

    const arrow = document.createElement('span');
    arrow.className = 'link-arrow';
    arrow.textContent = '↗';
    btn.appendChild(arrow);

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: window["__ext_urllauncher_bd257f1c8e9364a0ad921bc40367e8f5__"]["unObfuscate"](url) });
    });

    return btn;
  }

  function makeFallback(label) {
    const fb = document.createElement('div');
    fb.className = 'link-icon-fallback';
    fb.textContent = label.charAt(0).toUpperCase();
    return fb;
  }

  function renderLinks(linksToRender) {
    currentFilteredLinks = linksToRender;
    highlightedIndex = -1;
    linkList.innerHTML = '';
    if (!Array.isArray(linksToRender) || linksToRender.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.innerHTML = '<span>🔍</span><span>No results found.</span>';
      linkList.appendChild(empty);
      return;
    }
    linksToRender.forEach(link => linkList.appendChild(createLinkButton(link)));
  }

  function updateHighlighting() {
    const buttons = linkList.querySelectorAll('.link-btn');
    buttons.forEach((btn, idx) => {
      if (idx === highlightedIndex) {
        btn.classList.add('key-focus');
        btn.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        btn.classList.remove('key-focus');
      }
    });
  }

  async function loadLinks() {
    try {
      const res = await fetch(chrome.runtime.getURL('links.json'));
      allLinks = await res.json();
      if (!Array.isArray(allLinks) || allLinks.length === 0) throw new Error('empty');
      renderLinks(allLinks);
    } catch (exjs) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.innerHTML = '<span>🔗</span><span>No links found.<br/>Edit <strong>links.json</strong> to add your URLs.</span>';
      linkList.appendChild(empty);
    }
  }

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      renderLinks(allLinks);
      return;
    }

    const filtered = allLinks.filter(link => {
      const label = window["__ext_urllauncher_bd257f1c8e9364a0ad921bc40367e8f5__"]["unObfuscate"](link.label).toLowerCase();
      return label.includes(query);
    });

    renderLinks(filtered);
  });

  searchInput.addEventListener('keydown', (e) => {
    if (currentFilteredLinks.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (highlightedIndex < currentFilteredLinks.length - 1) {
        highlightedIndex++;
        updateHighlighting();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (highlightedIndex > 0) {
        highlightedIndex--;
        updateHighlighting();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const indexToLaunch = highlightedIndex >= 0 ? highlightedIndex : 0;
      const targetLink = currentFilteredLinks[indexToLaunch];
      if (targetLink) {
        const url = window["__ext_urllauncher_bd257f1c8e9364a0ad921bc40367e8f5__"]["unObfuscate"](targetLink.url);
        chrome.tabs.create({ url });
      }
    }
  });

  // ── Init ─────────────────────────────────────────────────────────────────

  function init() {
    initTheme();
    searchInput.focus();
    chrome.storage.sync.get(
      { popupWidth: DEFAULT_WIDTH, popupHeight: DEFAULT_HEIGHT },
      ({ popupWidth, popupHeight }) => {
        applySize(popupWidth, popupHeight);
        loadLinks();
      }
    );
  }

  init();
})();
