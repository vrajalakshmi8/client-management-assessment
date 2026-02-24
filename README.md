# Client Management Assessment

This repository contains a full-stack client management application with a Java Spring Boot backend and an Angular frontend.

## Project Structure

- `client-management/` - Spring Boot backend application ([README](client-management/README.md))
- `client-management-frontend/` - Angular frontend application ([README](client-management-frontend/README.md))

## Backend (client-management)

### Prerequisites
- **Java 21** (JDK 21 or later)
- **Maven 3.6+** (or use the included `mvnw` wrapper)

### Setup and Run

1. Navigate to the backend directory:
   ```bash
   cd client-management
   ```

2. Build the project:
   ```bash
   ./mvnw clean install
   ```

3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

4. The backend will start on `http://localhost:8080`

### Run Tests
```bash
./mvnw test
```

### Test Coverage
```bash
./mvnw clean test jacoco:report
```
Coverage reports will be available in `target/site/jacoco/index.html`

## Frontend (client-management-frontend)

### Prerequisites
- **Node.js**: v18 or higher ([Download](https://nodejs.org/))
- **npm**: v9 or higher (comes with Node.js)
- **Angular CLI**: v20 or higher (`npm install -g @angular/cli`)

### Setup and Run

1. Navigate to the frontend directory:
   ```bash
   cd client-management-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:4200`

### Run Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
```
Coverage reports will be available in `coverage/jest/lcov-report/index.html`

### Build for Production
```bash
npm run build
```
