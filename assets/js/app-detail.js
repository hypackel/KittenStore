document.addEventListener('init', async function (event) {
    const page = event.target;

    if (page.id === 'page2') {
      const { appName } = page.data;

      try {
        const app = await fetchAppByName(appName);
        const latestVersion = app.versions && app.versions[0]; // Ensure versions is not undefined
        if (!latestVersion) {
          page.querySelector('.app-description').innerText = 'No versions available for this app.';
          return;
        }

        page.querySelector('.center').innerText = app.name;

        const appIconElement = page.querySelector('.app-icon-large');
        appIconElement.src = app.iconURL;
        appIconElement.onerror = function () {
          this.src = 'https://placehold.co/400x400/000000/FFFFFF/png?text=No%5CnIcon&font=roboto';
        };

        const cleanedDescription = latestVersion.localizedDescription.replace(/\nLast updated:.*$/m, '').replace(/Status:.*$/m, '');

        const lastUpdatedDate = new Date(latestVersion.date);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate - lastUpdatedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const updatedDescription = `${cleanedDescription}\nLast updated: ${diffDays} days ago`;
        page.querySelector('.app-description').innerHTML = makeLinksClickable(updatedDescription);

        const statusMatch = latestVersion.localizedDescription.match(/Status:\s*(.*)/);
        const statusEmojis = statusMatch ? statusMatch[1] : '';

        const statusElement = document.createElement('div');
        statusElement.className = 'app-status';
        statusElement.innerText = statusEmojis;
        page.querySelector('.app-description').appendChild(statusElement);

        page.querySelector('.app-repo').innerText = `From: ${app.repoName}`;

        const fileSize = formatFileSize(latestVersion.size);
        page.querySelector('.app-size').innerText = `File Size: ${fileSize}`;

        page.querySelector('#trollstore-install').onclick = function () {
          const trollStoreURL = `apple-magnifier://install?url=${encodeURIComponent(latestVersion.downloadURL)}`;
          location.href = trollStoreURL;
        };

        page.querySelector('#sidestore-install').onclick = function () {
          const sideStoreURL = `sidestore://source?url=${encodeURIComponent(latestVersion.downloadURL)}`;
          location.href = sideStoreURL;
        };

        page.querySelector('#scarlet-install').onclick = function () {
          const appdbURL = `scarlet://install=${encodeURIComponent(latestVersion.downloadURL)}`;
          window.open(appdbURL, '_blank');
        };

        page.querySelector('#esign-install').onclick = function () {
          const appdbURL = `itms-services://?action=download-manifest&amp;url=${encodeURIComponent(latestVersion.downloadURL)}`;
          window.open(appdbURL, '_blank');
        };

        page.querySelector('#altstore-install').onclick = function () {
          const appdbURL = `altstore://install?url=${encodeURIComponent(latestVersion.downloadURL)}`;
          window.open(appdbURL, '_blank');
        };

        page.querySelector('#appdb-search').onclick = function () {
          const appdbURL = `https://appdb.to/?name=${encodeURIComponent(app.name)}`;
          window.open(appdbURL, '_blank');
        };

        page.querySelector('#ipa-download').onclick = function () {
          window.open(latestVersion.downloadURL, '_blank');
        };

        updateInstallButtons();

      } catch (error) {
        console.error('Error fetching app details:', error);
        page.querySelector('.app-description').innerText = 'Failed to load app details.';
      }
    }
  });

  async function fetchAppByName(appName) {
    const repos = await fetchRepositories();
    for (const repo of repos) {
      const app = repo.data.apps.find(app => app.name === appName);
      if (app) {
        app.repoName = repo.data.name; // Store the repo name with the app
        return app;
      }
    }
    throw new Error(`App "${appName}" not found in any repository`);
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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