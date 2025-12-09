# API Reference

> REST and WebSocket API documentation for CODE_COLLAB

## Base URLs

- **Production**: `https://your-app.com`
- **Development**: `http://localhost:3001`

---

## REST API

### Sessions

#### Create Session
```http
POST /api/sessions
Content-Type: application/json

{
  "language": "javascript" | "python"  // Optional, default: javascript
}
```

**Response** `201 Created`
```json
{
  "sessionId": "abc123xy",
  "createdAt": "2025-12-09T10:00:00.000Z"
}
```

---

#### Get Session
```http
GET /api/sessions/:id
```

**Response** `200 OK`
```json
{
  "sessionId": "abc123xy",
  "code": "// Start coding...",
  "language": "javascript",
  "users": [
    { "id": "user_1", "name": "User 1" }
  ],
  "createdAt": "2025-12-09T10:00:00.000Z"
}
```

**Response** `404 Not Found`
```json
{
  "statusCode": 404,
  "message": "Session not found"
}
```

---

#### Get Session Code
```http
GET /api/sessions/:id/code
```

**Response** `200 OK`
```json
{
  "code": "console.log('Hello');",
  "language": "javascript"
}
```

---

#### Update Code
```http
PUT /api/sessions/:id/code
Content-Type: application/json

{
  "code": "console.log('Updated');",
  "language": "javascript"
}
```

**Response** `200 OK`
```json
{
  "success": true
}
```

---

## WebSocket API

Connect to: `ws://localhost:3001` (development) or `wss://your-app.com` (production)

### Client → Server Events

#### join-session
```javascript
socket.emit('join-session', {
  sessionId: 'abc123xy',
  userName: 'John Doe'  // Optional
});
```

#### code-change
```javascript
socket.emit('code-change', {
  sessionId: 'abc123xy',
  code: 'console.log("Hello");'
});
```

#### language-change
```javascript
socket.emit('language-change', {
  sessionId: 'abc123xy',
  language: 'python'
});
```

---

### Server → Client Events

#### initial-state
Received after joining a session.
```javascript
socket.on('initial-state', (data) => {
  // data: { code: string, language: string, users: User[] }
});
```

#### code-update
Received when another user changes code.
```javascript
socket.on('code-update', (data) => {
  // data: { code: string }
});
```

#### language-change
Received when language is switched.
```javascript
socket.on('language-change', (data) => {
  // data: { language: string }
});
```

#### users-update
Received when user list changes.
```javascript
socket.on('users-update', (data) => {
  // data: { users: User[] }
});
```

#### user-joined / user-left
```javascript
socket.on('user-joined', (data) => {
  // data: { userId: string, userName: string }
});

socket.on('user-left', (data) => {
  // data: { userId: string }
});
```

---

## OpenAPI Specification

Full OpenAPI 3.0 spec available at: [openapi.yaml](../openapi.yaml)

---

## Error Codes

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Server Error |

---

## Rate Limits

Currently no rate limits. Consider implementing for production.
