'use strict';

function logStatus(message) {
    console.log(\`%c[SYSTEM]:// \${message}\`, 'color: #00ffff; font-weight: bold;');
}

async function fetchData() {
    try {
        logStatus('Fetching data stream from data/content.json...');
        const response = await fetch('data/content.json');
        if (!response.ok) {
            throw new Error(\`Network response was not ok. Status: \${response.status}\`);
        }
        const data = await response.json();
        logStatus('Data stream received. Rendering...');
        return data;
    } catch (error) {
        console.error('%c[ERROR]:// Failed to fetch data:', 'color: #ff0000;', error);
        return null;
    }
}

function renderContent(data, rootElement) {
    if (!data || !rootElement) return;

    let featureList = data.features.map(item => \`<li>\${item}</li>\`).join('');

    rootElement.innerHTML = \`
        <h2>\${data.pageTitle}</h2>
        <p>\${data.welcomeMessage}</p>
        <ul>\${featureList}</ul>
    \`;
}

document.addEventListener('DOMContentLoaded', async () => {
    logStatus('DOM loaded. Initializing interface...');
    const appRoot = document.getElementById('app-root');

    if (appRoot) {
        const contentData = await fetchData();
        renderContent(contentData, appRoot);
    } else {
        console.error('FATAL: #app-root element not found in DOM.');
    }

    logStatus('Initialization complete.');
});
