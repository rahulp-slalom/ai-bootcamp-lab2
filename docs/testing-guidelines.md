# Testing Guidelines

## Overview
This document outlines the testing standards and requirements for the task management application. All code contributions must include appropriate tests to ensure reliability, maintainability, and quality.

## Testing Philosophy

### Core Principles
- **Test-Driven Development (TDD)**: Write tests before or alongside implementation when appropriate
- **Comprehensive Coverage**: Aim for high test coverage across all application layers
- **Maintainable Tests**: Write clear, well-structured tests that are easy to understand and update
- **Fast Feedback**: Tests should run quickly to provide immediate feedback to developers
- **Reliable Tests**: Tests should be deterministic and not flaky

## Testing Requirements

### Mandatory Testing for New Features
- **All new features MUST include appropriate tests** covering:
  - Unit tests for individual functions and components
  - Integration tests for feature workflows
  - End-to-end tests for critical user journeys (when applicable)
- Tests must be included in the same pull request as the feature implementation
- Code reviews should verify adequate test coverage

### Test Coverage Targets
- **Minimum coverage**: 80% overall code coverage
- **Critical paths**: 100% coverage for business logic and data persistence
- **UI components**: Cover core functionality and user interactions
- **Error handling**: Test error cases and edge conditions

## Types of Tests

### 1. Unit Tests

#### Purpose
- Test individual functions, methods, and components in isolation
- Verify correct behavior for specific inputs and edge cases
- Test error handling and validation logic

#### Requirements
- **Fast**: Unit tests should run in milliseconds
- **Isolated**: Mock external dependencies (APIs, databases, file systems)
- **Focused**: Test one thing per test case
- **Independent**: Tests should not depend on each other

#### What to Test
- Pure functions and utility methods
- React components (rendering, props, state changes)
- Business logic and calculations
- Input validation and sanitization
- Error handling and edge cases

#### Tools and Frameworks
- **Frontend**: Jest + React Testing Library
- **Backend**: Jest + Supertest
- **Mocking**: Jest mock functions and modules

#### Example Structure
```javascript
describe('TaskService', () => {
  describe('createTask', () => {
    it('should create a task with valid data', () => {
      // Arrange
      const taskData = { title: 'Test Task', dueDate: '2026-02-01' };
      
      // Act
      const result = createTask(taskData);
      
      // Assert
      expect(result).toHaveProperty('id');
      expect(result.title).toBe('Test Task');
    });

    it('should throw error for invalid title', () => {
      // Arrange
      const taskData = { title: '', dueDate: '2026-02-01' };
      
      // Act & Assert
      expect(() => createTask(taskData)).toThrow('Title is required');
    });
  });
});
```

### 2. Integration Tests

#### Purpose
- Test how multiple units work together
- Verify interactions between components, services, and data layers
- Test API endpoints and database operations
- Validate feature workflows across multiple components

#### Requirements
- **Realistic**: Use real implementations where possible
- **Controlled**: Use test databases or mock external services
- **Comprehensive**: Test complete feature workflows
- **Clean**: Reset state between tests

#### What to Test
- API endpoint functionality (request/response cycles)
- Database operations (CRUD operations)
- Component interactions and data flow
- Service layer integration with data access layer
- Authentication and authorization flows

#### Tools and Frameworks
- **Frontend**: Jest + React Testing Library (with context providers)
- **Backend**: Jest + Supertest + Test Database
- **Test Data**: Factory functions or fixtures

#### Example Structure
```javascript
describe('Task API Integration', () => {
  beforeEach(async () => {
    // Setup test database
    await setupTestDatabase();
  });

  afterEach(async () => {
    // Cleanup test database
    await cleanupTestDatabase();
  });

  it('should create and retrieve a task via API', async () => {
    // Create task
    const createResponse = await request(app)
      .post('/api/tasks')
      .send({ title: 'Integration Test Task', priority: 'high' })
      .expect(201);

    const taskId = createResponse.body.id;

    // Retrieve task
    const getResponse = await request(app)
      .get(`/api/tasks/${taskId}`)
      .expect(200);

    expect(getResponse.body.title).toBe('Integration Test Task');
    expect(getResponse.body.priority).toBe('high');
  });
});
```

### 3. End-to-End (E2E) Tests

#### Purpose
- Test complete user workflows from the user's perspective
- Verify the entire application stack works together
- Simulate real user interactions
- Catch issues that unit and integration tests might miss

#### Requirements
- **User-Focused**: Test from the user's point of view
- **Critical Paths**: Focus on essential user journeys
- **Stable**: Use reliable selectors and wait strategies
- **Maintainable**: Use page object pattern or component objects

#### What to Test
- Critical user workflows (create task, edit task, mark complete)
- Authentication and authorization flows
- Multi-page interactions
- Form submissions and validations
- Error handling and user feedback
- Responsive behavior across devices

#### Tools and Frameworks
- **Recommended**: Playwright or Cypress
- **Fallback**: Selenium WebDriver
- **CI/CD Integration**: Run E2E tests in pipeline

