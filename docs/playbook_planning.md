# Planning

## Purpose

The purpose of this document is to initiate and revise the operational plan to accomplish the tasks necessary for our capstone project.

## Roles

| **Role**      | **Description**                                                                         | **Primary** | **Secondary** |
| ------------- | --------------------------------------------------------------------------------------- | ----------- | ------------- |
| Infra         | Design & maintain environment.                                                          | Adriean     |               |
| RAG           | Build & tune document ingestion & retrieval so AI can answer questions                  |             |               |
| MCP           | Implement MCP tools that allow the AI to safely query and interact with structured data |             |               |
| Integration   | Ensure all components (UI, RAG, MCP) work together cohesively                           |             | Adriean       |
| Documentation | Create & maintain clear technical docs, diagrams, and guides                            |             |               |

## Phase 0 - Orientation and alignment (Week 2)

**Goal**: Everyone understands what we're building and why

**Everyone**
- Read the project brief together
- Align on definitions (RAG, MCP, Bedrock, ECS)
- Agree on repo structure
- Decide roles (above)

**Outputs**
- `spec.md` (high-level) 
- Architecture sketch (even a bad one)
- Jira epics created

## Phase 1 - Foundations (Week 3-5)

**Goal**: Skeleton system running, even if it does almost nothing

#### Infra Lead

- AWS access sanity check
- Deploy provided UI to ECS
- Confirm it runs (even if empty)

#### RAG Lead

- Create S3 bucket
- Upload sample PDFs
- Create Bedrock Knowledge Base
- Test basic semantic search

#### MCP Lead

- Skeleton MCP server
- Connect to shared database
- Implement _1 simple tool_ (e.g., patient lookup)

#### Integration Lead

- Understand how UI talks to KB + MCP
- Test example queries manually
- Start prompt notes

#### Docs Lead

- Repo README
- Architecture v1
- Tool catalog template

## Phase 2 - Core capabilities (Weeks 6-10)

**Goal**: RAG works, MCP tools work, UI connects to both

#### RAG Lead

- Chunking strategy improvements
- Test retrieval quality
- Add more document types
- Validate citations

#### MCP Lead

- Build remaining 7–9 tools
- Write unit tests
- Handle edge cases (no results, bad input)

#### Integration Lead

- Prompt tuning
- Tool selection logic
- Combined queries (docs + DB)
- Error recovery behavior

#### Infra Lead

- ECS task configs
- Secrets management
- Logging setup
- Cost awareness

#### Docs Lead

- Tool documentation
- Example queries
- Test scenarios

## Phase 3 - Integration, hardening, observability (Weeks 11-14)

**Goal**: System works end-to-end reliably, not just in demos

**Everyone**
- Fix flaky behavior
- Improve error messages
- Add structured logging
- Load test lightly
- Verify permissions

Optional stretch goals:
- Guardrails
- Auth    
- Performance tuning

## Phase 4 - Polish, docs, demo prep (Weeks 15-16)

**Goal**: Clear story, clean repo, strong final presentation

- Clear demo story
- Clean architecture diagrams
- Walkthrough slides
- Final documentation

## Other

### Potential common clinical queries (MCP tools)

- Patient demographics / search
- Medications per patient
- Lab results per patient
- Encounters / visits history
- Patients missing checkups
- Aggregate statistics by condition
- Conflicting medications (cross-reference)
- Recent prescriptions or changes