# Claude Code Cheat Sheet

Quick reference for interacting with Claude Code efficiently in this project.

## Special Commands

### Add Context
```
Add context: [your information here]
```
Automatically adds information to CLAUDE.md for future sessions. Use this to document decisions, architecture changes, or project updates that Claude should remember.

**Example**:
```
Add context: We decided to use Vite instead of Create React App for the frontend build tool.
```

### Reobtain Context
```
reobtain context from CLAUDE.md
```
Forces Claude to re-read CLAUDE.md and refresh its understanding of the project. Use this if context seems stale or after CLAUDE.md is updated.

---

## Efficient Interaction Tips

### ✅ DO: Be Direct and Specific
```
Good: "Create a FastAPI endpoint for patient medications in mcp-server/tools/medications.py"
Bad:  "Can you help me with the MCP server?"
```

### ✅ DO: Reference Your Component
```
"I'm working on Epic 3 (LLM Orchestrator). Show me how to call Bedrock KB."
```
Claude knows the epic structure and can tailor responses to your component.

### ✅ DO: Ask for Workflow Guidance
```
"Show me the workflow for testing MCP tools locally"
"What's the deployment process for the chat UI?"
```
Claude has component-specific workflows in `docs/workflows/`.

### ✅ DO: Request Parallel Actions
```
"Read the docker-compose.yml and the MCP server Dockerfile in parallel"
```
Claude can execute multiple file reads or searches simultaneously for speed.

### ❌ DON'T: Assume Claude Remembers Previous Sessions
Each session starts fresh. Use "Add context" for permanent memory or reference CLAUDE.md explicitly.

---

## Common Tasks

### Getting Project Context
```
"What's the architecture for [component]?"
"Show me the project structure"
"What are the 6 Jira epics?"
```

### Finding Files
```
"Find all Python files in mcp-server"
"Search for database connection code"
"Show me the docker-compose.yml"
```

### Code Tasks
```
"Create a new MCP tool for patient labs"
"Add error handling to the Bedrock API client"
"Write tests for the medications endpoint"
```

### Documentation
```
"Explain how RAG ingestion works"
"What environment variables does my component need?"
"Show me the workflow guide for my epic"
```

### Docker/Infrastructure
```
"Update docker-compose to add a new service"
"Show me how to test dependencies in the container"
"What ports are each service using?"
```

---

## Project-Specific Context

### Your Component's Workflow Guide
```
"Show me the workflow guide for [chat-ui/llm-orchestrator/mcp-server/rag-pipeline]"
```
Claude will read and explain your component's development workflow.

### Dependencies Between Components
```
"What does the LLM Orchestrator need from the MCP server?"
"How does the Chat UI communicate with the backend?"
```

### Environment Variables
```
"What environment variables does [component] need?"
"Show me the .env file structure for local dev"
```

---

## Advanced Tips

### Parallel Operations
Claude can do multiple things at once:
```
"Read main.py, config.py, and requirements.txt in parallel"
"Search for 'DATABASE_URL' and 'Bedrock' across the codebase"
```

### Referencing Documentation
```
"Check the tech stack guide and explain AWS Bedrock KB"
"Based on the MCP workflow doc, how do I test my tools?"
```

### Architecture Questions
```
"Why are we using Bedrock KB instead of Milvus?"
"Explain the containerization strategy"
```
Claude has access to architectural decisions documented in CLAUDE.md.

### Code Generation
```
"Generate a SQLAlchemy model for the medications table"
"Create a FastAPI route for patient search"
"Write a test for the get_patient_medications tool"
```

---

## Working with Multiple Files

### Batch File Operations
```
"Update all import statements in mcp-server/tools/ to use the new config"
"Add type hints to all functions in the models directory"
```

### Cross-Component Changes
```
"Update the API contract between chat-ui and llm-orchestrator"
"Ensure environment variables are consistent across docker-compose and Dockerfiles"
```

---

## Git Operations

### Commits
```
"Commit these changes with an appropriate message"
"Stage the MCP server changes and create a commit"
```
Claude follows git best practices and includes co-author attribution.

### Pull Requests
```
"Create a PR for the patient medications feature"
"Summarize the changes in this branch for a PR description"
```

### Status Checks
```
"Show me git status"
"What files have changed?"
```

---

## Getting Unstuck

### When You're Blocked
```
"I'm getting a connection error in the MCP server. Help debug."
"The docker container won't start. Check the logs and Dockerfile."
```

### Understanding Errors
```
"Explain this error message: [paste error]"
"Why is pytest failing on this test?"
```

### Architecture Clarity
```
"I'm confused about how RAG and MCP work together. Explain the flow."
"Draw out the data flow from user query to response."
```

---

## Team Coordination

### Dependency Questions
```
"What does the RAG team need to provide before I can integrate?"
"Who should I coordinate with about database schema changes?"
```
(Answer: Infra lead for schema, check workflow docs for dependencies)

### Documentation Updates
```
"Update the workflow doc to reflect our new testing approach"
"Add a note to CLAUDE.md about the new API endpoint format"
```

---

## Don't Commit Temp Files!

⚠️ **Important**: Files starting with `temp_` should never be committed.
```
"Check if there are any temp_ files staged for commit"
```

---

## Session Management

### Starting a Session
```
"I'm working on Epic [X]. Show me what's in my component directory."
```

### Context Refresh
If Claude seems to have stale context:
```
"reobtain context from CLAUDE.md"
```

### Ending a Session
Before you stop working:
```
"Summarize what we accomplished today"
"What should I work on next?"
```

---

## Quick Reference Commands

| Task | Command Example |
|------|----------------|
| **Add permanent context** | `Add context: We're using Vite for the build tool` |
| **Refresh context** | `reobtain context from CLAUDE.md` |
| **Find files** | `Find all Python files in mcp-server` |
| **Read file** | `Read mcp-server/main.py` |
| **Search code** | `Search for "DATABASE_URL" in all files` |
| **Create file** | `Create a new tool file mcp-server/tools/labs.py` |
| **Edit file** | `Update the patient search function to include email` |
| **Run command** | `Run docker compose ps` |
| **Git status** | `Show me git status and recent commits` |
| **Commit changes** | `Commit these changes` |
| **Explain concept** | `Explain how MCP tools work` |
| **Show workflow** | `Show me the workflow for my epic` |

---

## Pro Tips

1. **Be specific about file paths**: Claude works faster when you specify exact paths
2. **Use parallel operations**: Ask for multiple file reads at once
3. **Reference epics by number**: "Epic 3" is clear shorthand for "LLM Orchestrator"
4. **Ask for explanations**: Claude can explain architectural decisions from CLAUDE.md
5. **Update docs as you go**: Use "Add context" to keep CLAUDE.md current
6. **Check workflow docs first**: Your epic's workflow doc has component-specific guidance
7. **Coordinate via Infra lead**: Docker, dependencies, and deployment go through Infra

---

## Need Help?

- **Project architecture**: "Explain the [component] architecture"
- **Workflow questions**: "Show me the workflow doc for my epic"
- **Technical concepts**: "Explain AWS Bedrock Knowledge Base"
- **Stuck on task**: "Help me debug [specific issue]"
- **Not sure what to ask**: "I'm working on [feature]. What do I need to know?"

---

**Remember**: Claude Code has full project context from CLAUDE.md. Reference it, ask architecture questions, and use "Add context" to keep the knowledge base current for the whole team!
