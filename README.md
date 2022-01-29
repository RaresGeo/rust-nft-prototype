Foreword
==============

This project is built on the NEP-171 non fungible token standard very helpfully provided through the near sdk. Virtually all functionality is built in; as a developer you must only learn how it all goes together and how to interact with it.

Starting out, I had no prior knowledge of Rust aside from the fact that it existed. After working on this, not much has changed. I believe this task was meant both as a learning experience and as a way of proving that I can learn; However, I believe it would have been foolhardy and frankly pointless to implement every functionality on my own rather than adhere to the standards. Doing so meant I had to more or less reuse code from the tutorial and provided materials on the documentation, so at first sight it might seem as though the entire project is a simple copy paste. While this was a learning experience, it didn't make me think outside of the box nor did it challenge me and push me to learn more about Rust.
I wouldn't consider it a triviality but it certainly didn't excite me, I would have much preferred to work on something such as a multi signature wallet and have to implement everything myself. 

Having said all of that, this barely scratches the surface and there was a lot I could have expanded on... but most of that would have hardly been near specific, simply front end stuff and other visualisation tools or ways of actually creating an NFT rather than displaying metadata.

Enough of the excuses, here's how to build the project:

Windows users: please visit the [Windows-specific README file](README-Windows.md).

## Prerequisites
Ensure `near-cli` is installed by running:

```
near --version
```

If needed, install `near-cli`:

```
npm install near-cli -g
```

Ensure `Rust` is installed by running:

```
rustc --version
```

If needed, install `Rust`:

```
curl https://sh.rustup.rs -sSf | sh
```

Install dependencies

```
yarn
```
or
```
npm install
```

## Quick Start
To run this project locally:

1. Prerequisites: Make sure you have Node.js ≥ 12 installed (https://nodejs.org), then use it to install yarn: `npm install --global yarn` (or just `npm i -g yarn`)
2. Run the local development server: `yarn && yarn dev` (see package.json for a full list of scripts you can run with yarn)
Note that the dev deployment process involves using `. neardev/dev-account.env`, this may not be available depending on the operating system you are using.
Now you'll have a local development environment backed by the NEAR TestNet! Running yarn dev will tell you the URL you can visit in your browser to see the app.

## Building this contract
To make the build process compatible with multiple operating systems, the build process exists as a script in `package.json`.
There are a number of special flags used to compile the smart contract into the wasm file.
Run this command to build and place the wasm file in the `res` directory:
```bash
npm run build
```

**Note**: Instead of `npm`, users of [yarn](https://yarnpkg.com) may run:
```bash
yarn build
```

### Important
If you encounter an error similar to:
>note: the `wasm32-unknown-unknown` target may not be installed

Then run:

```bash
rustup target add wasm32-unknown-unknown
```

## Using this contract

### Web app

Deploy the smart contract to a specific account created with the NEAR Wallet. Then interact with the smart contract using near-api-js on the frontend.

If you do not have a NEAR account, please create one with [NEAR Wallet](https://wallet.testnet.near.org).

Make sure you have credentials saved locally for the account you want to deploy the contract to. To perform this run the following `near-cli` command:

```
near login
```

Deploy the contract to your NEAR account:

```bash
near deploy --wasmFile res/nft_prototype.wasm --accountId YOUR_ACCOUNT_NAME
```

Build the frontend:

```bash
npm start
```

If all is successful the app should be live at a location specified in the console, usually `http://localhost:1234`.

## Testing
To test run:
```bash
cargo test --package status-message -- --nocapture
```
