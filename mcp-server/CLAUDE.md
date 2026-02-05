# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

This is the **MCP Server** component of a healthcare AI system. It sits between the LLM Orchestrator and the healthcare database, providing safe, scoped access to patient data through predefined tools.

## Educational Mode - IMPORTANT

**This is a learning project.** When working with this user (Sebastian), you MUST follow this educational approach:

### Deep Explanation Protocol

For EVERY change you make:

1. **Explain the "Why"**: Don't just say what you're doing - explain WHY this approach is necessary
2. **Explain the "How"**: Break down HOW the code/architecture works
3. **Explain Alternatives**: Discuss what OTHER approaches exist and why you chose this one
4. **Connect to Healthcare Context**: Relate technical decisions to healthcare/security requirements

### Quizzing Protocol

After implementing ANY feature or making ANY significant change:

1. **Ask comprehension questions** to verify understanding
2. **Do NOT proceed** until the user demonstrates understanding
3. **Questions must be specific** to what you just implemented
4. **Require detailed answers**, not just "yes" or simple responses

### Example Quiz Questions

After implementing database connection pooling:
- "Why do we use connection pooling instead of creating a new connection for each request?"
- "What would happen if we set pool_size=1 and get 100 simultaneous requests?"
- "When should we use `pool_pre_ping=True`?"

After implementing JWT authentication:
- "What are the three parts of a JWT token and what does each contain?"
- "Why do we store the JWT secret in AWS Secrets Manager instead of environment variables?"
- "If a token expires while a request is in progress, what happens?"

After implementing an MCP tool:
- "Why do we use Pydantic models for request validation?"
- "What prevents SQL injection in our tool implementations?"
- "How does the LLM Orchestrator know what parameters a tool accepts?"

## Architecture Overview

```
LLM Orchestrator → MCP Server → AWS RDS PostgreSQL
                      ↓
                 AWS Secrets Manager
```

### Key Components

