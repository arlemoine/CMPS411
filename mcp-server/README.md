# MCP Server - Healthcare AI System

FastAPI-based Model Context Protocol server providing safe, scoped access to healthcare database.

## Status

🚧 **Setup Complete - Ready for Implementation**

## Architecture

The MCP Server sits between the LLM Orchestrator and the healthcare database, exposing predefined tools for safe data queries.

```
LLM Orchestrator → MCP Server → PostgreSQL (RDS)
                      ↓
                 AWS Secrets Manager (credentials)
```

## Tech Stack

- **FastAPI**: Web framework for API endpoints
- **Fast-MCP**: MCP protocol implementation
- **SQLAlchemy**: ORM for safe database queries
- **PostgreSQL**: Relational database (local for dev, RDS for prod)
- **AWS SDK (boto3)**: Secrets Manager integration
- **Uvicorn**: ASGI server

## Project Structure

```
mcp-server/
├── main.py                     # FastAPI application entry point
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Container configuration
├── .env.example                # Environment variable template
├── core/                       # Core infrastructure
│   ├── __init__.py
│   ├── db_utils.py            # Database connection pooling
│   ├── secrets.py             # AWS Secrets Manager integration
│   ├── auth.py                # JWT authentication
│   └── audit.py               # HIPAA-compliant audit logging
├── tools/                      # MCP tool implementations
│   ├── __init__.py
│   ├── ehr_patients/          # Patient search tool
│   │   ├── __init__.py
│   │   ├── tool.py           # FastAPI router
│   │   └── meta.yaml         # Tool metadata for orchestrator
│   └── icd10_lookup/          # Diagnosis code lookup tool
│       ├── __init__.py
│       ├── tool.py
│       └── meta.yaml
└── migrations/                 # Database schema migrations (Alembic)
```

## Key Concepts

### MCP Tools
MCP tools are predefined, safe functions that the AI can call:
- **No arbitrary SQL**: Tools have specific, validated inputs
- **Read-only**: No destructive database operations
- **Audited**: All access is logged for HIPAA compliance
- **Role-based**: Different tools available to different user roles

### Connection Pooling
Instead of creating a new database connection for each request, we maintain a pool of reusable connections for better performance.

### AWS Secrets Manager
Database credentials are securely stored in AWS, not in code or environment variables.

## Environment Setup

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Edit .env with your values:**
   ```bash
   # Local development
   DATABASE_URL=postgresql+asyncpg://dev:devpass@localhost:5432/healthcare

   # AWS production
   AWS_REGION=us-east-1
   DATABASE_SECRET_NAME=healthcare/rds/credentials
   ```

## Running Locally

### Option 1: Docker (Recommended)
```bash
# From infra/docker/ directory
docker compose up mcp-server
```

### Option 2: Direct Python
```bash
# Install dependencies
pip install -r requirements.txt

# Run server
python main.py

# Or with uvicorn (auto-reload)
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Server will be available at: `http://localhost:8000`

## API Endpoints

### Health Check
```bash
curl http://localhost:8000/health
```

### MCP Tools (require authentication)
```bash
# Search patients
curl -X POST http://localhost:8000/tools/ehr_patients/search \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"last_name": "Smith"}'

# Lookup ICD-10 code
curl http://localhost:8000/tools/icd10_lookup/E11.9 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Development Workflow

1. **Create a new tool:**
   ```bash
   mkdir tools/your_tool_name
   cd tools/your_tool_name
   touch __init__.py tool.py meta.yaml
   ```

2. **Implement the tool** in `tool.py` using FastAPI router

3. **Define metadata** in `meta.yaml` for LLM Orchestrator

4. **Register the tool** in `main.py`

5. **Test the tool:**
   ```bash
   pytest tests/test_tools.py
   ```

## Security Features

- **JWT Authentication**: All tool endpoints require valid JWT tokens
- **Role-Based Access Control**: Tools specify which roles can access them
- **Audit Logging**: All PHI access is logged for HIPAA compliance
- **Input Validation**: Pydantic models validate all inputs
- **SQL Injection Prevention**: SQLAlchemy ORM prevents arbitrary SQL
- **Secrets Management**: AWS Secrets Manager for credentials

## Planned MCP Tools

- [ ] `ehr_patients` - Patient search and demographics
- [ ] `icd10_lookup` - Diagnosis code lookup
- [ ] `patient_medications` - Medication history
- [ ] `patient_labs` - Lab results
- [ ] `patient_encounters` - Visit history
- [ ] `overdue_checkups` - Patients needing care
- [ ] `medication_conflicts` - Drug interaction checking
- [ ] `aggregate_stats` - Population health analytics

## Testing

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_tools.py

# Run with coverage
pytest --cov=. --cov-report=html
```

## Deployment

Deployed as Docker container on AWS ECS/Fargate. See [infra/](../infra/) for deployment configuration.

## Next Steps

1. Implement database models (SQLAlchemy)
2. Complete MCP tool implementations
3. Add comprehensive tests
4. Set up database migrations (Alembic)
5. Configure production logging
6. Document tool catalog for LLM Orchestrator team

## Related Documentation

- [Parent Project CLAUDE.md](../CLAUDE.md) - Overall project context
- [MCP Workflow](../docs/workflows/workflow_mcp_server.md) - Development workflow
- [Tech Stack Guide](../docs/guides/guide_tech_stack_concepts.md) - Architecture concepts
