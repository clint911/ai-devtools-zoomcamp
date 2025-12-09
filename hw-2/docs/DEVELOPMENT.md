# Development Guide

> Complete guide for local development and contributing to CODE_COLLAB

## 📑 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Common Tasks](#common-tasks)
- [Coding Standards](#coding-standards)

---

## 📋 Prerequisites

### Required

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **Git**

### Optional

- **Docker Desktop** (for containerized development)
- **VS Code** (recommended IDE)

### Verify Installation

```bash
node --version  # Should be >= v20.0.0
npm --version   # Should be >= 10.0.0
git --version
```

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/code-collab.git
cd code-collab
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Return to root
cd ..
```

### 3. Run Development Server

```bash
# From root directory - runs both frontend and backend
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

---

## 📁 Project Structure

```
code-collab/
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── LandingPage.tsx
│   │   │   ├── EditorPage.tsx
│   │   │   └── OutputConsole.tsx
│   │   ├── App.tsx          # Root component
│   │   ├── App.css          # App-specific styles
│   │   ├── index.css        # Brutalist design system
│   │   └── main.tsx         # Entry point
│   ├── index.html           # HTML template
│   ├── vite.config.ts       # Vite configuration
│   └── package.json
│
├── backend/                  # NestJS application
│   ├── src/
│   │   ├── app.controller.ts    # REST API controller
│   │   ├── app.module.ts        # Root module
│   │   ├── session.service.ts   # Session management
│   │   ├── session.gateway.ts   # WebSocket gateway
│   │   ├── types.ts             # TypeScript types
│   │   └── main.ts              # Server entry point
│   ├── test/
│   │   └── app.e2e-spec.ts     # Integration tests
│   └── package.json
│
├── docs/                     # Documentation
│   ├── DEPLOYMENT.md        # Deployment guide
│   ├── DEVELOPMENT.md       # This file
│   ├── API.md               # API reference
│   ├── ARCHITECTURE.md      # System design
│   └── CHANGELOG.md         # Version history
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml        # CI/CD pipeline
│
├── Dockerfile               # Production container
├── docker-compose.yml       # Local Docker setup (optional)
├── openapi.yaml            # OpenAPI specification
├── README.md               # Main documentation
├── LICENSE                 # MIT License
└── CONTRIBUTING.md         # Contribution guidelines
```

---

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 5.x | Build tool & dev server |
| Monaco Editor | Latest | Code editor component |
| Socket.io Client | Latest | Real-time communication |
| Pyodide | 0.24.1 | Python WASM execution |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| NestJS | 11.x | Node.js framework |
| TypeScript | 5.x | Type safety |
| Socket.io | Latest | WebSocket server |
| Express | Built-in | HTTP server |

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting  
- **Jest** - Testing framework
- **Supertest** - HTTP testing
- **Concurrently** - Run multiple commands

---

## 🔄 Development Workflow

### Running Services Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev  # Watch mode with hot reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev  # Vite dev server with HMR
```

### Running Both Together

```bash
# From root directory
npm run dev
```

This uses `concurrently` to run both services simultaneously.

### Development Mode Features

**Frontend (Vite):**
- ✅ Hot Module Replacement (HMR)
- ✅ Fast refresh
- ✅ Source maps
- ✅ Error overlay

**Backend (NestJS):**
- ✅ Watch mode (auto-restart on changes)
- ✅ Debug mode available
- ✅ Detailed error messages

---

## 🧪 Testing

### Backend Integration Tests

```bash
cd backend

# Run E2E tests
npm run test:e2e

# Run with coverage
npm run test:cov

# Watch mode
npm run test:watch
```

**Current Tests (7 total):**
- REST API tests (4)
  - Session creation
  - Session retrieval
  - 404 handling
  - Code updates
  
- WebSocket tests (3)
  - User joins session
  - Real-time code sync
  - User presence updates

### Frontend Tests

```bash
cd frontend

# Run tests (when implemented)
npm test

# Watch mode
npm test -- --watch
```

### Manual Testing

1. **Create Session:**
   - Go to http://localhost:5173
   - Click "Create New Session"
   - Verify Monaco editor loads

2. **Test Real-time Sync:**
   - Copy session URL
   - Open in another browser/incognito
   - Type in one window
   - Verify changes appear in other window

3. **Test Code Execution:**
   - Write JavaScript code
   - Click "Execute"
   - Verify output in console

4. **Test Python:**
   - Switch to Python
   - Wait for Pyodide to load
   - Execute Python code

---

## 🔨 Common Tasks

### Adding a New Frontend Component

```typescript
// frontend/src/components/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  title: string;
}

