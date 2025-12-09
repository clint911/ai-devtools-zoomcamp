# Deployment Guide

> Complete guide for deploying CODE_COLLAB to production environments

## 📑 Table of Contents

- [Quick Deploy Options](#quick-deploy-options)
- [Docker Deployment](#docker-deployment)
- [Coolify Deployment](#coolify-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Other Cloud Platforms](#other-cloud-platforms)
- [Troubleshooting](#troubleshooting)
- [Security & Performance](#security--performance)

---

## 🚀 Quick Deploy Options

### Option 1: Coolify (Recommended)
**Best for:** Self-hosted with automation  
**Time:** 15 minutes  
**Complexity:** Low

### Option 2: Docker
**Best for:** Any server with Docker  
**Time:** 5 minutes  
**Complexity:** Very Low

### Option 3: Railway/Render
**Best for:** Managed deployment  
**Time:** 10 minutes  
**Complexity:** Very Low

---

## 🐳 Docker Deployment

### Architecture

**Base Image:** `node:20-alpine`

**Multi-stage Build:**
1. **frontend-builder** - Builds React frontend
2. **backend-builder** - Builds NestJS backend
3. **Production** - nginx reverse proxy (port 80)

**Why Alpine?**
- Small size (~40MB base vs ~300MB full Node)
- Security (minimal attack surface)
- Fast builds
- Full Node.js support

### Single Port Architecture

```
┌─────────────────────────────────────────┐
│         nginx (Port 80/443)             │
│                                         │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │   Frontend   │  │    Backend      │ │
│  │   (Static)   │  │  (Port 3001)    │ │
│  │   Route: /   │  │  Route: /api    │ │
│  └──────────────┘  │  Route:/socket  │ │
│                    └─────────────────┘ │
└─────────────────────────────────────────┘
```

### Build and Run

```bash
# Build the image
docker build -t code-collab:latest .

# Run the container
docker run -d \\
  --name code-collab \\
  -p 80:80 \\
  code-collab:latest

# Access at http://localhost
```

### Production Run

```bash
# With environment variables
docker run -d \\
  --name code-collab \\
  -p 80:80 \\
  -e PORT=3001 \\
  --restart unless-stopped \\
  code-collab:latest
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  code-collab:
    build: .
    ports:
      - "80:80"
    environment:
      - PORT=3001
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 3s
      retries: 3
```

```bash
# Start with compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## ☁️ Coolify Deployment

### Prerequisites

- Coolify instance running on your VPS
- GitHub repository
- Domain name (optional but recommended)

### Step-by-Step Setup

#### 1. Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/code-collab.git
git push -u origin main
```

#### 2. Create Application in Coolify

1. **Log into Coolify Dashboard**

2. **Create New Resource**
   - Click **"+ New"** → **"Application"**

3. **Source Configuration**
   - **Type**: Public Repository or GitHub (if connected)
   - **Repository**: `https://github.com/yourusername/code-collab`
   - **Branch**: `main` or `master`
   - **Build Pack**: Select **"Dockerfile"**

4. **General Configuration**
   - **Application Name**: `code-collab`
   - **Description**: Real-time collaborative coding platform

5. **Port Configuration**
   - **Port**: `80`
   - **Protocol**: HTTP
   - **Publicly Exposed**: Yes

6. **Domain Configuration** (Recommended)
   - Add your domain: `code-collab.yourdomain.com`
   - Enable **"HTTPS"** for automatic SSL

7. **Deploy**
   - Click **"Deploy"**
   - First build takes ~2-3 minutes

#### 3. Verify Deployment

```bash
# Health check
curl https://your-app-url.com/api/sessions

# Create session test
curl -X POST https://your-app-url.com/api/sessions \\
  -H "Content-Type: application/json" \\
  -d '{"language":"javascript"}'
```

**Browser Test:**
1. Visit your deployment URL
2. Click "Create New Session"
3. Verify Monaco editor loads
4. Open same URL in another browser
5. Verify real-time sync works

---

## 🔄 CI/CD Pipeline

### GitHub Actions Setup

**File:** `.github/workflows/ci-cd.yml` (already created)

**Pipeline Stages:**

```
Push to main
     ↓
Frontend Tests (lint + build)
     ↓
Backend Integration Tests (7 E2E tests)
     ↓
All Pass? → Deploy to Coolify
     ↓
Health Check
     ↓
✅ Live!
```

### Required GitHub Secrets

Add these in: **Settings** → **Secrets and variables** → **Actions**

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `COOLIFY_WEBHOOK_URL` | Deployment webhook | Coolify → App → Webhooks → Create |
| `COOLIFY_TOKEN` | API token (optional) | Coolify → API Tokens |
| `APP_URL` | Deployed app URL | Your domain URL |

### Enable Automated Deployment

1. **Add secrets** to GitHub repository
2. **Push to main** branch
3. **GitHub Actions** automatically:
   - Runs all tests
   - Deploys if tests pass
   - Performs health check

```bash
# Trigger deployment
git push origin main

# Watch in GitHub → Actions tab
```

---

## 🌐 Other Cloud Platforms

### Railway

**Deploy:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Or:** Use Railway's GitHub integration

### Render

1. Connect GitHub repository
2. Select "Docker" as build type
3. Set port to `80`
4. Deploy!

### Fly.io

```bash
# Install Fly CLI
brew install flyctl

# Deploy
fly auth login
fly launch
fly deploy
```

---

## 🔧 Troubleshooting

### Build Fails

**Check Docker Build Locally:**
```bash
docker build -t code-collab:test .
```

**Common Issues:**
- **Node version**: Must be 20+
- **Memory**: Increase Docker memory if build fails during `npm ci`
- **Syntax errors**: Check Dockerfile syntax

### Deployment Successful But App Not Working

**1. Check container logs:**
```bash
docker logs code-collab

# Or in Coolify:
# Application → Logs
```

**2. Verify backend is running:**
```bash
# Test inside container
docker exec code-collab wget -O- http://localhost:3001/api/sessions
```

**3. Check nginx routing:**
```bash
docker exec code-collab wget -O- http://localhost/api/sessions
```

**4. WebSocket issues:**
- Open browser console
- Look for WebSocket connection errors
- Verify `/socket.io` path is accessible

### GitHub Actions Failing

**Test webhook manually:**
```bash
curl -X GET "$COOLIFY_WEBHOOK_URL"
```

**Review logs:**
- Go to repository → **Actions**
- Click failed workflow
- Review step-by-step logs

---

## 🔐 Security & Performance

### Security Checklist

- [ ] **HTTPS enabled** (via Coolify or cloud provider)
- [ ] **Secrets** stored in environment variables (never in code)
- [ ] **CORS** configured for production domain
- [ ] **Rate limiting** considered (nginx or backend)
- [ ] **Health checks** enabled
- [ ] **Regular updates** of dependencies

### Performance Optimization

**Frontend:**
- ✅ Vite production build (optimized)
- ✅ Static assets cached by nginx
- ⚡ Consider CDN for global distribution

**Backend:**
- ✅ WebSocket proxy optimized
- ⚡ Consider Redis for session storage
- ⚡ Add database for persistence

**nginx:**
```nginx
# Already configured in Dockerfile for:
- Static file serving with caching
- WebSocket proxy with long timeout
- Request buffering
```

### Monitoring

**Coolify Dashboard:**
- CPU Usage
- Memory consumption
- Real-time logs
- Deployment history

**Application Metrics:**
```bash
# Health endpoint
curl http://your-app/api/sessions

# Response time test
time curl http://your-app/api/sessions
```

---

## 📈 Scaling

### When You Need to Scale

1. **Multiple Instances**
   - Use Coolify's scaling features
   - Add load balancer

2. **Session Persistence**
   - Add PostgreSQL or MongoDB
   - Replace in-memory sessions

3. **Session Store**
   - Add Redis for cross-instance sessions
   - Enable WebSocket sticky sessions

4. **Geographic Distribution**
   - Deploy to multiple regions
   - Use CDN for static assets

---

## 🔄 Rollback Procedures

### Via Coolify

1. Go to **Application** → **Deployments**
2. Find previous successful deployment
3. Click **" Redeploy"**

### Via Git

```bash
# Revert last commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push -f origin main
```

---

## ✅ Post-Deployment Checklist

- [ ] Application accessible via domain
- [ ] HTTPS working with valid certificate
- [ ] Create session works
- [ ] Monaco editor loads properly
- [ ] Real-time collaboration syncs
- [ ] JavaScript execution works
- [ ] Python/Pyodide loads and executes
- [ ] GitHub Actions workflow passing
- [ ] Health checks responding
- [ ] Logs accessible
- [ ] WebSocket connections stable

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Coolify Documentation](https://coolify.io/docs)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [nginx Configuration](https://nginx.org/en/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## 🆘 Need Help?

1. **Check logs** first (Docker or Coolify)
2. **Review** [troubleshooting section](#troubleshooting)
3. **Test locally** with Docker
4. **Open an issue** on GitHub
5. **Check discussions** for similar problems

---

**💡 Pro Tip:** Always test your Docker image locally before deploying to production!
