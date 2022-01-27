const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
  const gate = document.getElementById('license-gate')

  gate.addEventListener('submit', async event => {
    event.preventDefault()

    const data = new FormData(gate)
    const key = data.get('license-key')

    ipcRenderer.send('GATE_SUBMIT', { key })
  })
})
