# CMPS411 - AI-Powered Healthcare Information System

## Project Overview

This capstone project builds an AI-powered healthcare system that combines:
- **RAG (Retrieval-Augmented Generation)**: Clinical document retrieval via AWS Bedrock Knowledge Base
- **MCP (Model Context Protocol)**: Structured patient data queries via safe, scoped tools
- **Chat Interface**: User-facing UI for healthcare professionals

**Tech Stack**: React + TypeScript (UI), Python (backend), PostgreSQL (patient data), AWS Bedrock (AI), ECS/Fargate (deployment)

## Getting Started

### For Team Members

1. **Read project context**: Start with `CLAUDE.md` for architectural overview
2. **Find your component**: Check `docs/workflows/` for your epic-specific workflow guide
3. **Set up local environment**: Coordinate with Infra lead for Docker setup
4. **Start developing**: Follow your workflow guide for development process

### Quick Links by Role

| Your Epic | Start Here | Technology |
|-----------|-----------|------------|
| Frontend Chat Interface | [workflow_chat_ui.md](docs/workflows/workflow_chat_ui.md) | React + TypeScript |
| LLM Orchestrator | [workflow_llm_orchestrator.md](docs/workflows/workflow_llm_orchestrator.md) | Python + FastAPI |
| MCP Server & Database | [workflow_mcp_server.md](docs/workflows/workflow_mcp_server.md) | Python + PostgreSQL |
| RAG / Knowledge Base | [workflow_rag_pipeline.md](docs/workflows/workflow_rag_pipeline.md) | AWS + Lambda |
| AWS Infrastructure | `docs/playbooks/playbook_planning.md` | Terraform + Docker |

## Documentation Structure

```
docs/
├── claude_code_cheatsheet.md  # How to interact with Claude Code efficiently
├── reorganization_summary.md  # Recent repo structure changes
├── workflows/          # Per-component development guides (START HERE)
│   ├── README.md
│   ├── workflow_chat_ui.md
│   ├── workflow_llm_orchestrator.md
│   ├── workflow_mcp_server.md
│   └── workflow_rag_pipeline.md
├── playbooks/          # Project planning and team coordination
│   ├── playbook_planning.md       # Phases and roles
│   ├── playbook_milestones.md     # Development milestones
│   └── playbook_workflow.md       # Team workflow
├── guides/             # Technical concept explanations
│   ├── guide_tech_stack_concepts.md  # AWS Bedrock, RAG, MCP, ECS
│   └── guide_docker.md               # Docker workflow
└── spec.md             # Project specification
```

## Repository Structure

The repository is organized by system component (aligned with Jira epics):

```
.
├── chat-ui/              # Frontend (Epic 1)
├── llm-orchestrator/     # Query routing and Bedrock integration (Epic 3)
├── mcp-server/           # Database query tools (Epic 4)
├── rag-pipeline/         # Document ingestion (Epic 6)
├── infra/                # Docker, Terraform, CI/CD (Epic 2)
├── docs/                 # Documentation
├── CLAUDE.md             # AI assistant context
└── README.md             # This file
```

## Development Workflow

### Local Development
1. **Docker-based**: All components run in containers locally
2. **Code mounting**: Your code is mounted into containers (hot reload)
3. **Environment variables**: Configuration via `.env` files
4. **Infra-managed**: Docker setup handled by Infra lead

### Deployment
1. **Push to GitHub**: Commit and push to `main` branch
2. **CI/CD runs**: GitHub Actions builds and tests
3. **Deploy to AWS**: Automatic deployment to ECS
4. **No manual steps**: Deployment is fully automated

## Key Principles

- **Component isolation**: Each component can be developed independently
- **Environment-driven config**: Never hardcode URLs, connection strings, or credentials
- **Infra-managed deployment**: Team members focus on code, not infrastructure
- **Documentation-first**: Update workflow docs as patterns emerge

## Project Epics (Jira)

1. **Frontend Chat Interface** - User interface
2. **AWS Infrastructure and Deployment** - ECS, networking, CI/CD
3. **LLM Orchestrator** - Query routing and Bedrock API integration
4. **MCP Server and Database Setup** - Patient data query tools
5. **DSS Team / External Dependencies** - External coordination
6. **RAG / Knowledge Base Setup** - Document ingestion pipeline

## Essential Reading

- **CLAUDE.md**: Complete architectural context (AI assistant reference)
- **docs/claude_code_cheatsheet.md**: Quick guide to interacting with Claude Code
- **docs/workflows/**: Your component's development workflow
- **docs/guides/guide_tech_stack_concepts.md**: Technical concepts (AWS Bedrock, RAG, MCP)
- **docs/playbooks/playbook_planning.md**: Project phases and team roles

## Team Communication

- **Jira**: Track tasks and epics
- **GitHub**: Code reviews, PRs, issues
- **Workflow docs**: Component-specific guidance
- **CLAUDE.md**: Shared project context (use "Add context" command to update)
- **Claude Code**: See `docs/claude_code_cheatsheet.md` for efficient interaction tips

## Questions?

- **Architecture/Infrastructure**: Contact Infra lead (see `CLAUDE.md`)
- **Component workflow**: Check `docs/workflows/` for your epic
- **Technical concepts**: Read `docs/guides/guide_tech_stack_concepts.md`
- **Project planning**: Check `docs/playbooks/`

---

**Note**: This is a component-based architecture, not a traditional monolithic frontend/backend split. Each epic maps to a distinct system component.
