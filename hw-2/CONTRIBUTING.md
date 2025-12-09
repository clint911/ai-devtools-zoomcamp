# Contributing to CODE_COLLAB

First off, thank you for considering contributing to CODE_COLLAB! It's people like you that make this platform great for everyone.

## 🎯 Ways to Contribute

- 🐛 **Report Bugs** - Help us identify and fix issues
- 💡 **Suggest Features** - Share ideas for improvements
- 📝 **Improve Documentation** - Help others understand the project
- 💻 **Submit Code** - Implement features or fix bugs
- 🧪 **Write Tests** - Improve code quality and coverage
- 🎨 **Design** - Enhance the user interface and experience

## 🚀 Getting Started

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/code-collab.git
   cd code-collab
   ```

3. **Install dependencies**:
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   cd ..
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Access the application** at http://localhost:5173

For detailed development instructions, see [DEVELOPMENT.md](./docs/DEVELOPMENT.md)

## 🔄 Pull Request Process

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes** and commit them:
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

3. **Write or update tests** as needed

4. **Ensure all tests pass**:
   ```bash
   cd backend && npm run test:e2e
   ```

5. **Update documentation** if you've changed functionality

6. **Push to your fork**:
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request** from your fork to our `main` branch

### Pull Request Requirements

- [ ] Code follows the existing style (ESLint, Prettier)
- [ ] Tests pass (`npm run test:e2e`)
- [ ] Documentation is updated
- [ ] Commit messages follow our conventions
- [ ] Branch is up to date with `main`

## 💬 Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, missing semi-colons, etc)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Changes to build process or auxiliary tools

### Examples

```
feat(editor): add code formatting button
fix(websocket): handle reconnection properly
docs(readme): update installation instructions
```

## 📝 Code Style

### TypeScript

- Use TypeScript for all new code
- Follow ESLint rules (run `npm run lint`)
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### React Components

```typescript
// Good
interface EditorPageProps {
  sessionId: string;
}

const EditorPage = ({ sessionId }: EditorPageProps) => {
  // Component logic
};

export default EditorPage;
```

### Backend Code

```typescript
// Good
@Controller('api/sessions')
export class SessionController {
  @Post()
  async createSession(@Body() dto: CreateSessionDto) {
    // Controller logic
  }
}
```

## 🧪 Testing Guidelines

### Writing Tests

- Write tests for new features
- Update tests when modifying existing code
- Aim for meaningful test coverage

### Running Tests

```bash
# Backend E2E tests
cd backend && npm run test:e2e

# Frontend tests (when available)
cd frontend && npm test
```

## 🐛 Reporting Bugs

### Before Submitting

- Check existing [issues](https://github.com/YOUR_USERNAME/code-collab/issues)
- Ensure you're using the latest version
- Try to reproduce in a clean environment

### Bug Report Should Include

1. **Clear title** describing the issue
2. **Steps to reproduce** the problem
3. **Expected behavior**
4. **Actual behavior**
5. **Screenshots** if applicable
6. **Environment details** (OS, browser, Node version)
7. **Error messages** or console logs

Use our [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)

## 💡 Suggesting Features

We love new ideas! Please:

1. Check if the feature has already been suggested
2. Clearly describe the feature and its benefits
3. Explain use cases
4. Consider implementation complexity

Use our [feature request template](.github/ISSUE_TEMPLATE/feature_request.md)

## 📚 Documentation

Good documentation is crucial. When contributing docs:

- Use clear, concise language
- Include code examples
- Add screenshots or diagrams when helpful
- Keep formatting consistent
- Check for spelling and grammar

## 🤝 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Unacceptable behavior:**
- Trolling, insulting comments, or personal attacks
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

## 📞 Questions?

- 💬 Open a [Discussion](https://github.com/YOUR_USERNAME/code-collab/discussions)
- 📧 Email: support@your-domain.com
- 🐛 File an [Issue](https://github.com/YOUR_USERNAME/code-collab/issues)

## 🎉 Recognition

Contributors are recognized in:
- README.md Contributors section
- CHANGELOG.md for their contributions
- GitHub Contributors page

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to CODE_COLLAB! 🚀
