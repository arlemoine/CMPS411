# LLM Orchestrator Workflow (Epic 3: LLM Orchestrator)

## Component Overview

The LLM Orchestrator is the brain of the system. It receives user queries from the Chat UI, decides whether to use RAG (documents), MCP (database), or both, calls AWS Bedrock, and returns unified responses.

## What This Component Does

- Receives queries from Chat UI
- Routes queries to appropriate data sources (RAG, MCP, or both)
- Calls AWS Bedrock API (Claude model) with appropriate context
- Manages conversation history and context
- Returns responses with citations to Chat UI
- Handles error states and fallback logic

## Technology Stack

- Language: Python or Node.js (TBD by team)
- Framework: FastAPI (Python) or Express (Node.js)
- AWS SDK: boto3 (Python) or AWS SDK for JavaScript
- Containerized as a service

## Local Development Workflow

### Getting Started

1. Clone the repository
2. Navigate to `llm-orchestrator/` directory
3. The Infra lead will have Docker environment set up - run `docker compose up` from `infra/docker/`
4. Your code is mounted into the container - changes reflect immediately
5. Service runs at `http://localhost:8080`

### Development Process

1. **Work on your local machine**: All code lives in `llm-orchestrator/src/`
2. **File changes are live**: The Docker container mounts your local directory
3. **Test with curl or Postman**: Send test queries to your API endpoints
4. **Use AWS credentials**: Configure AWS credentials for Bedrock access (coordinate with Infra lead)

### Key Files

```
llm-orchestrator/
├── Dockerfile              # Managed by Infra lead
├── requirements.txt        # Python dependencies (coordinate with Infra for changes)
├── src/
│   ├── main.py             # FastAPI app entry point
│   ├── routers/
│   │   └── query.py        # Query endpoint
│   ├── services/
│   │   ├── bedrock.py      # AWS Bedrock API client
│   │   ├── rag.py          # RAG retrieval logic
│   │   └── mcp.py          # MCP tool invocation
│   └── utils/
│       ├── prompts.py      # Prompt templates
│       └── routing.py      # Query classification logic
└── tests/
```

## Dependencies on Other Components

### Chat UI (Epic 1)
- **What they need**: Clear API contract (request/response format)
- **Communication**: Document your endpoints and data models
- **Example**: `POST /api/query` returns `{"response": "...", "sources": [...]}`

### MCP Server (Epic 4)
- **What you need**: MCP tool definitions and endpoint
- **Communication**: Get list of available tools and their schemas
- **Example**: Call MCP server to execute `get_patient_medications` tool

### RAG Pipeline (Epic 6)
- **What you need**: Bedrock Knowledge Base ID
- **Communication**: Get KB ID once RAG team creates it in AWS
- **Example**: Query KB with `retrieve_and_generate` API

### Infra (Epic 2)
- **What you need**: AWS credentials, environment variables
- **Communication**: Request IAM permissions for Bedrock and Knowledge Base access

## Configuration via Environment Variables

```bash
# .env (not committed)
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
BEDROCK_KB_ID=XXXXXXXXXX
MCP_SERVER_URL=http://mcp-server:8000
```

For production, the Infra lead will configure these in ECS.

## Core Logic: Query Routing

Your main challenge is deciding how to route queries:

### Query Classification
1. **Document-only**: "What are the treatment guidelines for diabetes?"
   - Route to: RAG (Bedrock Knowledge Base)
2. **Data-only**: "What is patient 123's current blood pressure?"
   - Route to: MCP tools
3. **Hybrid**: "Does patient 123 meet the criteria in the diabetes protocol?"
   - Route to: Both RAG and MCP, combine results

### Routing Strategy Options
- Rule-based: Keyword detection
- LLM-based: Use Claude to classify query intent
- Hybrid: LLM decides which tools to use

## Testing Approach

### During Development
- Test with mock Bedrock responses (use static fixtures)
- Test with mock MCP responses
- Unit test query routing logic
- Manual testing with curl/Postman

### Integration Testing
- Test against real Bedrock Knowledge Base (once RAG team sets it up)
- Test against real MCP server (once MCP team has tools ready)
- Test error handling (Bedrock rate limits, MCP failures)

### Example Test Queries
```bash
# Document query
curl -X POST http://localhost:8080/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What are the signs of sepsis?"}'

# Patient data query
curl -X POST http://localhost:8080/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Show me patient 123 medications"}'
```

## Communicating with Infra Lead

### When You Need:
- AWS IAM permissions for Bedrock/KB access
- New Python/npm dependencies
- Environment variables configured
- Help debugging AWS API errors

### How to Communicate:
- Log AWS permission issues in Jira under Epic 2
- Document dependency changes in PRs
- Share AWS SDK error messages for troubleshooting

## Deployment

Deployment is handled by the Infra lead:
- Push code to `main` branch
- CI/CD builds and deploys to ECS
- Monitor CloudWatch logs for errors

## Tips

- Start with hardcoded responses to test API structure
- Use AWS Bedrock Playground to test prompts before coding
- Implement retry logic for Bedrock API calls (rate limits)
- Log all queries and responses for debugging
- Use structured logging (JSON format)
- Document your prompt templates - they'll need tuning
- Consider caching for repeated queries (stretch goal)

## Prompt Engineering Notes

You'll need to craft prompts that:
- Include retrieved documents from RAG
- Include MCP tool results
- Instruct Claude on citation format
- Handle cases where no relevant info is found

Example prompt template:
```
You are a healthcare AI assistant. Answer the user's question using the provided context.

Context from clinical documents:
{rag_results}

Context from patient database:
{mcp_results}

User question: {user_query}

Provide a clear answer with citations [1], [2], etc.
```
