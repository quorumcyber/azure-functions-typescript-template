# Azure Functions Typescript Template

This repository is an example setup for Typescript Azure Functions projects.

`tsc` will complile the typescript files into a `dist` folder that is ignored by git.
In order for the functions to reference the compiled files, the `scriptFile` property in its `function.json` needs to point to the compiled `index.js` inside of the `dist` folder.

We use the `azurite` package to run a local Azure Storage emulator so event-based triggers such as timers can store locks properly in a local dev environment.

When running the app locally, `tsc` will be run in watch mode to automatically recompile the project when changes are made. Since the entire project will then also exist inside the `dist` folder, imports will still resolve inside the built directory meaning changes should be reflected automatically when developing locally using `func start`.

We use a packaged called `concurrently` to run `tsc`, `func start` and `azurite` in parallel for local development, so you only need to run `npm start` to run the project locally. 

Tests are run using `jest` and `ts-jest` and can be run using `npm test`.

Scripts can be run using `ts-node [path-to-file]`. The `ts-node` package should be automatically installed after container creation, but if not, you can install it using `npm install -g ts-node typescript '@types/node'`.

## Deployment Pipelines

To setup the deployment pipelines there are some simple find / replace steps to follow globally:

 - Rename `INSERT_REPO_NAME` to the name of the repository
 - Rename `INSERT_DEV_PUBLISH_PROFILE_NAME` to the name of the publish profile in Azure, i.e. `dev-my-test-fa`
 - Rename `INSERT_STG_PUBLISH_PROFILE_NAME` to the name of the publish profile in Azure, i.e. `stg-my-test-fa`
 - Rename `INSERT_PROD_PUBLISH_PROFILE_NAME` to the name of the publish profile in Azure, i.e. `prod-my-test-fa`
 - Rename `INSERT_DEV_APP_NAME` to the name of the app in dev in Azure, i.e. `dev-my-test-fa`
 - Rename `INSERT_STG_APP_NAME` to the name of the app in dev in Azure, i.e. `stg-my-test-fa`
 - Rename `INSERT_PROD_APP_NAME` to the name of the app in dev in Azure, i.e. `prod-my-test-fa`

## Environment Variables

Search for "Application environment variables" and populate the environment variables with the correct values, ensuring that the `local.settings.json` file is updated with the same values, as well as the `EXAMPLE.local.settings.json` file.