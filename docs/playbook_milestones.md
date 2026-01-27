# Milestones

## Purpose

The purpose of this document is to initiate and revise a high-level view of capstone project milestones and improve work clarity.

## 1. RAG

**Why first:**
- It’s **self-contained**
- It doesn’t depend on the database
- It doesn’t require MCP
- It doesn’t require ECS
- It doesn’t require deep IAM complexity
- It gives **visible, understandable progress**
- It teaches core concepts:
    - embeddings
    - chunking
    - retrieval
    - semantic search
    - AI grounding
- You can **see it working** in a human way 
	- “I asked a question → it found the document → it answered correctly.”

**Tech:**
- S3
- Bedrock knowledge base
- Titan embeddings
- Chunking
- Semantic search

**Work looks like:**
- Upload PDFs
- Configure chunk size
- Test queries
- Adjust chunking
- Evaluate results

**Success metric:** 
- I can ask questions about documents and get correct answers with citations.

## 2. Chat UI  (read only)

**Why:**
- Gives human interface to RAG. Goes from abstract AWS APIs to visibility.

**Tech:**
- ECS
- ECR (provided image)
- Bedrock integration

**Work looks like:**
- Deploy UI
- Connect it to KB
- Test document queries

**Success metric:** 
- Non-technical user can ask a question and get an answer from documents.

## 3. MCP server (no AI yet)

**Why:**
- MCP is conceptually complex. Database will want to be understood first.

**Tech:**
- Python
- PostgreSQL
- Simple APIs
- Tool definitions

**Work looks like:**
- Write normal Python DB queries
- Test SQL
- Build normal functions
- Validate outputs

**Success metric:**
- We can programmatically query the database correctly.

## 4. MCP protocol integration

**Why:**
- Now the AI can use real tools

**Tech:**
- MCP server framework
- Tool schemas
- AI tool invocation

**Work looks like:**
- Wrap DB functions as MCP tools
- Define tool inputs/outputs
- Test tool calls
- Validate responses

**Success metric:** 
- AI can call tools and get real data

## 5. RAG + MCP integration

**Why:** 
- Start to put together the real system

**Work looks like:**
- Query docs
- Query DB
- Cross-reference
- Combine responses
- Handle ambiguity

**Success metric:**
- AI uses documents and outputs live data in one anwer.

## 6. ECS / Fargate / Hardening

**Why:**
- Shift focus to:
	- Scaling
	- Observability
	- Deployment polish
	- Cost control
	- Load testing
	- Reliability
