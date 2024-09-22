document.addEventListener('init', function (event) {
    const page = event.target;
    if (page.id === 'settings-page') {
      const trollstoreSwitch = document.getElementById('trollstore-switch');
      const sidestoreSwitch = document.getElementById('sidestore-switch');
      const appdbSwitch = document.getElementById('appdb-switch');
      const altstoreSwitch = document.getElementById('altstore-switch');
      const esignSwitch = document.getElementById('esign-switch');
      const scarletSwitch = document.getElementById('scarlet-switch');
      const iphonexPatchSwitch = document.getElementById('iphonex-patch-switch');
      const darkModeSwitch = document.getElementById('dark-mode-switch');

      // Set default values if not already set
      if (localStorage.getItem('showTrollStore') === null) localStorage.setItem('showTrollStore', 'true');
      if (localStorage.getItem('showSideStore') === null) localStorage.setItem('showSideStore', 'true');
      if (localStorage.getItem('showAppDB') === null) localStorage.setItem('showAppDB', 'true');
      if (localStorage.getItem('showAltStore') === null) localStorage.setItem('showAltStore', 'true');
      if (localStorage.getItem('showEsign') === null) localStorage.setItem('showEsign', 'true');
      if (localStorage.getItem('showScarlet') === null) localStorage.setItem('showScarlet', 'true');
      if (localStorage.getItem('iphonexPatch') === null) localStorage.setItem('iphonexPatch', 'false');
      if (localStorage.getItem('darkMode') === null) localStorage.setItem('darkMode', 'false');

      trollstoreSwitch.checked = localStorage.getItem('showTrollStore') === 'true';
      sidestoreSwitch.checked = localStorage.getItem('showSideStore') === 'true';
      appdbSwitch.checked = localStorage.getItem('showAppDB') === 'true';
      altstoreSwitch.checked = localStorage.getItem('showAltStore') === 'true';
      esignSwitch.checked = localStorage.getItem('showEsign') === 'true';
      scarletSwitch.checked = localStorage.getItem('showScarlet') === 'true';
      iphonexPatchSwitch.checked = localStorage.getItem('iphonexPatch') === 'true';
      darkModeSwitch.checked = localStorage.getItem('darkMode') === 'true';

      trollstoreSwitch.addEventListener('change', function () {
        localStorage.setItem('showTrollStore', this.checked);
        updateInstallButtons();
      });
      sidestoreSwitch.addEventListener('change', function () {
        localStorage.setItem('showSideStore', this.checked);
        updateInstallButtons();
      });
      appdbSwitch.addEventListener('change', function () {
        localStorage.setItem('showAppDB', this.checked);
        updateInstallButtons();
      });
      altstoreSwitch.addEventListener('change', function () {
        localStorage.setItem('showAltStore', this.checked);
        updateInstallButtons();
      });
      esignSwitch.addEventListener('change', function () {
        localStorage.setItem('showEsign', this.checked);
        updateInstallButtons();
      });
      scarletSwitch.addEventListener('change', function () {
        localStorage.setItem('showScarlet', this.checked);
        updateInstallButtons();
      });
      iphonexPatchSwitch.addEventListener('change', function () {
        localStorage.setItem('iphonexPatch', this.checked);
        applyIPhoneXPatch();
      });
      darkModeSwitch.addEventListener('change', function () {
        localStorage.setItem('darkMode', this.checked);
        applyDarkMode();
      });

      // Apply dark mode on page load
      applyDarkMode();
    }
  });

  function applyDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'true';

    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.documentElement.style.setProperty('--background-color', '#000');
      document.documentElement.style.setProperty('--text-color', '#fff');
      document.documentElement.style.setProperty('--card-color', '#1c1c1c');
      document.documentElement.style.setProperty('--card-border-color', 'transparent');
      document.documentElement.style.setProperty('--tabbar-background-color', '#1c1c1c');
    } else {
      document.body.classList.remove('dark-mode');
      // Optionally reset to light mode defaults or handle it as needed
      document.documentElement.style.removeProperty('--background-color');
      document.documentElement.style.removeProperty('--text-color');
      document.documentElement.style.removeProperty('--card-color');
      document.documentElement.style.removeProperty('--card-border-color');
      document.documentElement.style.removeProperty('--tabbar-background-color');
    }
  }

  function updateInstallButtons() {
    const showTrollStore = localStorage.getItem('showTrollStore') !== 'false';
    const showSideStore = localStorage.getItem('showSideStore') !== 'false';
    const showAppDB = localStorage.getItem('showAppDB') !== 'false';
    const showAltStore = localStorage.getItem('showAltStore') !== 'false';
    const showEsign = localStorage.getItem('showEsign') !== 'false';
    const showScarlet = localStorage.getItem('showScarlet') !== 'false';

    const trollstoreButton = document.getElementById('trollstore-install');
    const sidestoreButton = document.getElementById('sidestore-install');
    const appdbButton = document.getElementById('appdb-search');
    const altstoreButton = document.getElementById('altstore-install');
    const esignButton = document.getElementById('esign-install');
    const scarletButton = document.getElementById('scarlet-install');

    if (trollstoreButton) trollstoreButton.style.display = showTrollStore ? 'inline-block' : 'none';
    if (sidestoreButton) sidestoreButton.style.display = showSideStore ? 'inline-block' : 'none';
    if (appdbButton) appdbButton.style.display = showAppDB ? 'inline-block' : 'none';
    if (altstoreButton) altstoreButton.style.display = showAltStore ? 'inline-block' : 'none';
    if (esignButton) esignButton.style.display = showEsign ? 'inline-block' : 'none';
    if (scarletButton) scarletButton.style.display = showScarlet ? 'inline-block' : 'none';
  }

  function makeLinksClickable(text) {
    return text.replace(/https?:\/\/[^\s]+/g, url => `<a href="${url}" target="_blank">${url}</a>`);
  }

  function applyIPhoneXPatch() {
    const iphonexPatch = localStorage.getItem('iphonexPatch') === 'true';
    const htmlElement = document.documentElement;

    if (iphonexPatch) {
      if (ons.platform.isIPhoneX()) {
        htmlElement.setAttribute('onsflag-iphonex-portrait', '');
        htmlElement.setAttribute('onsflag-iphonex-landscape', '');
      }
    } else {
      htmlElement.removeAttribute('onsflag-iphonex-portrait');
      htmlElement.removeAttribute('onsflag-iphonex-landscape');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateInstallButtons();
    applyIPhoneXPatch();
    applyDarkMode();
  });