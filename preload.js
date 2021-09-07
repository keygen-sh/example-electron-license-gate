const Store = require('electron-store')

const store = new Store({ encryptionKey: 'encryption-key-here' })

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('app-version').innerHTML = store.get('app.version')
  document.getElementById('app-mode').innerHTML = store.get('app.mode')
})
