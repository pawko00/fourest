# Contributing to FocusForest

First off, thank you for considering contributing to FocusForest! 🌳

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots if possible**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and explain which behavior you expected to see instead**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Follow the TypeScript styleguide
* Include screenshots and animated GIFs in your pull request whenever possible
* End all files with a newline

## Development Process

### 1. Fork & Clone

```bash
git clone https://github.com/your-username/focusforest.git
cd focusforest
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming convention:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests

### 3. Setup Development Environment

```bash
# Install dependencies
npm run install:all

# Start development servers
npm run dev

# Or use Docker
docker-compose up -d
```

### 4. Make Your Changes

* Write clean, readable code
* Follow existing code style
* Add comments for complex logic
* Update documentation if needed
* Add tests if applicable

### 5. Commit Your Changes

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add ambient sounds feature"
git commit -m "fix: resolve timer not stopping issue"
git commit -m "docs: update setup instructions"
```

### 6. Push & Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### TypeScript Styleguide

* Use TypeScript for all new code
* Use meaningful variable names
* Prefer `const` over `let`
* Use arrow functions for callbacks
* Add type annotations for function parameters
* Use interfaces for object types

Example:
```typescript
interface User {
  id: string;
  email: string;
  username: string;
}

const fetchUser = async (userId: string): Promise<User> => {
  // Implementation
};
```

### React Component Styleguide

* Use functional components with hooks
* One component per file
* Use PascalCase for component names
* Use descriptive prop names
* Extract complex logic into custom hooks

Example:
```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  isLoading = false 
}) => {
  return (
    <button onClick={onClick} disabled={isLoading}>
      {isLoading ? 'Loading...' : label}
    </button>
  );
};
```

### CSS/Tailwind Styleguide

* Use Tailwind utility classes
* Follow mobile-first approach
* Use dark mode classes where appropriate
* Extract repeated patterns into components

```tsx
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
  <h2 className="text-2xl font-bold mb-4">Title</h2>
</div>
```

## Project Structure

```
focusforest/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── entities/       # Database models
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── store/          # State management
│   │   ├── lib/            # Libraries & utilities
│   │   └── types/          # TypeScript types
│   └── package.json
│
└── k8s/                    # Kubernetes configs
```

## Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Writing Tests

* Write tests for new features
* Update tests for bug fixes
* Aim for >80% code coverage
* Use descriptive test names

Example:
```typescript
describe('User Authentication', () => {
  it('should hash password before saving', async () => {
    // Test implementation
  });

  it('should return JWT token on successful login', async () => {
    // Test implementation
  });
});
```

## Documentation

* Update README.md if changing functionality
* Update SETUP.md if changing setup process
* Add JSDoc comments for public functions
* Update API documentation for endpoint changes

## Questions?

Feel free to ask questions by:
* Opening an issue
* Commenting on existing issues
* Reaching out via email

## Recognition

Contributors will be added to the README.md file.

Thank you for contributing to FocusForest! 🌳✨
