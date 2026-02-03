# RAG Pipeline Workflow (Epic 6: RAG / Knowledge Base Setup)

## Component Overview

The RAG (Retrieval-Augmented Generation) pipeline ingests clinical documents (PDFs, guidelines, protocols) into AWS Bedrock Knowledge Base, making them searchable for the LLM. This component is primarily AWS-managed infrastructure with some custom ingestion logic.

## What This Component Does

- Upload documents to S3
- Trigger ingestion into Bedrock Knowledge Base
- Chunk documents for optimal retrieval
- Generate embeddings using Titan Embeddings
- Store vectors in Bedrock Knowledge Base
- Provide retrieval interface for LLM Orchestrator

## Technology Stack

- AWS S3: Document storage
- AWS Lambda: Ingestion triggers and custom processing
- AWS Bedrock Knowledge Base: Vector storage and semantic search
- Titan Embeddings: Embedding model
- Python: Lambda function code (if custom processing needed)

## Architecture

```
Documents → S3 Bucket → Lambda (optional) → Bedrock KB → Chunking → Titan Embeddings → Vector Store
```

**Note**: Most of this is managed by AWS. Your job is configuration and monitoring.

## Local Development Workflow

RAG pipeline is primarily cloud-based. Local development focuses on:
1. Document preparation scripts
2. Lambda function code (if needed)
3. Testing retrieval quality

### Getting Started

1. Clone the repository
2. Navigate to `rag-pipeline/` directory
3. Work with Infra lead to get AWS access
4. Most work happens in AWS Console and local scripts

### Key Files

```
rag-pipeline/
├── lambda/
│   ├── document_processor/     # Custom document processing (optional)
│   │   ├── handler.py
│   │   └── requirements.txt
│   └── ingestion_trigger/      # S3 trigger handler (optional)
│       ├── handler.py
│       └── requirements.txt
├── scripts/
│   ├── upload_documents.py     # Bulk upload to S3
│   ├── test_retrieval.py       # Test KB queries
│   └── monitor_ingestion.py    # Check ingestion status
├── documents/                  # Sample clinical docs for testing
│   └── README.md
└── config/
    └── kb_config.json          # Knowledge Base configuration
```

## Dependencies on Other Components

### LLM Orchestrator (Epic 3)
- **What they need**: Bedrock Knowledge Base ID
- **Communication**: Share KB ID once created
- **Example**: `BEDROCK_KB_ID=XXXXXXXXXX`

### Infra (Epic 2)
- **What you need**: S3 bucket creation, IAM permissions, Lambda setup
- **Communication**: Work closely with Infra lead for initial setup

## Setup Process

### Phase 1: Initial Setup (Coordinate with Infra Lead)

1. **Create S3 Bucket**
   - Bucket name: `capstone-clinical-documents`
   - Versioning: Enabled
   - Encryption: Enabled

2. **Create Bedrock Knowledge Base**
   - Via AWS Console or Terraform
   - Choose embedding model: Titan Embeddings v2
   - Configure chunking strategy (see below)

3. **Configure Data Source**
   - Point KB to S3 bucket
   - Set up sync schedule (hourly, daily, or manual)

4. **Test Ingestion**
   - Upload sample PDF to S3
   - Verify it appears in Knowledge Base
   - Test retrieval query

### Phase 2: Document Preparation

Your main work is preparing documents for ingestion:

#### Document Types
- Clinical guidelines (PDFs)
- Treatment protocols
- Medical reference documents
- Hospital policies

#### Best Practices
- Use searchable PDFs (not scanned images)
- Clean formatting (remove headers/footers if needed)
- Organize by category in S3 folders
- Use consistent naming conventions

#### Naming Convention
```
s3://capstone-clinical-documents/
├── guidelines/
│   ├── diabetes_treatment_2024.pdf
│   └── sepsis_protocol_2024.pdf
├── protocols/
│   └── medication_administration.pdf
└── references/
    └── drug_interactions_guide.pdf
```

## Chunking Strategy

Bedrock Knowledge Base automatically chunks documents. You can configure:

### Chunking Options
- **Fixed size**: 300 tokens (default)
- **Semantic**: Break at paragraph boundaries
- **Hierarchical**: Preserve document structure

### Recommendation
Start with default (300 tokens), tune based on retrieval quality.

### Custom Chunking (Advanced)
If needed, implement Lambda function for custom preprocessing:
```python
# lambda/document_processor/handler.py
def handler(event, context):
    """
    Custom document processing before ingestion
    - Extract metadata
    - Clean formatting
    - Custom chunking logic
    """
    s3_object = event['Records'][0]['s3']
    # ... processing logic
```

## Uploading Documents

### Manual Upload (AWS Console)
1. Navigate to S3 bucket
2. Upload PDFs
3. Bedrock KB syncs automatically (based on schedule)