#### Example Structure
```javascript
describe('Task Management E2E', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:3000');
  });

  it('should create a new task with due date', async () => {
    // Click add task button
    await page.click('[data-testid="add-task-button"]');

    // Fill in task details
    await page.fill('[data-testid="task-title-input"]', 'E2E Test Task');
    await page.fill('[data-testid="task-due-date-input"]', '2026-02-15');
    await page.selectOption('[data-testid="task-priority-select"]', 'high');

    // Submit form
    await page.click('[data-testid="save-task-button"]');

    // Verify task appears in list
    await expect(page.locator('text=E2E Test Task')).toBeVisible();
  });
});
```

## Test Organization and Structure

### File Organization
```
packages/
  frontend/
    src/
      components/
        TaskList.js
        __tests__/
          TaskList.test.js
      services/
        taskService.js
        __tests__/
          taskService.test.js
  backend/
    src/
      controllers/
        taskController.js
      __tests__/
        integration/
          taskAPI.test.js
        unit/
          taskController.test.js
  e2e/
    tests/
      task-management.spec.js
```

### Naming Conventions
- **Test Files**: `ComponentName.test.js` or `functionName.test.js`
- **Test Suites**: Use `describe()` with component/module name
- **Test Cases**: Use `it()` or `test()` with clear, descriptive names
- **Test IDs**: Use `data-testid` attribute for E2E selectors

### Test Case Naming
- Use descriptive names that explain what is being tested
- Follow pattern: "should [expected behavior] when [condition]"
- Examples:
  - ✅ `should display error message when title is empty`
  - ✅ `should mark task as complete when checkbox is clicked`
  - ❌ `test 1`
  - ❌ `it works`

## Best Practices

### Test Maintainability

#### 1. DRY Principle (Don't Repeat Yourself)
- Extract common test setup into `beforeEach()` or helper functions
- Use factory functions for test data creation
- Create reusable test utilities and fixtures

#### 2. Clear and Readable Tests
- Use Arrange-Act-Assert (AAA) pattern
- Add comments for complex test logic
- Use descriptive variable names
- Keep tests focused and concise

#### 3. Avoid Test Interdependence
- Each test should run independently
- Clean up state after each test
- Don't rely on execution order

#### 4. Use Meaningful Assertions
- Prefer specific assertions over generic ones
- Use `toEqual()` for objects, `toBe()` for primitives
- Include meaningful error messages

#### 5. Mock Thoughtfully
- Mock external dependencies and side effects
- Don't over-mock (test real implementations when possible)
- Keep mocks simple and focused
- Reset mocks between tests

### Testing Anti-Patterns to Avoid

❌ **Testing Implementation Details**
- Don't test internal state or private methods
- Focus on public API and user-observable behavior

❌ **Flaky Tests**
- Avoid tests that pass/fail randomly
- Use proper waiting strategies for async operations
- Don't rely on timeouts or specific timing

❌ **Overly Complex Tests**
- Keep tests simple and focused
- Split complex tests into multiple smaller tests
- Avoid testing too many things in one test

❌ **Insufficient Error Testing**
- Always test error cases and edge conditions
- Verify error messages and handling

❌ **Copy-Paste Tests**
- Don't duplicate test code
- Use parameterized tests for similar scenarios

## Testing Workflow

### Pre-Commit
1. Run unit tests locally: `npm test`
2. Ensure all tests pass
3. Check test coverage: `npm test -- --coverage`

### Pull Request
1. All tests must pass in CI/CD pipeline
2. Code coverage must meet minimum thresholds
3. New features must include appropriate tests
4. Reviewers should verify test quality and coverage

### Continuous Integration
1. Run all unit and integration tests on every commit
2. Run E2E tests on pull requests to main branch
3. Generate and publish coverage reports
4. Fail build if coverage drops below threshold

## Test Data Management

### Test Fixtures
- Create reusable test data fixtures
- Use factory functions for complex objects
- Store fixtures in `__fixtures__` directory

### Database Testing
- Use in-memory database or test database for integration tests
- Reset database state before each test
- Use database migrations and seeds

### Mocking External Services
- Mock external APIs and third-party services
- Use consistent mock data across tests
- Document mock behavior and expectations

## Performance Considerations

### Test Execution Speed
- Unit tests should complete in milliseconds
- Integration tests should complete in seconds
- E2E tests may take minutes but should be optimized

### Optimization Strategies
- Run tests in parallel when possible
- Use watch mode during development
- Skip slow tests during development (but run in CI)
- Cache dependencies and test artifacts

## Accessibility Testing

### Requirements
- Test keyboard navigation in E2E tests
- Verify ARIA labels and roles
- Test with screen reader simulation tools
- Validate color contrast in visual regression tests

### Tools
- jest-axe for automated accessibility testing
- Lighthouse CI for accessibility audits
- Manual testing with screen readers

## Documentation

### Test Documentation Requirements
- Document complex test scenarios
- Explain non-obvious test setup or teardown
- Maintain README in test directories for context
- Document known testing limitations or gaps

### Code Comments
- Add comments for complex assertions
- Explain why a test is necessary
- Document workarounds or temporary solutions

## Continuous Improvement

### Regular Review
- Review and refactor tests regularly
- Remove obsolete or redundant tests
- Update tests when requirements change
- Address flaky tests immediately

### Metrics to Monitor
- Test coverage percentage
- Test execution time
- Test failure rate
- Flaky test occurrences

### Team Practices
- Share testing knowledge and patterns
- Conduct testing workshops
- Review testing practices in retrospectives
- Celebrate testing improvements
