# Contributing to PrimerGuard

First off, thank you for considering contributing to PrimerGuard! It's people like you that make PrimerGuard such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include screenshots if possible

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* A clear and descriptive title
* A detailed description of the proposed enhancement
* Examples of how the enhancement would be used
* Why this enhancement would be useful to most PrimerGuard users

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code lints
5. Issue that pull request!

## Development Setup

1. Fork and clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a branch for your changes:
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. Make your changes
5. Run tests:
   ```bash
   npm test
   ```
6. Build the project:
   ```bash
   npm run build
   ```

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### TypeScript Styleguide

* Use strict TypeScript
* Document all public methods and interfaces
* Follow the existing code style
* Use meaningful variable names
* Keep functions small and focused

### Documentation Styleguide

* Use [Markdown](https://guides.github.com/features/mastering-markdown/)
* Reference methods and classes in backticks: \`PrimerGuard\`
* Include code examples for new features

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

* `bug` - Issues that are bugs
* `enhancement` - Issues that are feature requests
* `documentation` - Issues or PRs that relate to documentation
* `good first issue` - Good for newcomers
* `help wanted` - Extra attention is needed

## License

By contributing to PrimerGuard, you agree that your contributions will be licensed under its MIT License.
