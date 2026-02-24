# Angular Client Management System

Client-Management-Frontend is an Angular 20 application for managing client information. It features search, pagination, sorting, confirmation modals, and robust error handling.


## 🚀 Project Setup

### Prerequisites

Ensure you have the following installed:
- **Node.js**: v18 or higher ([Download](https://nodejs.org/))
- **npm**: v9 or higher (comes with Node.js)
- **Angular CLI**: v20 or higher (`npm install -g @angular/cli`)
- **Git**: Latest version ([Download](https://git-scm.com/))

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/vrajalakshmi8/client-management-assessment.git
cd client-management-frontend
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Environment Configuration

The application is pre-configured to connect to the backend. Update if needed:

**File**: `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1',
  apiEndpoints: {
    clients: '/clients'
  }
};
```

#### 4. Start Development Server

```bash
npm start
# or
ng serve
```

The application will be available at `http://localhost:4200/`


### Verify Installation

1. Open browser to `http://localhost:4200/`
2. You should see the Client Management System
3. If backend is running, you'll see client data
4. If backend is not running, you'll see connection errors

### Build for Production

```bash
npm run build --configuration production
```

Production build will be available in `dist/` directory.


## ✨ Features

### Core Functionality
- ✅ **Client Management** - Create, Read, Update, Delete clients
- 🔍 **Smart Search** - Search with 3-character minimum validation
- 📄 **Pagination** - Server-side pagination with configurable page sizes (10, 25, 50, 100)
- 🔀 **Sorting** - Multi-column sorting with ascending/descending order
- 🎯 **URL State Management** - Pagination and search state preserved in URL query parameters
- 💬 **Confirmation Modals** - User confirmation for destructive operations
- 🎨 **Detail Modal** - Quick view client details without navigation

## 🏗️ High-Level Architecture

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Angular Frontend (Port 4200)             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Presentation Layer                       │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │ Client List│  │ Client Form│  │ Detail Modal│     │  │
│  │  │ Component  │  │ Component  │  │  Component  │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  │         │               │                │            │  │
│  └─────────┼───────────────┼────────────────┼───────────┘  │
│            │               │                │               │
│  ┌─────────▼───────────────▼────────────────▼───────────┐  │
│  │              Service Layer                            │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐ │  │
│  │  │   Client    │  │ Confirmation │  │   Modal     │ │  │
│  │  │   Service   │  │Modal Service │  │  Service    │ │  │
│  │  └─────────────┘  └──────────────┘  └─────────────┘ │  │
│  │         │                                             │  │
│  └─────────┼─────────────────────────────────────────────┘  │
│            │                                                 │
│  ┌─────────▼─────────────────────────────────────────────┐  │
│  │           Core Infrastructure                         │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐ │  │
│  │  │HTTP Error   │  │Logger Service│  │Notification │ │  │
│  │  │Interceptor  │  │              │  │   Service   │ │  │
│  │  └─────────────┘  └──────────────┘  └─────────────┘ │  │
│  └───────────────────────────┬───────────────────────────┘  │
└────────────────────────────────┼───────────────────────────┘
                                 │ HTTP/REST API
                    ┌────────────▼────────────┐
                    │   Spring Boot Backend    │
                    │      (Port 8080)        │
                    │     │
                    └──────────────────────────┘
```

## 🔌 API Endpoints

### Base URL
```
http://localhost:8080/api/v1
```

### Client Endpoints

#### 1. Get All Clients (Paginated)
```http
GET /api/v1/clients?page=0&size=10&orderBy=id&direction=asc&search=john
```

**Query Parameters:**
- `page` (optional): Page number (0-based indexing) - Default: 0
- `size` (optional): Number of items per page - Default: 10
- `orderBy` (optional): Field to sort by (id, fullName, email, etc.)
- `direction` (optional): Sort direction (`asc` or `desc`) - Default: asc
- `search` (optional): Search term (minimum 3 characters)


#### 2. Get Client by ID
```http
GET /api/v1/clients/{id}
```

#### 3. Create New Client
```http
POST /api/v1/clients
Content-Type: application/json
```

#### 4. Update Client
```http
PUT /api/v1/clients/{id}
Content-Type: application/json
```

#### 5. Delete Client
```http
DELETE /api/v1/clients/{id}
```

### Routes
- `/clients` - Client list with search and pagination
- `/clients/new` - Create new client
- `/clients/:id/edit` - Edit client

## 🧪 Testing

The application uses **Jest** as the primary testing framework with comprehensive test coverage.

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (development)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage

Coverage reports are generated in `coverage/jest/` directory with:
- HTML report: `coverage/jest/lcov-report/index.html`

## 🚀 Future Improvements

#### 1. Authentication & Authorization
- **User Authentication**:
  - Login/logout functionality
  - Password reset functionality
  - Multi-factor authentication (MFA)

#### 2. Dashboard & Analytics
- **Dashboard Overview**:
  - Total clients count
  - Active vs inactive clients

#### 3. Enhanced UX/UI
- **Dark Mode**: Toggle between light and dark themes
- **Accessibility**: Full WCAG 2.1 AA compliance
- **Responsive Design**: Enhanced mobile/tablet experience
