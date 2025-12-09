# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.0.0] - 2025-12-09

### 🎉 Initial Release

#### Added
- **Real-time collaborative code editing** - Multiple users can edit simultaneously
- **Monaco Editor integration** - Professional VS Code-quality code editor
- **JavaScript execution** - Run JavaScript directly in browser
- **Python execution** - Run Python via Pyodide WASM
- **Session management** - Create and share coding sessions via links
- **WebSocket synchronization** - Real-time code updates across all users
- **User presence** - See who's connected to the session
- **Brutalist design system** - Hacker-centric neobrutalist UI
- **Responsive layout** - Works on desktop, tablet, and mobile

#### Technical
- React 19 + TypeScript frontend
- NestJS + TypeScript backend
- Socket.io for real-time communication
- Multi-stage Docker build with nginx
- GitHub Actions CI/CD pipeline
- 7 integration tests (100% passing)
- OpenAPI 3.0 specification

#### Documentation
- Comprehensive README
- Deployment guide (Docker, Coolify, Railway)
- Development guide
- API reference
- Architecture documentation
- Contributing guidelines

---

## Future Releases

### Planned for v1.1.0
- [ ] Session persistence (database)
- [ ] User cursors (see where others are typing)
- [ ] Code formatting (Prettier)
- [ ] Session history

### Planned for v2.0.0
- [ ] User authentication
- [ ] More languages (TypeScript, Go, Rust)
- [ ] Video/audio chat
- [ ] Code version history
