# Architecture

> System design and technical architecture of CODE_COLLAB

## System Overview

```
┌──────────────────────────────────────────────────────┐
│                    User Browser                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │   React UI  │  │   Monaco    │  │   Pyodide   │  │
│  │             │  │   Editor    │  │   (Python)  │  │
│  └──────┬──────┘  └──────┬──────┘  └─────────────┘  │
│         │                │                           │
│         ▼                ▼                           │
│  ┌─────────────────────────────────────────────────┐│
│  │            Socket.io Client                      ││
│  └──────────────────────┬──────────────────────────┘│
└─────────────────────────┼───────────────────────────┘
                          │ WebSocket
                          ▼
┌─────────────────────────────────────────────────────┐
│                   nginx (Port 80)                    │
│  ┌────────────────┐  ┌────────────────────────────┐ │
│  │ Static Files   │  │ Proxy: /api, /socket.io    │ │
│  │ Route: /       │  │ → localhost:3001           │ │
│  └────────────────┘  └────────────────────────────┘ │
└─────────────────────────┬───────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                NestJS Backend (Port 3001)            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   REST API  │  │  WebSocket  │  │   Session   │ │
│  │  Controller │  │   Gateway   │  │   Service   │ │
│  └─────────────┘  └─────────────┘  └──────┬──────┘ │
│                                           │         │
│                                    ┌──────▼──────┐  │
│                                    │  In-Memory  │  │
│                                    │   Sessions  │  │
│                                    └─────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Components

### Frontend Stack
| Component | Technology | Purpose |
|-----------|------------|---------|
| UI Framework | React 19 | Component-based UI |
| Build Tool | Vite | Fast dev server & bundling |
| Code Editor | Monaco Editor | VS Code-quality editing |
| Real-time | Socket.io Client | WebSocket communication |
| Python Runtime | Pyodide (WASM) | In-browser Python execution |
| Styling | Vanilla CSS | Brutalist design system |

### Backend Stack
| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | NestJS | Structured Node.js server |
| WebSocket | Socket.io | Real-time bidirectional |
| HTTP | Express | REST API endpoints |
| Storage | In-memory Map | Session data (MVP) |

### Infrastructure
| Component | Technology | Purpose |
|-----------|------------|---------|
| Reverse Proxy | nginx | Route traffic, serve static |
| Container | Docker | Portable deployment |
| CI/CD | GitHub Actions | Automated testing & deploy |

## Data Flow

### Real-time Collaboration
```
User A types → onChange event → debounce (300ms)
    → socket.emit('code-change') → Server
    → broadcast to room → User B receives
    → socket.on('code-update') → Update editor
```

### Code Execution
```
JavaScript:
  Code → eval() → capture console.log → display output

Python:
  Code → Pyodide.runPython() → capture stdout → display output
```

## Session Lifecycle

```
1. Create Session (POST /api/sessions)
   └── Generate unique ID → Store in memory → Return ID

2. User Joins (WebSocket: join-session)
   └── Add to socket room → Add to users list → Send initial state

3. Code Changes (WebSocket: code-change)
   └── Update session → Broadcast to room

4. User Leaves (WebSocket: disconnect)
   └── Remove from users → Broadcast update
```

## Security Considerations

| Aspect | Current | Recommended |
|--------|---------|-------------|
| Code Execution | Client-side only | ✅ Secure |
| Session Access | Public links | Consider auth |
| API | No rate limiting | Add throttling |
| CORS | Open (*) | Restrict to domain |

## Scaling Path

**Current (MVP):**
- Single instance
- In-memory sessions
- No persistence

**Production Ready:**
- Add Redis for session storage
- Add PostgreSQL for persistence
- Enable horizontal scaling
- Implement sticky sessions for WebSocket
