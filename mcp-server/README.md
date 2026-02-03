# MCP Server Component

This directory contains the MCP (Model Context Protocol) server that provides safe, scoped database query tools.

## Status
🚧 Skeleton structure exists - implementation in progress (Phase 1-2)

## Documentation
See [docs/workflows/workflow_mcp_server.md](../docs/workflows/workflow_mcp_server.md) for development workflow.

## Structure (Current)
```
mcp-server/
├── Dockerfile
├── requirements.txt       # Python dependencies (numpy, scipy, pandas, pathlib2)
└── README.md              # This file
```

## Structure (Target)
```
mcp-server/
├── Dockerfile
├── requirements.txt
├── main.py                # FastAPI entry point
├── config.py              # Database connection (uses env vars)
├── models/                # SQLAlchemy models
│   ├── patient.py
│   ├── medication.py
│   └── lab_result.py
├── tools/                 # MCP tool implementations
│   ├── __init__.py
│   ├── patient_search.py
│   ├── medications.py
│   ├── lab_results.py
│   └── encounters.py
└── tests/
    └── test_tools.py
```

## Tech Stack
- Python + FastAPI
- MCP SDK (Model Context Protocol)
- PostgreSQL (local container for dev, RDS for production)
- SQLAlchemy (ORM for query safety)
- Environment-driven configuration

## Responsibilities
- Host MCP tools for querying patient data
- Connect to SQL database (PostgreSQL)
- Validate inputs and sanitize queries
- Return structured JSON responses
- Provide read-only access (no destructive operations)

## MCP Tools (Planned)
- Patient demographics/search
- Medications per patient
- Lab results per patient
- Encounters/visits history
- Patients missing checkups
- Aggregate statistics by condition
- Medication conflict detection
- Recent prescriptions or changes

## Environment Variables
```bash
DATABASE_URL=postgresql://dev:devpass@capstone-database:5432/healthcare
```

## Next Steps
1. Create FastAPI application skeleton
2. Set up SQLAlchemy models
3. Implement first MCP tool (patient search)
4. Add remaining MCP tools
5. Write comprehensive tests
6. Document tool catalog for LLM Orchestrator team

## Running Locally
```bash
# From infra/docker/ directory
docker compose up
```

The MCP server will be available at `http://localhost:8000`.
