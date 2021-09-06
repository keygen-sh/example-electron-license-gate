const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
  const gate = document.getElementById('license-gate')

  gate.addEventListener('submit', async event => {
    event.preventDefault()

    const data = new FormData(gate)
    const token = data.get('token')

    ipcRenderer.send('GATE_SUBMIT', { token })
  })
})
