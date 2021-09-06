# Example Electron License Gate

A minimal Electron app, showcasing how to add a license "gate" in front of your
app's main window. The gate will only be "unlocked" for licensed users. This
example includes license validation and auto-updates for valid licenses.

![image](https://user-images.githubusercontent.com/6979737/132259034-ee3d61d8-78cb-4b34-8c20-d5235a82fc44.png)

## Running the example app

First up, install dependencies with [`yarn`](https://yarnpkg.comg):

```
yarn
```

Then start the app:

```
yarn start
```

## Demo activation tokens

The following activation tokens are available for demo purposes.

| Status      | Activation token                           |
|:------------|:-------------------------------------------|
| `VALID`     | `activ-663f79148696b378929399bc757548ffv3` |
| `EXPIRED`   | `activ-3d42f2e930217b8121c2dfd52722baafv3` |
| `SUSPENDED` | `activ-2902955badb2e80f7574dce1ad72c703v3` |
| `NOT_FOUND` | `activ-thisisnotavalidactivationtoken`     |

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
