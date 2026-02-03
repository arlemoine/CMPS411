# RAG Pipeline Component

This directory contains document ingestion logic and Lambda functions for the RAG pipeline.

## Status
🚧 Not yet implemented - coming in Phase 1

## Documentation
See [docs/workflows/workflow_rag_pipeline.md](../docs/workflows/workflow_rag_pipeline.md) for development workflow.

## Structure (Planned)
```
rag-pipeline/
├── lambda/
│   ├── document_processor/
│   │   ├── handler.py
│   │   └── requirements.txt
│   └── ingestion_trigger/
│       ├── handler.py
│       └── requirements.txt
├── scripts/
│   ├── upload_documents.py
│   ├── test_retrieval.py
│   └── monitor_ingestion.py
├── documents/
│   └── README.md
└── config/
    └── kb_config.json
```

## Tech Stack
- AWS S3 (document storage)
- AWS Lambda (ingestion triggers)
- AWS Bedrock Knowledge Base (vector storage)
- Titan Embeddings (embedding model)
- Python (Lambda function code)

## Responsibilities
- Upload clinical documents to S3
- Trigger ingestion into Bedrock Knowledge Base
- Monitor ingestion status
- Test retrieval quality
- Tune chunking and embedding parameters

## Next Steps
1. Create S3 bucket (coordinate with Infra lead)
2. Set up Bedrock Knowledge Base (coordinate with Infra lead)
3. Prepare sample clinical documents
4. Write upload scripts
5. Test retrieval quality
