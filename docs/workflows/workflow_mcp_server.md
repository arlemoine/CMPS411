# MCP Server Workflow (Epic 4: MCP Server and Database Setup)

## Component Overview

The MCP Server provides safe, scoped database query tools that allow the LLM to retrieve patient data without writing arbitrary SQL. It exposes a set of pre-defined functions (MCP tools) that the LLM Orchestrator can call.

## What This Component Does

- Hosts MCP tools for querying patient data
- Connects to SQL database (PostgreSQL)
- Validates inputs and sanitizes queries
- Returns structured JSON responses
- Provides read-only access to database
- Implements safety boundaries (no destructive operations)

## Technology Stack

- Language: Python
- Framework: FastAPI + MCP SDK
- Database: PostgreSQL (local container for dev, RDS for production)
- ORM: SQLAlchemy (recommended for query safety)
- MCP Protocol: Model Context Protocol specification

## Local Development Workflow

### Getting Started

1. Clone the repository
2. Navigate to `mcp-server/` directory
3. The Infra lead will have Docker environment set up - run `docker compose up` from `infra/docker/`
4. Your code is mounted into the container - changes reflect immediately
5. MCP server runs at `http://localhost:8000`
6. Database accessible at `localhost:5432`

### Development Process

1. **Work on your local machine**: All code lives in `mcp-server/`
2. **File changes are live**: Docker container mounts your local directory
3. **Database is local**: PostgreSQL container with test data
4. **Test tools**: Use Postman or Python scripts to test MCP tool endpoints

### Key Files

```
mcp-server/
├── Dockerfile              # Managed by Infra lead
├── requirements.txt        # Python dependencies (coordinate with Infra for changes)
├── main.py                 # FastAPI entry point
├── config.py               # Database connection config (uses env vars)
├── models/
│   ├── patient.py          # SQLAlchemy models
│   ├── medication.py
│   └── lab_result.py
├── tools/                  # MCP tool implementations
│   ├── __init__.py
│   ├── patient_search.py
│   ├── medications.py
│   ├── lab_results.py
│   └── encounters.py
└── tests/
    └── test_tools.py
```

## Database Connection: Environment Variables

**CRITICAL**: Use environment variables for database connections:

```python
# config.py
import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://dev:devpass@capstone-database:5432/healthcare"  # Default to local
)
```

### Local Development
- Connects to: `capstone-database` container
- Connection string set by Infra lead in docker-compose

### Production
- Connects to: AWS RDS instance
- Connection string injected by ECS task definition
- Infra lead handles this configuration

**You never need to change connection strings in code** - everything is environment-driven.

## MCP Tools to Implement

See `CLAUDE.md` for full list. Start with these:

### 1. Patient Search
```python
# tools/patient_search.py
def search_patients(name: str = None, patient_id: int = None):
    """Search for patients by name or ID"""
    # Return: {"patients": [{"id": 123, "name": "John Doe", ...}]}
```

### 2. Patient Medications
```python
# tools/medications.py
def get_patient_medications(patient_id: int):
    """Get all medications for a patient"""
    # Return: {"medications": [{"name": "Aspirin", "dosage": "100mg", ...}]}
```

### 3. Patient Lab Results
```python
# tools/lab_results.py
def get_patient_labs(patient_id: int, lab_type: str = None):
    """Get lab results for a patient"""
    # Return: {"labs": [{"test": "Blood Pressure", "value": "120/80", ...}]}
```

### 4. Patient Encounters
```python
# tools/encounters.py
def get_patient_encounters(patient_id: int):
    """Get visit history for a patient"""
    # Return: {"encounters": [{"date": "2024-01-15", "type": "Office Visit", ...}]}
```

## MCP Tool Design Principles

### 1. Specific, Scoped Inputs
```python
# GOOD: Specific parameters
def get_patient_medications(patient_id: int):
    pass

# BAD: Arbitrary SQL
def execute_query(sql: str):  # Never do this!
    pass
```

### 2. Read-Only Operations
```python
# GOOD: SELECT only
def get_patient_labs(patient_id: int):
    return db.query(LabResult).filter_by(patient_id=patient_id).all()

# BAD: Destructive operation
def delete_patient(patient_id: int):  # Never do this!
    pass
```

