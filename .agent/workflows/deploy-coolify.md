---
description: Deploy hw-2 to Coolify
---

# Deploy hw-2 to Coolify

This workflow guides you through deploying the hw-2 CODE_COLLAB application to Coolify.

## Prerequisites
- Coolify instance running
- Access to Coolify dashboard
- Repository pushed to GitHub

## Steps

### 1. Access Coolify Dashboard
Navigate to your Coolify instance (typically on port 8000)

### 2. Create New Application
- Click "+ New Resource" → "Application"
- Select "Public Repository"
- Enter repository URL: `https://github.com/clint911/ai-devtools-zoomcamp`
- Branch: `main`

### 3. Configure Build
- Build Pack: "Dockerfile"
- Docker Context: `hw-2`
- Dockerfile: `Dockerfile`
- Port: `80`

### 4. Deploy
Click "Deploy" and wait for build to complete (~2-3 minutes)

### 5. Verify
- Access the generated URL
- Test session creation
- Verify code execution works

## Expected Result
A live instance of CODE_COLLAB accessible via Coolify-generated URL or custom domain.

## Troubleshooting
- If port conflicts, change to 8080
- Ensure Docker Context is set to `hw-2`
- Build time is ~2-3 minutes, be patient
