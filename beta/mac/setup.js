for (const [inputId, buttonId, labelId, statusId, message] of [
  ['extensions-address', 'copy-address', 'copy-label', 'copy-status', 'Copied. Paste it into a new tab.'],
  ['folder-address', 'copy-folder', 'folder-copy-label', 'folder-copy-status', 'Copied. In the folder picker, press ⌘⇧G and paste.'],
]) {
  const input = document.getElementById(inputId);
  input.addEventListener('click', () => input.select());
  document.getElementById(buttonId).addEventListener('click', async () => {
    const status = document.getElementById(statusId);
    try {
      await navigator.clipboard.writeText(input.value);
      document.getElementById(labelId).textContent = 'Copied';
      status.textContent = message;
    } catch {
      input.focus();
      input.select();
      status.textContent = 'Press ⌘C to copy the selected text.';
    }
  });
}
