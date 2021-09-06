const { app, dialog, ipcMain, BrowserWindow } = require('electron')
const { autoUpdater } = require('electron-updater')
const unhandled = require('electron-unhandled')
const fetch = require('electron-main-fetch')
const path = require('path')

// Catch unhandled errors and promise rejections
unhandled()

const isDev = process.env.NODE_ENV === 'development'

// Validate a license by activation token. Returns the validation result and a license object.
async function validateLicenseByActivationToken(token) {
  const licenseResponse = await fetch('https://api.keygen.sh/v1/accounts/demo/me', { headers: { authorization: `Bearer ${token}` } })
  const licensePayload = await licenseResponse.json()
  if (licensePayload.errors) {
    return { status: licenseResponse.status, errors: licensePayload.errors }
  }

  const validateResponse = await fetch(`https://api.keygen.sh/v1/accounts/demo/licenses/${licensePayload.data.id}/actions/validate`, { method: 'POST', headers: { authorization: `Bearer ${token}` } })
  const validatePayload = await validateResponse.json()
  if (validatePayload.errors) {
    return { status: validateResponse.status, errors: validatePayload.errors }
  }

  return {
    status: validateResponse.status,
    meta: validatePayload.meta,
    data: validatePayload.data,
  }
}

// Wrap the main application window in a license gate. The main window will
// only be launched when a valid license is provided.
async function gateAppLaunchWithLicense(appLauncher) {
  const gateWindow = new BrowserWindow({
    resizable: false,
    frame: false,
    width: 420,
    height: 200,
    webPreferences: {
      preload: path.join(__dirname, 'gate.js'),
      devTools: isDev,
    },
  })

  gateWindow.loadFile('gate.html')

  if (isDev) {
    gateWindow.webContents.openDevTools({ mode: 'detach' })
  }

  ipcMain.on('GATE_SUBMIT', async (_event, { token }) => {
    // Validate the license that belongs to the given activation token
    const res = await validateLicenseByActivationToken(token)
    if (res.errors) {
      const [{ code }] = res.errors
      const choice = await dialog.showMessageBox(gateWindow, {
        type: 'error',
        title: 'Your license is invalid',
        message: 'The activation token you entered does not belong to a license. Would you like to buy a license?',
        detail: `Error code: ${code ?? res.status}`,
        buttons: [
          'Exit',
          'Try Again',
          'Buy a License',
        ],
      })

      switch (choice.response) {
        case 0:
          app.exit(1)

          break
        case 1:
          // noop

          break
        case 2:
          // TODO(ezekg) Open a link to purchase page

          break
      }

      return
    }

    // Branch on the license's validation code
    const { valid, constant: code } = res.meta
    switch (code) {
      // License is valid. All is well.
      case 'VALID':
      // For expired licenses, we still want to allow the app to be used, but automatic
      // updates will not be allowed.
      case 'EXPIRED': {
        await dialog.showMessageBox(gateWindow, {
          type: valid ? 'info' : 'warning',
          title: 'Thanks for your business!',
          message: `The activation token you entered belongs to license ${res.data.id.substring(0, 8)}. Your license is ${code.toLowerCase()}.`,
          detail: valid ? 'Automatic updates are enabled.' : 'Automatic updates are disabled.',
          buttons: [
            'Continue',
          ],
        })

        // Close the license gate window
        gateWindow.close()

        // Launch our main app
        appLauncher(token)

        break
      }
      // All other validation codes, e.g. SUSPENDED, etc. are treated as invalid.
      default: {
        await dialog.showMessageBox(gateWindow, {
          type: 'error',
          title: 'Your license is invalid',
          message: 'The activation token you entered belongs to a license that is no longer valid.',
          detail: `Validation code: ${code}`,
          buttons: [
            'Exit',
          ],
        })

        app.exit(1)

        break
      }
    }
  })
}

// Launch the main application window and configure automatic updates.
function launchAppWithToken(token) {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      devTools: isDev,
    },
  })

  mainWindow.loadFile('index.html')

  if (!isDev) {
    // Check for updates right away
    autoUpdater.addAuthHeader(`Bearer ${token}`)
    autoUpdater.checkForUpdatesAndNotify()

    // Check for updates periodically
    setInterval(
      autoUpdater.checkForUpdatesAndNotify,
      1000 * 60 * 60 * 3, // 3 hours in ms
    )
  }
}

app.whenReady().then(() => gateAppLaunchWithLicense(launchAppWithToken))

app.on('window-all-closed', () => app.quit())