const MyComponent = ({ title }: MyComponentProps) => {
  return (
    <div className="component">
      <h2>{title}</h2>
    </div>
  );
};

export default MyComponent;
```

### Adding a New API Endpoint

```typescript
// backend/src/app.controller.ts
@Get('api/sessions/:id/users')
getSessionUsers(@Param('id') id: string) {
  const session = this.sessionService.getSession(id);
  if (!session) {
    throw new NotFoundException('Session not found');
  }
  return { users: session.users };
}
```

### Adding a New WebSocket Event

```typescript
// backend/src/session.gateway.ts
@SubscribeMessage('cursor-move')
handleCursorMove(
  @MessageBody() data: { sessionId: string; position: any },
  @ConnectedSocket() client: Socket,
) {
  client.to(data.sessionId).emit('cursor-update', {
    userId: client.id,
    position: data.position,
  });
}
```

### Modifying the Design System

```css
/* frontend/src/index.css */
:root {
  /* Add new color variable */
  --color-accent-new: #ff00ff;
  
  /* Add new utility class */
  .text-accent-new {
    color: var(--color-accent-new);
  }
}
```

---

## 📝 Coding Standards

### TypeScript

**Use strict types:**
```typescript
// ✅ Good
interface SessionData {
  id: string;
  code: string;
  language: 'javascript' | 'python';
}

// ❌ Avoid
const session: any = { ... };
```

**Explicit return types:**
```typescript
// ✅ Good
function getSession(id: string): Session | null {
  return sessions.get(id) ?? null;
}

// ❌ Avoid
function getSession(id) {
  return sessions.get(id);
}
```

### React Components

**Functional components with TypeScript:**
```typescript
// ✅ Good
interface EditorProps {
  code: string;
  language: string;
  onChange: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({ code, language, onChange }) => {
  return <MonacoEditor value={code} language={language} onChange={onChange} />;
};
```

**Use hooks properly:**
```typescript
// ✅ Good
const [code, setCode] = useState<string>('');
const [loading, setLoading] = useState<boolean>(true);

useEffect(() => {
  // Effect logic
  return () => {
    // Cleanup
  };
}, [dependencies]);
```

### File Naming

- **React components**: PascalCase - `EditorPage.tsx`
- **Utilities**: camelCase - `sessionUtils.ts`
- **Styles**: kebab-case - `editor-page.css`
- **Constants**: UPPER_SNAKE_CASE - `API_ENDPOINTS.ts`

### Code Organization

**Imports order:**
```typescript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';

// 2. Internal modules
import { SessionService } from './session.service';
import { User, Session } from './types';

// 3. Styles
import './styles.css';
```

### Comments

```typescript
// ✅ Good - Explain WHY, not WHAT
// Debounce to avoid overwhelming the WebSocket server
const debouncedSave = debounce(saveCode, 300);

// ❌ Avoid - Obvious comments
// Set code to new value
setCode(newValue);
```

---

## 🔍 Debugging

### Frontend Debugging

**Browser DevTools:**
```javascript
// Add breakpoints in browser
debugger;

// Console logging
console.log('[Editor] Code changed:', newCode);
```

**React DevTools:**
- Install React DevTools browser extension
- Inspect component state and props

### Backend Debugging

**VS Code Debug Configuration:**
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug NestJS",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "start:debug"],
  "console": "integratedTerminal"
}
```

**Logging:**
```typescript
import { Logger } from '@nestjs/common';

private readonly logger = new Logger(SessionGateway.name);

this.logger.log(`User ${client.id} joined session ${sessionId}`);
this.logger.error(`Error in session ${sessionId}`, error.stack);
```

---

## 🔗 Useful Commands

```bash
# Lint code
npm run lint

# Format code
npm run format

# Build for production
cd frontend && npm run build
cd backend && npm run build

# Clean dependencies
rm -rf node_modules frontend/node_modules backend/node_modules
npm install

# Update dependencies
npm update
cd frontend && npm update
cd backend && npm update
```

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Monaco Editor API](https://microsoft.github.io/monaco-editor/)
- [Socket.io Documentation](https://socket.io/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🐛 Common Issues

**Issue:** Port already in use

```bash
# Find process using port
lsof -i :5173
lsof -i :3001

# Kill process
kill -9 <PID>
```

**Issue:** Monaco editor not loading

- Check browser console for errors
- Verify Pyodide CDN script in index.html
- Clear browser cache

**Issue:** WebSocket connection fails

- Verify backend is running on port 3001
- Check CORS settings in backend/src/main.ts
- Check browser console for connection errors

---

Need more help? Check [CONTRIBUTING.md](../CONTRIBUTING.md) or open a [Discussion](https://github.com/YOUR_USERNAME/code-collab/discussions)!
