# Repository Reorganization Summary

**Date**: 2026-02-03
**Changes**: Component-based architecture reorganization

## What Changed

The repository has been reorganized from a traditional frontend/backend structure to a component-based architecture aligned with Jira epics.

## Directory Structure Changes

### Before
```
.
├── backend/              # Generic backend
├── docker/               # Docker config
└── docs/                 # Flat documentation
```

### After
```
.
├── chat-ui/              # Frontend Chat Interface (Epic 1)
├── llm-orchestrator/     # LLM Orchestrator (Epic 3)
├── mcp-server/           # MCP Server & Database (Epic 4) [renamed from backend/]
├── rag-pipeline/         # RAG / Knowledge Base (Epic 6)
├── infra/                # Infrastructure (Epic 2) [renamed from docker/]
│   ├── docker/           # Docker Compose
│   ├── github/           # CI/CD workflows (planned)
│   └── terraform/        # IaC (planned)
└── docs/                 # Organized documentation
    ├── workflows/        # Per-component dev guides
    ├── playbooks/        # Project planning
    └── guides/           # Technical concepts
```

## File Moves

### Component Directories
- `backend/` → `mcp-server/` (renamed to reflect its purpose)
- `docker/` → `infra/` (expanded scope)
- `docker/docker-compose.yml` → `infra/docker/docker-compose.yml`

### Documentation Directories
- `docs/guide_*.md` → `docs/guides/`
- `docs/playbook_*.md` → `docs/playbooks/`
- New: `docs/workflows/` (component-specific guides)

## New Files Created

### Component READMEs
- `chat-ui/README.md` - Frontend component overview
- `llm-orchestrator/README.md` - LLM orchestrator overview
- `mcp-server/README.md` - MCP server overview (updated)
- `rag-pipeline/README.md` - RAG pipeline overview
- `infra/README.md` - Infrastructure overview

### Workflow Documentation
- `docs/workflows/README.md` - Workflow guide index
- `docs/workflows/workflow_chat_ui.md` - Frontend development workflow
- `docs/workflows/workflow_llm_orchestrator.md` - LLM orchestrator workflow
- `docs/workflows/workflow_mcp_server.md` - MCP server workflow
- `docs/workflows/workflow_rag_pipeline.md` - RAG pipeline workflow

### Updated Files
- `README.md` - Complete rewrite with new structure
- `CLAUDE.md` - Updated architecture section, new project structure, file naming convention
- `infra/docker/docker-compose.yml` - Updated service names and paths

### File Naming Convention
- All files use **snake_case** (lowercase_separated_by_underscores)
- Exceptions: `README.md` and `CLAUDE.md` use UPPERCASE
- Examples: `claude_code_cheatsheet.md`, `workflow_chat_ui.md`, `guide_tech_stack_concepts.md`

## Docker Compose Changes

### Service Name Changes
- `capstone-backend` → `mcp-server`
- `capstone-frontend` → `chat-ui`
- `capstone-database` → `database`

### Database Changes
- Replaced Milvus with PostgreSQL (Bedrock KB handles vectors)
- Added proper environment variables for database connection
- Added service dependencies (depends_on)

### New Services
- `llm-orchestrator` service added (port 8080)

## Architecture Clarifications in CLAUDE.md

1. **Bedrock KB for RAG vectors** - Not using Milvus
2. **PostgreSQL for MCP data** - Patient data in SQL database
3. **Component isolation** - Each epic has its own directory
4. **Environment-driven config** - All configuration via env vars
5. **Same Dockerfile approach** - Volume mounts override COPY in dev

## Documentation Organization

### Workflows (`docs/workflows/`)
Component-specific development guides for each team member based on their epic assignment.

### Playbooks (`docs/playbooks/`)
Project planning, phases, milestones, and team coordination.

### Guides (`docs/guides/`)
Technical concept explanations (AWS Bedrock, RAG, MCP, Docker).

## Key Decisions Documented

1. **Dockerfile Strategy**: Single Dockerfile per component, volume mounts for dev
2. **Database Strategy**: Local PostgreSQL container first, migrate to RDS later
3. **CI/CD Strategy**: GitHub Actions for automated deployment
4. **Vector Storage**: AWS Bedrock Knowledge Base (no separate vector DB)
5. **Configuration**: Environment variables for all configuration

## Impact on Team Members

### Frontend Team (Epic 1)
- Work in `chat-ui/` directory
- See `docs/workflows/workflow_chat_ui.md`

### LLM Orchestrator Team (Epic 3)
- Work in `llm-orchestrator/` directory
- See `docs/workflows/workflow_llm_orchestrator.md`

### MCP Server Team (Epic 4)
- Work in `mcp-server/` directory (formerly `backend/`)
- See `docs/workflows/workflow_mcp_server.md`

### RAG Team (Epic 6)
- Work in `rag-pipeline/` directory
- See `docs/workflows/workflow_rag_pipeline.md`

### Infrastructure Lead (Epic 2)
- Manage `infra/` directory
- See `docs/playbooks/playbook_planning.md`

## Git Commands to Review Changes

```bash
# View directory structure
tree -L 2 -d

# View renamed files
git log --follow mcp-server/Dockerfile

# View all documentation
ls -la docs/workflows/
ls -la docs/playbooks/
ls -la docs/guides/
```

## Next Steps

1. **Commit reorganization** - Commit all changes to git
2. **Update Jira** - Link workflow docs to epic descriptions
3. **Team notification** - Share new structure with team
4. **Docker testing** - Test updated docker-compose.yml
5. **Begin implementation** - Teams start work in their component directories

## Breaking Changes

### For Existing Work
- Docker commands now run from `infra/docker/` not root `docker/`
- Service names changed in docker-compose.yml
- File paths updated in documentation

### Migration Steps
```bash
# Update your local clone
git pull origin main

# Start services from new location
cd infra/docker
docker compose up -d

# Update any local scripts referencing old paths
```

## Questions?

- Architecture questions: See `CLAUDE.md`
- Component workflow: See `docs/workflows/`
- Technical concepts: See `docs/guides/`
- Project planning: See `docs/playbooks/`
- Infrastructure setup: Contact Infra lead
