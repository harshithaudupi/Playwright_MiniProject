# Playwright MiniProject

This project automates the process of interacting with the Rediff website using Playwright. It includes test cases for validating page titles, handling multiple windows, and filling out forms using JSON data.

## Project Structure

```
├── .gitignore
├── package.json
├── playwright.config.js
├── inputs/
│   └── createAccountInputs.json
├── outputs/
│   └── create_acc_links.json
├── POM/
│   ├── HomePage.js
│   ├── CreateAccountPage.js
├── tests/
│   └── rediff.spec.js
├── allure-results/
├── allure-report/
```

### Key Files

- **`POM/HomePage.js`**: Contains methods for interacting with the Rediff homepage.
- **`POM/CreateAccountPage.js`**: Contains methods for interacting with the Create Account page.
- **`tests/rediff.spec.js`**: Contains test cases for validating functionality.
- **`inputs/createAccountInputs.json`**: Stores input data for form fields.
- **`outputs/create_acc_links.json`**: Stores extracted links from the Create Account page.

## Prerequisites

- Node.js installed on your system.
- Playwright installed as a dependency.
- Allure installed for generating test reports.


## Scripts

- **Run Tests**:
  ```bash
  npm run test
  ```

- **Generate Allure Report**:
  ```bash
  npm run alluregen
  ```

- **Open Allure Report**:
  ```bash
  npm run allureopen
  ```

## Test Cases

### 1. Validate Create Account Page Title and Store Links
- Validates the page title.
- Extracts all links from the Create Account page and stores them in `outputs/create_acc_links.json`.

### 2. Handle Terms and Conditions Window
- Opens and validates the Terms and Conditions window.

### 3. Interact with Multiple Windows
- Handles both Terms and Conditions and Privacy Policy windows.

### 4. Handling Input Fields and Checkbox
- Fills out the Create Account form using data from `inputs/createAccountInputs.json`.

## Reporting

Test results are stored in the `allure-results` directory. Use the `npm run alluregen` and `npm run allureopen` commands to generate and view the Allure report.

