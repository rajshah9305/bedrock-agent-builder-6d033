# 📚 API Documentation

This document describes the REST API endpoints for the RAJ AI AGENTS application.

## Base URL

- **Development**: `http://localhost:3001/api`
- **Production**: `https://your-domain.com/api`

## Authentication

Currently, the API does not require authentication. In production, consider implementing:
- API keys
- JWT tokens
- OAuth 2.0
- AWS IAM authentication

## Response Format

All API responses follow this format:

```json
{
  "success": true|false,
  "data": {}, // Response data (on success)
  "error": "Error message", // Error message (on failure)
  "message": "Additional info", // Additional information
  "simulation": true|false // Whether running in simulation mode
}
```

## Endpoints

### Health Check

**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### Foundation Models

#### List Available Models

**GET** `/models`

Get list of available foundation models.

**Query Parameters:**
- `provider` (optional): Filter by provider (e.g., "Anthropic", "Meta")
- `optimized` (optional): Filter by agent optimization (true/false)

**Response:**
```json
{
  "success": true,
  "models": [
    {
      "id": "anthropic.claude-3-5-sonnet-20241022-v2:0",
      "name": "Claude 3.5 Sonnet v2",
      "provider": "Anthropic",
      "description": "Most intelligent model, best for complex tasks",
      "optimizedForAgents": true,
      "capabilities": ["text", "vision", "tool-use"],
      "inputModalities": ["TEXT", "IMAGE"],
      "outputModalities": ["TEXT"]
    }
  ],
  "simulation": false
}
```

---

### Agents

#### Create Agent

**POST** `/agents/create`

Create a new AI agent.

**Request Body:**
```json
{
  "agentName": "Customer Support Agent",
  "description": "Handles customer inquiries and support requests",
  "instructions": "You are a helpful customer support agent...",
  "foundationModel": "anthropic.claude-3-5-haiku-20241022-v2:0",
  "idleSessionTTL": 3600,
  "tags": {
    "environment": "production",
    "team": "support"
  }
}
```

**Validation:**
- `agentName`: Required, max 100 characters
- `instructions`: Required, max 2000 characters
- `foundationModel`: Required, must be valid model ID
- `idleSessionTTL`: Optional, 300-86400 seconds

**Response:**
```json
{
  "success": true,
  "agent": {
    "agentId": "agent-1234567890",
    "agentArn": "arn:aws:bedrock:us-east-1:123456789012:agent/agent-1234567890",
    "agentName": "Customer Support Agent",
    "agentStatus": "PREPARED",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "simulation": false
}
```

**Error Responses:**
- `400`: Validation error
- `403`: Access denied
- `500`: Server error

#### List Agents

**GET** `/agents/list`

Get list of all agents.

**Query Parameters:**
- `maxResults` (optional): Maximum number of results (default: 10)
- `nextToken` (optional): Pagination token

**Response:**
```json
{
  "success": true,
  "agents": [
    {
      "agentId": "agent-1234567890",
      "agentName": "Customer Support Agent",
      "agentStatus": "PREPARED",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "nextToken": null,
  "simulation": false
}
```

#### Get Agent Details

**GET** `/agents/{agentId}`

Get detailed information about a specific agent.

**Path Parameters:**
- `agentId`: The ID of the agent

**Response:**
```json
{
  "success": true,
  "agent": {
    "agentId": "agent-1234567890",
    "agentArn": "arn:aws:bedrock:us-east-1:123456789012:agent/agent-1234567890",
    "agentName": "Customer Support Agent",
    "description": "Handles customer inquiries and support requests",
    "instruction": "You are a helpful customer support agent...",
    "foundationModel": "anthropic.claude-3-5-haiku-20241022-v2:0",
    "agentStatus": "PREPARED",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "simulation": false
}
```

#### Delete Agent

**DELETE** `/agents/{agentId}`

Delete a specific agent.

**Path Parameters:**
- `agentId`: The ID of the agent

**Response:**
```json
{
  "success": true,
  "message": "Agent deleted successfully"
}
```

---

### Claude Analysis

#### Analyze Code

**POST** `/claude/analyze`

Analyze code using Claude Haiku for errors and improvements.

