# Infrastructure Component

This directory contains all infrastructure code: Docker, Terraform, and CI/CD pipelines.

## Status
🚧 Docker configuration exists - AWS infrastructure and CI/CD coming in Phase 2

## Documentation
See `docs/playbooks/playbook_planning.md` for infrastructure planning.

## Structure
```
infra/
├── docker/
│   └── docker-compose.yml     # Local development environment
├── terraform/                 # Infrastructure as Code (coming soon)
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
└── github/
    └── workflows/             # CI/CD pipelines (coming soon)
        ├── deploy-backend.yml
        ├── deploy-frontend.yml
        └── deploy-lambda.yml
```

## Responsibilities

### Docker (Current)
- Local development environment setup
- Container definitions for all services
- Volume mounts for hot-reload development
- Network configuration

### Terraform (Planned)
- ECS/Fargate cluster setup
- RDS instance configuration
- S3 buckets and IAM policies
- VPC and networking
- Secrets management

### GitHub Actions (Planned)
- Build Docker images on push to main
- Push images to AWS ECR
- Update ECS services
- Run tests before deployment

## Running Local Environment

### Start All Services
```bash
cd infra/docker
docker compose up -d
```

### Stop All Services
```bash
docker compose down
```

### Check Running Containers
```bash
docker container ps
```

### View Logs
```bash
docker compose logs -f [service-name]
```

## Services (Local Dev)

| Service | Port | Description |
|---------|------|-------------|
| mcp-server | 8000 | MCP server with database query tools |
| llm-orchestrator | 8080 | Query routing and Bedrock integration |
| chat-ui | 3000 | Frontend React application |
| database | 5432 | PostgreSQL database for patient data |

## Environment Variables

Managed via `.env` files (not committed to git):

```bash
# .env.example (commit this)
DATABASE_URL=postgresql://dev:devpass@database:5432/healthcare
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
BEDROCK_KB_ID=XXXXXXXXXX
```

## AWS Infrastructure (Planned)

- **ECS Cluster**: Run containerized services
- **RDS (PostgreSQL)**: Patient database
- **ECR**: Container image registry
- **S3**: Document storage for RAG
- **Bedrock**: AI models and Knowledge Base
- **Lambda**: Document ingestion triggers
- **VPC**: Network isolation
- **IAM**: Permissions and roles

## Next Steps
1. Update docker-compose.yml with all services
2. Create Terraform configuration
3. Set up GitHub Actions workflows
4. Configure AWS credentials
5. Create deployment runbooks