### 3. Structured JSON Output
```python
# GOOD: Predictable structure
return {
    "medications": [
        {"name": "Aspirin", "dosage": "100mg", "frequency": "daily"}
    ]
}

# BAD: Raw database rows
return db.execute(sql).fetchall()  # Unpredictable format
```

### 4. Input Validation
```python
# GOOD: Validate inputs
def get_patient_medications(patient_id: int):
    if patient_id <= 0:
        raise ValueError("Invalid patient_id")
    # ... query database
```

## Dependencies on Other Components

### LLM Orchestrator (Epic 3)
- **What they need**: MCP tool catalog (list of available tools with schemas)
- **Communication**: Document each tool's inputs, outputs, and purpose
- **Format**: Provide OpenAPI/JSON schema definitions

### Database (Infra Lead)
- **What you need**: Database schema and test data
- **Communication**: Coordinate with Infra lead on schema design
- **Example**: Get CREATE TABLE statements and sample INSERT queries

### Infra (Epic 2)
- **What you need**: Database connection string (via env var)
- **Communication**: Request `DATABASE_URL` env var configuration

## Testing Approach

### Unit Testing
```python
# tests/test_tools.py
def test_get_patient_medications():
    result = get_patient_medications(patient_id=123)
    assert "medications" in result
    assert len(result["medications"]) > 0
```

### Integration Testing
- Test against local PostgreSQL container
- Use test data seeded by Infra lead
- Test edge cases (non-existent patient, empty results)

### Manual Testing
```bash
# Test via FastAPI endpoint
curl http://localhost:8000/tools/medications?patient_id=123
```

## Communicating with Infra Lead

### When You Need:
- New Python dependencies (add to requirements.txt PR)
- Database schema changes or new test data
- Help with SQLAlchemy queries or connection issues
- Environment variable configuration

### How to Communicate:
- Log dependency needs in Jira under Epic 4
- Document schema requirements for test database
- Share SQL queries that need optimization

## Deployment

Deployment is handled by the Infra lead:
- Push code to `main` branch
- CI/CD builds Docker image and deploys to ECS
- Connection string automatically switches to RDS in production

**You don't need to change anything for deployment** - environment variables handle it.

## Tips

- Use SQLAlchemy ORM for query safety (prevents SQL injection)
- Start with 2-3 simple tools, then expand
- Write comprehensive tests - MCP tools must be reliable
- Log all database queries for debugging
- Handle NULL values gracefully (patients may have missing data)
- Document expected data formats clearly
- Use database transactions (read-only, but good practice)
- Test with realistic patient data volumes

## Database Migration Strategy

As schema changes:
1. Use Alembic (SQLAlchemy migration tool)
2. Keep migrations in `mcp-server/migrations/`
3. Coordinate with Infra lead to apply migrations to RDS

## Security Considerations

- Never expose raw SQL execution
- Validate all inputs (type checking, range validation)
- Use parameterized queries (SQLAlchemy does this automatically)
- Log access attempts for audit trail
- Implement rate limiting (coordinate with Infra lead)
- Never return sensitive data (SSN, full address) unless required

## Example Tool Implementation

```python
# tools/medications.py
from sqlalchemy.orm import Session
from models.medication import Medication
from config import get_db

def get_patient_medications(patient_id: int) -> dict:
    """
    Get all current medications for a patient.

    Args:
        patient_id: Integer patient ID

    Returns:
        {
            "patient_id": 123,
            "medications": [
                {
                    "name": "Aspirin",
                    "dosage": "100mg",
                    "frequency": "daily",
                    "start_date": "2024-01-01",
                    "prescribing_physician": "Dr. Smith"
                }
            ]
        }
    """
    if patient_id <= 0:
        raise ValueError("Invalid patient_id")

    db: Session = next(get_db())

    medications = db.query(Medication).filter(
        Medication.patient_id == patient_id,
        Medication.active == True
    ).all()

    return {
        "patient_id": patient_id,
        "medications": [
            {
                "name": med.name,
                "dosage": med.dosage,
                "frequency": med.frequency,
                "start_date": med.start_date.isoformat(),
                "prescribing_physician": med.physician
            }
            for med in medications
        ]
    }
```
