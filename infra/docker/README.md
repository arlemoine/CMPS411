# Docker Development Environment

This directory contains the Docker setup for running all project services locally. Docker lets you run the entire project (frontend, backend, database) with a single command, without installing Python, Node, or PostgreSQL on your machine.

## First Time Setup

### Prerequisites

1. **Install Docker Desktop**: Download from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
2. **Start Docker Desktop**: Make sure it's running (you'll see a whale icon in your taskbar/menu bar)

### Initial Configuration

1. **Navigate to this directory**:
   ```bash
   cd infra/docker
   ```

2. **Copy the environment file**:
   ```bash
   cp .env.example .env
   ```

   The `.env` file contains configuration like AWS credentials. Adriean will provide these values after INFRA-03.

3. **Start everything**:

   **Option A: Using Command Line**
   ```bash
   docker compose up -d
   ```

   **Option B: Using Docker Desktop GUI**
   - Open Docker Desktop
   - Go to the "Containers" tab
   - Click the "▶ Play" button if containers are stopped

   This will download images and start all 4 services. First time takes ~2-5 minutes.

4. **Verify it's working**:
   - Chat UI: Open http://localhost:3000 in your browser
   - You should see "Healthcare AI Chat" with a purple header and chat interface
   - If you see this, everything is working!

## Daily Development Workflow

### Starting Your Work Session

**Command Line:**
```bash
cd infra/docker
docker compose up -d
```

**Docker Desktop GUI:**
- Open Docker Desktop
- Find "infra-docker" or your containers
- Click the "▶ Play" button

### While Working

Just edit files in your code editor (VS Code, etc.). Changes are automatically reflected:
- **Frontend (chat-ui)**: Changes appear immediately in your browser
- **Backend (Python files)**: Changes are synced, but may need container restart for some changes

### Viewing Logs (See What's Happening)

**Command Line:**
```bash
# See logs from all services
docker compose logs -f

# See logs from just one service
docker compose logs -f mcp-server
```

**Docker Desktop GUI:**
- Click on any container name
- View the "Logs" tab

### Stopping Your Work Session

**Command Line:**
```bash
docker compose down
```

**Docker Desktop GUI:**
- Click the "◼ Stop" button in Docker Desktop

## What If I Need to Install a New Package?

If you need to add a Python or Node package, **do NOT try to install it yourself inside the container**. Instead:

### Option 1: Contact Adriean (Recommended)
Message Adriean with:
- Which service needs the package (mcp-server, llm-orchestrator, or chat-ui)
- Package name and version (e.g., "requests version 2.31.0")
- Adriean will update the requirements file and rebuild the container

### Option 2: Use Claude Code
If you're working with Claude Code:
1. Tell Claude: "I need to add [package-name] to [service-name]"
2. Claude will update the appropriate requirements file
3. Rebuild the container:
   ```bash
   docker compose up -d --build [service-name]
   ```

**Why this process?** Your code changes sync automatically, but dependency changes (requirements.txt, package.json) require rebuilding the container image. This ensures everyone on the team has the same dependencies.

## Container Information

All services run in isolated containers that can talk to each other:

| Service | What It Does | Port | Your Code Directory |
|---------|-------------|------|---------------------|
| **capstone-chat-ui** | React frontend | 3000 | `chat-ui/` |
| **capstone-orchestrator** | Python API routing logic | 8080 | `llm-orchestrator/` |
| **capstone-mcp-server** | Database query tools | 8000 | `mcp-server/` |
| **capstone-database** | PostgreSQL database | 5432 | (data in Docker volume) |

Access them at:
- Frontend: http://localhost:3000
- Orchestrator API: http://localhost:8080
- MCP Server: http://localhost:8000
- Database: `localhost:5432` (username: `dev`, password: `devpass`, database: `healthcare`)

## Common Scenarios

### "I changed my code but nothing happened"

- **Frontend**: Refresh your browser (Ctrl/Cmd + R)
- **Backend**: You may need to restart the container:
  ```bash
  docker compose restart mcp-server
  ```
  Or in Docker Desktop: Click "Restart" button

### "I added a package to requirements.txt or package.json"

Rebuild that container:
```bash
docker compose up -d --build [service-name]
```

Examples:
```bash
docker compose up -d --build mcp-server
docker compose up -d --build chat-ui
```

### "I want to see if my service is running"

**Command Line:**
```bash
docker compose ps
```

**Docker Desktop GUI:**
- Open Docker Desktop
- Check the "Containers" tab
- Green = running, Grey = stopped

### "I want to run a command inside a container"

**Command Line:**
```bash
# Python containers (mcp-server, llm-orchestrator)
docker compose exec mcp-server bash

# Frontend container (Node)
docker compose exec chat-ui sh

# Database
docker compose exec database psql -U dev -d healthcare
```

**Docker Desktop GUI:**
- Click on the container name
- Go to "Exec" tab
- Type your command

### "Something is broken and I want to start fresh"

**Full reset:**
```bash
# Stop and remove everything
docker compose down

# Remove database data (if you want to reset the database)
docker volume rm docker_postgres_data

# Start fresh
docker compose up -d --build
```

### "The port is already in use"

Another program is using the same port. Either:
1. Stop the other program
2. Or ask Adriean to change the port in docker-compose.yml

## Understanding the Network

All containers are connected to a private network called `capstone`:
- Containers can talk to each other using service names (e.g., `http://mcp-server:8000`)
- Your host machine (laptop) can access them via `localhost` and the port number
- They're isolated from the rest of your computer

## Important Notes

- **Never commit the `.env` file** - It contains secrets. Git is already configured to ignore it.
- **Don't edit files inside containers** - Edit files on your laptop; they automatically sync to containers
- **node_modules stays in Docker** - The `chat-ui/node_modules` folder lives in a Docker volume, not on your laptop (this makes things faster)
- **Database data persists** - Even if you stop containers, database data is saved in a Docker volume

## Getting Help

- **Docker issues**: Contact Adriean (Infra lead)
- **Docker Desktop not responding**: Try restarting Docker Desktop
- **Weird errors**: Try `docker compose down` then `docker compose up -d --build`

## Quick Reference Card

| I want to... | Command |
|--------------|---------|
| Start everything | `docker compose up -d` |
| Stop everything | `docker compose down` |
| See what's running | `docker compose ps` |
| View logs | `docker compose logs -f` |
| Restart one service | `docker compose restart mcp-server` |
| Rebuild after dependency change | `docker compose up -d --build mcp-server` |
| Start fresh | `docker compose down && docker compose up -d --build` |