**Request Body:**
```json
{
  "code": "function example() {\n  return 'Hello World';\n}",
  "filename": "example.js",
  "language": "javascript"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": "## Analysis for example.js\n\n### 🔴 Critical Issues (Must Fix)\n- None found\n\n### 🟡 Warnings (Should Fix)\n- Consider adding JSDoc comments\n\n### 💡 Suggestions (Nice to Have)\n- Use const instead of function declaration\n\n### ✅ Good Practices Found\n- Proper function structure\n- Clear return statement\n\nOverall code quality: 8/10",
  "modelUsed": "anthropic.claude-3-5-haiku-20241022-v2:0",
  "filename": "example.js",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Quick Analysis (CI/CD)

**POST** `/claude/analyze-quick`

Quick analysis optimized for CI/CD pipelines.

**Request Body:**
```json
{
  "code": "function example() {\n  return 'Hello World';\n}",
  "filename": "example.js"
}
```

**Response:**
```json
{
  "success": true,
  "status": "pass",
  "critical_errors": [],
  "warnings": ["Consider adding JSDoc comments"],
  "score": 8,
  "summary": "Code looks good with minor suggestions",
  "modelUsed": "anthropic.claude-3-5-haiku-20241022-v2:0",
  "filename": "example.js",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Error Handling

### HTTP Status Codes

- `200`: Success
- `400`: Bad Request (validation error)
- `401`: Unauthorized
- `403`: Forbidden (access denied)
- `404`: Not Found
- `429`: Too Many Requests (rate limited)
- `500`: Internal Server Error

### Error Response Format

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details"
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR`: Request validation failed
- `AWS_ACCESS_DENIED`: AWS credentials insufficient
- `MODEL_NOT_FOUND`: Foundation model not found
- `AGENT_NOT_FOUND`: Agent not found
- `RATE_LIMITED`: Too many requests
- `INTERNAL_ERROR`: Server error

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing:

- Per-IP rate limiting
- Per-user rate limiting
- API key-based limits
- AWS Bedrock usage limits

---

## CORS Configuration

The API supports CORS for the following origins:

**Development:**
- `http://localhost:3000`
- `http://localhost:5173`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:5173`

**Production:**
- `https://bedrock-agent-builder.vercel.app`
- `https://raj-ai-agents.vercel.app`
- Your custom domain

---

## Simulation Mode

When AWS credentials are not configured, the API runs in simulation mode:

- Returns mock data instead of real AWS responses
- All operations succeed but don't affect real resources
- Useful for development and testing
- Response includes `"simulation": true`

---

## SDK Examples

### JavaScript/Node.js

```javascript
const API_BASE = 'http://localhost:3001/api';

// Create an agent
async function createAgent(agentData) {
  const response = await fetch(`${API_BASE}/agents/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(agentData),
  });
  
  return response.json();
}

// List agents
async function listAgents() {
  const response = await fetch(`${API_BASE}/agents/list`);
  return response.json();
}

// Analyze code
async function analyzeCode(code, filename, language) {
  const response = await fetch(`${API_BASE}/claude/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, filename, language }),
  });
  
  return response.json();
}
```

### Python

```python
import requests

API_BASE = 'http://localhost:3001/api'

def create_agent(agent_data):
    response = requests.post(f'{API_BASE}/agents/create', json=agent_data)
    return response.json()

def list_agents():
    response = requests.get(f'{API_BASE}/agents/list')
    return response.json()

def analyze_code(code, filename, language='javascript'):
    response = requests.post(f'{API_BASE}/claude/analyze', json={
        'code': code,
        'filename': filename,
        'language': language
    })
    return response.json()
```

### cURL

```bash
# Health check
curl http://localhost:3001/api/health

# List models
curl http://localhost:3001/api/models

# Create agent
curl -X POST http://localhost:3001/api/agents/create \
  -H "Content-Type: application/json" \
  -d '{
    "agentName": "Test Agent",
    "instructions": "You are a helpful assistant",
    "foundationModel": "anthropic.claude-3-5-haiku-20241022-v2:0"
  }'

# List agents
curl http://localhost:3001/api/agents/list

# Analyze code
curl -X POST http://localhost:3001/api/claude/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "code": "function test() { return \"hello\"; }",
    "filename": "test.js",
    "language": "javascript"
  }'
```

---

## Changelog

### v1.0.0
- Initial API release
- Agent CRUD operations
- Foundation model listing
- Claude code analysis
- Simulation mode support

---

**Need help?** Check the [Issues](https://github.com/rajshah9305/bedrock-agent-builder/issues) page or create a new issue.
