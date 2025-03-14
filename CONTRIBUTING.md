# Contributing to x-sdk-ts

Thank you for your interest in contributing to x-sdk-ts! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report, please check the existing issues to see if the problem has already been reported. If it hasn't, create a new issue with a clear title and description, including:

- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots or code snippets if applicable
- Environment details (OS, Node.js version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- A clear and descriptive title
- A detailed explanation of the proposed functionality
- Any potential implementation details you have in mind
- Why this enhancement would be useful to most users

### Pull Requests

1. Fork the repository
2. Create a new branch for your feature or bugfix (`git checkout -b feature/your-feature` or `git checkout -b fix/your-bugfix`)
3. Make your changes
4. Run tests to ensure your changes don't break existing functionality
5. Commit your changes with clear, descriptive commit messages
6. Push your branch to your fork
7. Submit a pull request to the main repository

## Development Workflow

### Setting Up the Development Environment

1. Clone the repository: `git clone https://github.com/yourusername/x-sdk-ts.git`
2. Install dependencies: `npm install`
3. Build the project: `npm run build`

### Running Tests

- Run all tests: `npm test`
- Run tests with coverage: `npm run test:coverage`

### Coding Standards

- Follow the existing code style
- Write clear, descriptive comments using JSDoc format
- Include unit tests for new functionality
- Ensure all tests pass before submitting a pull request

## Git Commit Guidelines

We follow conventional commits for our commit messages:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

Example: `feat: add support for media upload with alt text`

## Documentation

- Update documentation to reflect any changes you make
- Use JSDoc comments for all public methods and classes
- Include examples where appropriate

## Questions?

If you have any questions or need help, please open an issue or reach out to the maintainers.

Thank you for contributing to x-sdk-ts! 