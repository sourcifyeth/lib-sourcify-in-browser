# Sourcify Browser Demo

This project demonstrates how to use the `@ethereum-sourcify/lib-sourcify` library directly within a web browser. It leverages `web-solc` to dynamically fetch and execute the Solidity compiler (`solc`) in the browser.

## How it Works

It demonstrates two primary verification flows:

1.  **Verification via JSON Input**: Manually constructs the `SolidityJsonInput` object required by the compiler.
2.  **Verification via Metadata**: Fetches a Solidity metadata file (`metadata.json`) and uses it to drive the verification process.

In both cases:
*   An implementation of `ISolidityCompiler` from `lib-sourcify` is created using `fetchSolc` from `web-solc`.
*   `Verification` object from `lib-sourcify` is instantiated.
*   The `verification.verify()` method is running the Sourcify verification flow in the browser.

## Running the Demo

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```