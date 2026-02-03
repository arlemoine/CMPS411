# Component Workflow Documentation

This directory contains workflow guides for each system component, organized by Jira epic.

## Available Workflows

Each guide explains the local development workflow, testing approach, and communication expectations for that component:

| Epic | Component | Workflow Guide | Primary Technology |
|------|-----------|----------------|-------------------|
| 1 | Chat UI | [workflow_chat_ui.md](workflow_chat_ui.md) | React + TypeScript |
| 3 | LLM Orchestrator | [workflow_llm_orchestrator.md](workflow_llm_orchestrator.md) | Python + FastAPI |
| 4 | MCP Server | [workflow_mcp_server.md](workflow_mcp_server.md) | Python + FastAPI + PostgreSQL |
| 6 | RAG Pipeline | [workflow_rag_pipeline.md](workflow_rag_pipeline.md) | AWS Lambda + S3 + Bedrock KB |

## What These Guides Cover

Each workflow document includes:

- **Component Overview**: What this component does and why it exists
- **Technology Stack**: Languages, frameworks, and tools used
- **Local Development Workflow**: How to work on the component locally
- **Dependencies**: What other components this one depends on
- **Testing Approach**: How to test your work
- **Communication Protocols**: When and how to coordinate with other teams
- **Deployment Notes**: What happens when code is deployed (handled by Infra lead)

## What These Guides DON'T Cover

- **Infrastructure Setup**: Docker configuration, AWS resources, and deployment pipelines are managed by the Infra lead
- **Initial Project Setup**: See `docs/playbooks/` for project phases and planning

## Key Principles

1. **Local Development First**: All components have local Docker environments
2. **Environment Variables**: Configuration via env vars (never hardcode)
3. **Component Isolation**: Each component can be developed independently
4. **Infra-Managed Deployment**: Team members focus on code, not deployment mechanics

## Getting Started

1. Find your epic/component in the table above
2. Read the corresponding workflow guide
3. Coordinate with Infra lead for Docker environment setup
4. Start developing!

## Questions?

- Technical architecture: See `docs/guides/guide_tech_stack_concepts.md`
- Project planning: See `docs/playbooks/playbook_planning.md`
- Docker workflows: See `docs/guides/guide_docker.md`
- Infrastructure: Contact the Infra lead (check `CLAUDE.md` for current assignments)
