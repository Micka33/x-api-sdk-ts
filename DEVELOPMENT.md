## Getting Started

1. Install Node
  - Node.js v23.7.0
2. Install dependencies
  ```sh
  npm install
  ```

## Run the tests

1. Set the environment variables
  - Create a `.env` file in the root of the project and set the environment variables.
  - Use the `.env.example` file to see which variables you need to set.

2. Run the tests
  ```
  npm run test
  ```

## Generate Fixtures

1. Set the environment variables
  - Create a `.env` file in the root of the project and set the environment variables.
  - Use the `.env.example` file to see which variables you need to set.

2. Run the tests
  ```
  npm run test
  # or for a specific spec file
  npm run test -- tests/integration/users.spec.ts
  # or for a specific test in a spec file
  npm run test -- tests/integration/users.spec.ts -t "getMe"
  ```