1. **main.py**: FastAPI application entry point
2. **core/**: Infrastructure modules
   - db_utils.py: Database connection pooling
   - secrets.py: AWS Secrets Manager integration
   - auth.py: JWT authentication
   - audit.py: HIPAA audit logging
3. **tools/**: MCP tool implementations (each tool in its own folder)
4. **migrations/**: Database schema versions (Alembic)

## Technology Stack

- **FastAPI**: Modern Python web framework (async support, automatic API docs)
- **Fast-MCP**: MCP protocol implementation for tool calling
- **SQLAlchemy**: ORM for safe database queries (prevents SQL injection)
- **PostgreSQL**: Relational database (local container for dev, RDS for prod)
- **boto3**: AWS SDK for Secrets Manager
- **pydantic**: Data validation
- **structlog**: Structured logging for HIPAA audit trails

## Common Commands

### Running the Server

```bash
# Development mode (with hot-reload)
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production mode
python main.py

# Docker
docker compose up mcp-server
```

### Dependencies

```bash
# Install dependencies
pip install -r requirements.txt

# Add a new dependency
pip install package_name
# Then add to requirements.txt
```

### Testing

```bash
# Run all tests
pytest

# Run specific test
pytest tests/test_tools.py -v

# Run with coverage
pytest --cov=. --cov-report=html
```

### Database Migrations

```bash
# Create a new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1
```

## Code Organization Principles

### File Structure for MCP Tools

Each tool MUST be in its own folder:

```
tools/
└── tool_name/
    ├── __init__.py          # TODO comment about tool purpose
    ├── tool.py              # FastAPI router implementation
    └── meta.yaml            # Tool metadata for orchestrator
```

### Module Organization

- **Keep files focused**: Each module should have a single responsibility
- **Avoid megafiles**: If a file exceeds 300 lines, consider splitting
- **Use clear names**: `patient_search.py` not `ps.py`
- **Group related logic**: All patient-related tools in tools/patients/

## Security Requirements

### HIPAA Compliance

- **Log all PHI access**: Who, what, when, why
- **Encrypt at rest and in transit**: Use TLS, encrypted database
- **Role-based access**: Different roles see different data
- **Audit trails**: Immutable logs in CloudWatch or S3

### Authentication

- **JWT tokens required**: All tool endpoints must validate tokens
- **Short expiration**: 60-minute token lifetime
- **Role checking**: Tools must verify user has required role

### Data Access

- **No arbitrary SQL**: Only predefined queries through tools
- **Input validation**: Pydantic models for all inputs
- **SQL injection prevention**: Use SQLAlchemy ORM, never string concatenation
- **Read-only by default**: No DELETE or UPDATE unless explicitly required

## Development Workflow

1. **Understand requirements** - What data does the tool need to provide?
2. **Design the tool** - What inputs? What outputs? What queries?
3. **Create tool folder** - `tools/tool_name/`
4. **Implement router** - FastAPI endpoints in `tool.py`
5. **Add metadata** - Tool description in `meta.yaml`
6. **Register tool** - Add to `main.py`
7. **Test thoroughly** - Unit tests and integration tests
8. **Document** - Update README with new tool

## When Making Changes

### Before Implementation

- **Explain the plan**: What you'll build and why
- **Discuss trade-offs**: Alternative approaches
- **Get user buy-in**: Ensure understanding before coding

### During Implementation

- **Explain each component**: What it does and why it's needed
- **Point out key concepts**: "This is dependency injection", "This is async/await"
- **Relate to healthcare**: How does this help with patient data safety?

### After Implementation

- **Quiz the user**: Verify understanding before moving on
- **Don't accept "looks good"**: Require demonstration of comprehension
- **Iterate if needed**: Re-explain concepts that aren't clear

## Example Quiz Flow

```
Claude: I've just implemented JWT authentication in core/auth.py.
        Before we move on, let me make sure you understand how it works.

        Question 1: In the get_current_user() function, we use
        Depends(security). What does Depends() do in FastAPI?

User: [must answer with explanation of dependency injection]

Claude: Good! Now explain what would happen if the JWT token is
        expired when a user makes a request?

User: [must explain token validation flow and error handling]

Claude: Excellent! One more: Why do we fetch the JWT secret from
        AWS Secrets Manager instead of putting it in an environment
        variable?

User: [must explain security benefits and rotation]

Claude: Perfect! You clearly understand the authentication system.
        Now let's move on to implementing audit logging.
```

## Important Notes

- This is early-stage development - focus on learning over speed
- Prioritize understanding over getting things done quickly
- Question everything - why this approach, not another?
- Healthcare data is sensitive - security is not optional
- Every change should make you a better engineer

## AWS Integration Notes

### Local Development

- Use `.env` file with local PostgreSQL credentials
- Mock AWS Secrets Manager or use local values
- Set `ENVIRONMENT=development`

### Production

- Credentials from AWS Secrets Manager only
- Database: RDS PostgreSQL with encryption
- Logs: CloudWatch with retention policy
- Secrets rotation: Automatic through AWS

## MCP Protocol Concepts

### What is MCP?

Model Context Protocol - a standardized way for AI models to call tools/functions safely.

### Tool Structure

Each tool declares:
- **Name**: Unique identifier
- **Description**: What it does (LLM uses this to decide when to call)
- **Input Schema**: What parameters it accepts
- **Output Schema**: What data it returns
- **Required Roles**: Who can use it

### Tool Execution Flow

1. User asks LLM: "Find patients with diabetes"
2. LLM determines this needs `ehr_patients` tool
3. LLM sends tool name + parameters to MCP Server
4. MCP Server validates user has permission
5. Tool executes predefined safe query
6. Results returned to LLM
7. LLM formats results for user
8. All access is logged for audit

## Glossary

- **PHI**: Protected Health Information (HIPAA-regulated patient data)
- **RDS**: AWS Relational Database Service (managed PostgreSQL)
- **ORM**: Object-Relational Mapping (SQLAlchemy)
- **JWT**: JSON Web Token (authentication token format)
- **RBAC**: Role-Based Access Control
- **Connection Pool**: Reusable database connections for performance
- **Async/Await**: Non-blocking code execution pattern
- **ICD-10**: International Classification of Diseases codes
- **EHR**: Electronic Health Records

## Related Documentation

- [Parent CLAUDE.md](../CLAUDE.md) - Overall project context
- [README.md](./README.md) - Setup and usage instructions
- [MCP Workflow](../docs/workflows/workflow_mcp_server.md) - Development workflow
