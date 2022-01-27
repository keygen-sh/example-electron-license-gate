# Example Electron License Gate

A minimal Electron app, showcasing how to add a license "gate" in front of your
app's main window. The gate will only be "unlocked" for licensed users. This
example includes license validation and auto-updates for valid licenses, and
an unlicensed "evaluation mode."

![image](https://user-images.githubusercontent.com/6979737/132401811-1253f4c3-2410-40b8-8c33-f0b120cb0b2f.png)

## Running the example app

First up, install dependencies with [`yarn`](https://yarnpkg.comg):

```
yarn
```

Then start the app:

```
yarn start
```

## Demo license keys

The following license keys are available for demo purposes.

| Status      | License key                             |
|:------------|:----------------------------------------|
| `VALID`     | `161DEA-E348CE-9EEA17-8BBFBD-4A26EA-V3` |
| `EXPIRED`   | `C47144-EEADCF-920428-7F327A-2CBE9C-V3` |
| `SUSPENDED` | `08887C-DEA1F9-6AD1BE-692693-6037D2-V3` |
| `NOT_FOUND` | `000000-000000-000000-000000-000000-V3` |

## Building and packaging

To build the app:

```
yarn build
```

To package and publish the app:

```
yarn dist
```

## Questions?

Reach out at support@keygen.sh if you have any questions or concerns!
