# Docker Development Environment

This directory contains the Docker Compose configuration for local development of the Healthcare AI Capstone project.

## Quick Start

### 1. Set up environment variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and fill in your actual values
# (AWS credentials will be provided by Adriean after INFRA-03)
```

### 2. Start all services

```bash
# From the infra/docker/ directory
docker compose up -d

# View logs
docker compose logs -f

# View logs for specific service
docker compose logs -f chat-ui
```

### 3. Access the services

- **Chat UI**: http://localhost:3000
- **LLM Orchestrator**: http://localhost:8080
- **MCP Server**: http://localhost:8000
- **PostgreSQL Database**: localhost:5432

## Services

### chat-ui (Port 3000)
- React + TypeScript frontend
- Hot-reloading enabled (changes reflect immediately)
- Connects to orchestrator at http://localhost:8080

### llm-orchestrator (Port 8080)
- Python FastAPI service
- Routes queries between RAG and MCP
- Connects to AWS Bedrock

### mcp-server (Port 8000)
- Python MCP server
- Provides database query tools
- Connects to PostgreSQL database

### database (Port 5432)
- PostgreSQL 15
- Contains patient data
- Data persists in `postgres_data` volume

## Common Commands

### Start services
```bash
docker compose up -d
```

### Stop services
```bash
docker compose down
```

### Rebuild after code changes
```bash
# Rebuild specific service
docker compose up -d --build chat-ui

# Rebuild all services
docker compose up -d --build
```

### View logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f mcp-server
```

### Access service shell
```bash
# Chat UI (Node)
docker compose exec chat-ui sh

# MCP Server (Python)
docker compose exec mcp-server bash

# Database (PostgreSQL)
docker compose exec database psql -U dev -d healthcare
```

### Reset database
```bash
# Stop all services
docker compose down

# Remove database volume
docker volume rm docker_postgres_data

# Start fresh
docker compose up -d
```

## Hot-Reloading

All services are configured with volume mounts for hot-reloading:

- **Frontend**: Changes to `chat-ui/` files will automatically refresh the browser
- **Backend**: Changes to `llm-orchestrator/` and `mcp-server/` files require the Python process to restart (use `--build` if dependencies change)

## Troubleshooting

### Port already in use
```bash
# Check what's using the port
lsof -i :3000

# Kill the process or change the port in docker-compose.yml
```

### Services not starting
```bash
# Check logs for errors
docker compose logs

# Rebuild images
docker compose up -d --build
```

### Database connection errors
```bash
# Verify database is running
docker compose ps

# Check database logs
docker compose logs database

# Test connection
docker compose exec database psql -U dev -d healthcare -c "SELECT 1;"
```

### Frontend dependencies missing
```bash
# Rebuild with fresh node_modules
docker compose down
docker volume rm docker_chat_ui_node_modules
docker compose up -d --build chat-ui
```

## Network

All services communicate via the `capstone` bridge network:
- Services can reach each other by service name (e.g., `http://mcp-server:8000`)
- Host machine can access services via localhost ports

## Volumes

- `postgres_data`: Persists PostgreSQL database data
- `chat_ui_node_modules`: Isolates node_modules from host machine for better performance

## Development Workflow

1. Make code changes in your editor (VS Code, etc.)
2. Changes are automatically synced to containers via volume mounts
3. For frontend: Browser auto-refreshes
4. For backend: May need to restart service if not using auto-reload
5. Commit changes to git when ready

## Notes

- **Do not commit `.env` file** - it contains secrets
- Use `.env.example` as a template
- Docker setup is managed by Adriean (Infra lead)
- Report any Docker issues to Adriean
