const downloadLink = document.querySelector('#download-link');
const status = document.querySelector('#download-status');
const platform = document.querySelector('#platform');
const address = document.querySelector('#extensions-address');
const ua = navigator.userAgent;
const mobile = /Android|iPhone|iPad|iPod/i.test(ua) || (/Mac/i.test(navigator.platform) && navigator.maxTouchPoints > 1);
const chromium = /Chrome|Chromium|Edg\//.test(ua) && !mobile;
const platformName = /Win/i.test(navigator.platform) ? 'windows' : /Mac|iPhone|iPad|iPod/i.test(navigator.platform) ? 'mac' : 'linux';
const instructions = {
  mac: 'Double-click <strong>sift-beta.zip</strong> in Downloads.',
  windows: 'Right-click <strong>sift-beta.zip</strong> and choose <strong>Extract All</strong>.',
  linux: 'Open <strong>sift-beta.zip</strong> and extract its contents.',
};
platform.value = platformName;
const showPlatform = () => { document.querySelector('#unzip-instruction').innerHTML = instructions[platform.value] || instructions.linux; };
platform.addEventListener('change', showPlatform);
showPlatform();

async function copy(text, target, input) {
  try {
    await navigator.clipboard.writeText(text);
    target.textContent = 'Copied. Paste it into a new tab.';
    return true;
  } catch {
    if (input) { input.focus(); input.select(); }
    target.textContent = input ? `Press ${platform.value === 'mac' ? '⌘C' : 'Ctrl+C'} to copy the selected address.` : 'Copy this page’s address from your browser.';
    return false;
  }
}
document.querySelector('#copy-address').addEventListener('click', async () => {
  const copied = await copy(address.value, document.querySelector('#copy-status'), address);
  document.querySelector('#copy-label').textContent = copied ? 'Copied' : 'Copy';
});
address.addEventListener('click', () => address.select());
document.querySelector('#copy-page').addEventListener('click', () => copy('https://sifttheweb.com/beta/', document.querySelector('#page-copy-status')));

if (!chromium) {
  document.querySelector('#device-notice').hidden = false;
  document.querySelector('#device-message').textContent = mobile ? 'Sift works on computers for now. Open this page in desktop Chrome.' : 'To install Sift, open this page in Chrome on your computer.';
  status.textContent = 'Download Sift for desktop Chrome.';
} else {
  const key = `sift-beta-download:${downloadLink.getAttribute('href')}`;
  let attempted = false;
  try { attempted = sessionStorage.getItem(key) === 'requested'; } catch { /* The page also works with storage disabled. */ }
  const navigation = performance.getEntriesByType('navigation')[0];
  if (!attempted && navigation?.type !== 'reload' && navigation?.type !== 'back_forward') {
    try { sessionStorage.setItem(key, 'requested'); } catch { /* No persistent data is required. */ }
    downloadLink.click();
  } else status.textContent = 'Your Sift beta is ready to download.';
}

fetch('../downloads/beta.json').then(response => response.ok ? response.json() : null).then(info => {
  if (info && typeof info.version === 'string' && /^\d+\.\d+\.\d+$/.test(info.version))
    document.querySelector('#beta-version').textContent = `Beta ${info.version}`;
}).catch(() => {});