### Bulk Upload (Script)
```python
# scripts/upload_documents.py
import boto3

s3 = boto3.client('s3')
bucket = 'capstone-clinical-documents'

# Upload all PDFs from local directory
for file in Path('documents/').glob('*.pdf'):
    s3.upload_file(str(file), bucket, f'guidelines/{file.name}')
    print(f'Uploaded {file.name}')
```

## Testing Retrieval Quality

### Test Queries
Create a test suite of queries to validate retrieval:

```python
# scripts/test_retrieval.py
import boto3

bedrock = boto3.client('bedrock-agent-runtime')

test_queries = [
    "What are the signs of sepsis?",
    "What is the diabetes treatment protocol?",
    "What medications should not be mixed?"
]

for query in test_queries:
    response = bedrock.retrieve(
        knowledgeBaseId='XXXXXXXXXX',
        retrievalQuery={'text': query}
    )
    print(f"Query: {query}")
    print(f"Results: {len(response['retrievalResults'])}")
    for result in response['retrievalResults']:
        print(f"  - {result['content']['text'][:100]}...")
```

### Quality Metrics
- **Retrieval count**: Are relevant documents returned?
- **Relevance score**: Are top results actually relevant?
- **Coverage**: Do queries cover all document types?

### Tuning Retrieval
If results are poor:
1. Adjust chunking size
2. Improve document formatting
3. Add metadata to documents
4. Refine query phrasing in LLM Orchestrator

## Monitoring Ingestion

```python
# scripts/monitor_ingestion.py
import boto3

bedrock = boto3.client('bedrock-agent')

# Check sync status
response = bedrock.get_data_source(
    knowledgeBaseId='XXXXXXXXXX',
    dataSourceId='YYYYYYYYYY'
)

print(f"Status: {response['dataSource']['status']}")
print(f"Last sync: {response['dataSource']['updatedAt']}")
```

## Configuration via Environment Variables

Minimal config needed - mostly handled by Infra lead:

```bash
# For local testing scripts
AWS_REGION=us-east-1
S3_BUCKET=capstone-clinical-documents
BEDROCK_KB_ID=XXXXXXXXXX
```

## Communicating with Infra Lead

### When You Need:
- S3 bucket created
- Bedrock Knowledge Base setup
- IAM permissions for your AWS user (to test uploads)
- Lambda functions deployed (if custom processing needed)
- Help debugging ingestion failures

### How to Communicate:
- Share document requirements (size, format, volume)
- Report ingestion errors or sync failures
- Request KB configuration changes (chunking, embedding model)
- Log issues in Jira under Epic 6

## Testing Approach

### Initial Testing
1. Upload 3-5 sample documents
2. Wait for ingestion (check sync status)
3. Test retrieval with known queries
4. Validate response quality

### Quality Assurance
- Create test query set (20-30 queries)
- Expected results for each query
- Automated testing script
- Track retrieval metrics over time

### Example Test
```python
def test_sepsis_guideline_retrieval():
    query = "What are the diagnostic criteria for sepsis?"
    results = retrieve_from_kb(query)

    # Assert relevant document is in top 3 results
    assert any('sepsis' in r['content'].lower() for r in results[:3])
```

## Deployment

Since this is mostly AWS-managed:
- **Documents**: Upload to S3 (manual or scripted)
- **Lambda functions**: Deployed by Infra lead via CI/CD
- **KB configuration**: Changes via AWS Console or Terraform (Infra lead)

You don't deploy traditional code - you manage document content.

## Tips

- Start with 10-20 well-formatted documents
- Test retrieval early and often
- Document expected queries for each document
- Clean PDFs perform better than scanned images
- Organize S3 folders logically (easier to manage)
- Use metadata (document title, date, category) if supported
- Monitor Bedrock KB costs (per-query pricing)
- Keep local copies of all uploaded documents
- Version control for scripts and configuration

## Stretch Goals

Once basic RAG works:
- Custom document preprocessing (extract tables, images)
- Metadata enrichment (auto-tag documents)
- Multi-modal retrieval (images, charts)
- Retrieval quality dashboard
- A/B testing different chunking strategies

## Example: Complete Upload Workflow

```bash
# 1. Prepare documents locally
cd rag-pipeline/documents/
# ... add clinical PDFs

# 2. Run upload script
python scripts/upload_documents.py

# 3. Monitor ingestion
python scripts/monitor_ingestion.py

# 4. Test retrieval
python scripts/test_retrieval.py

# 5. Share KB ID with LLM Orchestrator team
echo "BEDROCK_KB_ID=XXXXXXXXXX"
```

## Common Issues

### Document Not Retrievable
- Check ingestion status in AWS Console
- Verify PDF is searchable (not scanned image)
- Check file permissions in S3

### Poor Retrieval Quality
- Adjust chunking size
- Improve document formatting
- Add more relevant documents
- Tune query phrasing in LLM Orchestrator

### Ingestion Failures
- Check S3 bucket permissions
- Verify Bedrock KB data source configuration
- Check CloudWatch logs for errors
