# Chat UI Workflow (Epic 1: Frontend Chat Interface)

## Component Overview

The Chat UI is the user-facing interface where healthcare professionals interact with the system. It sends queries to the LLM Orchestrator and displays responses from both RAG (clinical documents) and MCP (patient data) sources.

## What This Component Does

- Provides chat interface for user queries
- Displays AI responses with citations
- Shows loading states and error messages
- Handles user authentication (stretch goal)
- Responsive design for desktop/tablet use

## Technology Stack

- Frontend Framework: React or Vue (TBD by team)
- Containerized with Nginx for serving static files
- Communicates with LLM Orchestrator via REST API or WebSocket

## Local Development Workflow

### Getting Started

1. Clone the repository
2. Navigate to `chat-ui/` directory
3. The Infra lead will have Docker environment set up - run `docker compose up` from `infra/docker/`
4. Your code is mounted into the container - changes reflect immediately (hot reload)
5. Access the UI at `http://localhost:3000`

### Development Process

1. **Work on your local machine**: All code lives in `chat-ui/src/`
2. **File changes are live**: The Docker container mounts your local directory - no rebuild needed
3. **Test in browser**: Use Chrome DevTools to debug, test API calls to LLM Orchestrator
4. **Commit frequently**: Push working features to feature branches, create PRs for review

### Key Files

```
chat-ui/
├── Dockerfile              # Managed by Infra lead
├── package.json            # Dependencies (coordinate with Infra lead for changes)
├── src/
│   ├── components/         # React/Vue components
│   ├── api/                # API client for LLM Orchestrator
│   └── utils/              # Helper functions
└── public/                 # Static assets
```

## Dependencies on Other Components

### LLM Orchestrator (Epic 3)
- **What you need**: API endpoint URL and request/response format
- **Communication**: Work with LLM team to define API contract
- **Example**: `POST /api/query` with `{"query": "What is patient 123's blood pressure?"}`

### Infra (Epic 2)
- **What you need**: Environment variables for API endpoints
- **Communication**: Request env var setup for dev vs production URLs
- **Example**: `VITE_API_URL=http://localhost:8080` (dev) vs `https://api.example.com` (prod)

## Configuration via Environment Variables

Your component should read configuration from environment variables:

```javascript
// Example: .env.local (not committed)
VITE_API_URL=http://localhost:8080
VITE_ENABLE_AUTH=false
```

For production, the Infra lead will configure these in the ECS task definition.

## Testing Approach

### During Development
- Manual testing in browser
- Use mock API responses if LLM Orchestrator isn't ready
- Test loading states, error handling, edge cases

### Before Deployment
- Cross-browser testing (Chrome, Firefox, Safari)
- Responsive design testing (desktop, tablet)
- Integration testing with real LLM Orchestrator endpoint

## Communicating with Infra Lead

### When You Need:
- New npm dependencies added to `package.json`
- Environment variables configured
- API endpoints changed
- Deployment issues or container problems

### How to Communicate:
- Log issues in Jira under Epic 2 (Infrastructure)
- Document dependency changes in PR descriptions
- Don't modify Dockerfile or docker-compose.yml directly

## Deployment

Deployment is handled by the Infra lead via CI/CD pipeline:
- Push code to `main` branch
- GitHub Actions builds Docker image
- Image pushed to AWS ECR
- ECS service updated automatically

You don't need to worry about deployment mechanics - just ensure your code works in the Docker container locally.

## Tips

- Use mock data initially to develop UI components before APIs are ready
- Document API contracts with LLM Orchestrator team early
- Keep components modular and reusable
- Test error states (network failures, empty responses, etc.)
- Use environment variables for all configuration - never hardcode URLs
