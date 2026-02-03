# LLM Orchestrator Component

This directory contains the query routing and AWS Bedrock integration logic.

## Status
🚧 Not yet implemented - coming in Phase 2-3

## Documentation
See [docs/workflows/workflow_llm_orchestrator.md](../docs/workflows/workflow_llm_orchestrator.md) for development workflow.

## Structure (Planned)
```
llm-orchestrator/
├── Dockerfile
├── requirements.txt
├── src/
│   ├── main.py
│   ├── routers/
│   ├── services/
│   │   ├── bedrock.py
│   │   ├── rag.py
│   │   └── mcp.py
│   └── utils/
└── tests/
```

## Tech Stack
- Python + FastAPI
- AWS SDK (boto3)
- Environment-driven configuration

## Responsibilities
- Receive queries from Chat UI
- Classify query type (RAG, MCP, or hybrid)
- Call AWS Bedrock API (Claude model)
- Invoke MCP tools
- Query Bedrock Knowledge Base
- Return unified responses with citations

## Next Steps
1. Set up FastAPI application skeleton
2. Implement Bedrock API client
3. Create query routing logic
4. Integrate with MCP server
5. Integrate with Bedrock Knowledge Base
