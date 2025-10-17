// server.js - Express backend for AWS Bedrock integration
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { BedrockAgentClient, CreateAgentCommand, ListAgentsCommand, GetAgentCommand, DeleteAgentCommand } from "@aws-sdk/client-bedrock-agent";
import { BedrockClient, ListFoundationModelsCommand } from "@aws-sdk/client-bedrock";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Validate required environment variables
const requiredEnvVars = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn(`⚠️  Warning: Missing environment variables: ${missingEnvVars.join(', ')}`);
  console.warn('   The application will run in simulation mode for development.');
}

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://bedrock-agent-builder.vercel.app', 'https://raj-ai-agents.vercel.app']
    : true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message 
  });
});

// AWS Clients (only initialize if credentials are available)
let bedrockAgentClient, bedrockClient, bedrockRuntimeClient;

if (missingEnvVars.length === 0) {
  try {
    bedrockAgentClient = new BedrockAgentClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    bedrockClient = new BedrockClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    bedrockRuntimeClient = new BedrockRuntimeClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    
    console.log('✅ AWS Bedrock clients initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize AWS clients:', error.message);
  }
} else {
  console.log('🔧 Running in simulation mode - AWS clients not initialized');
}

// Routes

// Get available foundation models
app.get('/api/models', async (req, res) => {
  try {
    if (!bedrockClient) {
      // Return mock models when AWS is not configured
      const mockModels = [
        {
          id: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
          name: 'Claude 3.5 Sonnet v2',
          provider: 'Anthropic',
          description: 'Most intelligent model, best for complex tasks',
          optimizedForAgents: true,
          capabilities: ['text', 'vision', 'tool-use'],
          inputModalities: ['TEXT', 'IMAGE'],
          outputModalities: ['TEXT']
        },
        {
          id: 'anthropic.claude-3-5-haiku-20241022-v1:0',
          name: 'Claude 3.5 Haiku',
          provider: 'Anthropic',
          description: 'Fast and efficient, great for quick responses',
          optimizedForAgents: true,
          capabilities: ['text', 'vision', 'tool-use'],
          inputModalities: ['TEXT', 'IMAGE'],
          outputModalities: ['TEXT']
        },
        {
          id: 'anthropic.claude-3-opus-20240229-v1:0',
          name: 'Claude 3 Opus',
          provider: 'Anthropic',
          description: 'Powerful model for complex reasoning',
          optimizedForAgents: true,
          capabilities: ['text', 'vision', 'tool-use'],
          inputModalities: ['TEXT', 'IMAGE'],
          outputModalities: ['TEXT']
        },
        {
          id: 'meta.llama3-2-90b-instruct-v1:0',
          name: 'Llama 3.2 90B Instruct',
          provider: 'Meta',
          description: 'Open-source model with strong performance',
          optimizedForAgents: false,
          capabilities: ['text'],
          inputModalities: ['TEXT'],
          outputModalities: ['TEXT']
        },
        {
          id: 'mistral.mistral-large-2402-v1:0',
          name: 'Mistral Large (24.02)',
          provider: 'Mistral AI',
          description: 'European model with multilingual capabilities',
          optimizedForAgents: false,
          capabilities: ['text', 'tool-use'],
          inputModalities: ['TEXT'],
          outputModalities: ['TEXT']
        }
      ];
      
      return res.json({ 
        success: true, 
        models: mockModels,
        simulation: true,
        message: 'Running in simulation mode - using mock data'
      });
    }

    const command = new ListFoundationModelsCommand({});
    const response = await bedrockClient.send(command);
    
    const models = response.modelSummaries
      .filter(model => model.modelLifecycle.status === 'ACTIVE')
      .map(model => ({
        id: model.modelId,
        name: model.modelName,
        provider: model.providerName,
        inputModalities: model.inputModalities,
        outputModalities: model.outputModalities,
        optimizedForAgents: model.inputModalities.includes('TEXT') && model.outputModalities.includes('TEXT')
      }));

    res.json({ success: true, models, simulation: false });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ 
      error: 'Failed to fetch models', 
      message: error.message,
      simulation: true
    });
  }
});

// Create agent
app.post('/api/agents/create', async (req, res) => {
  try {
    const { agentName, description, instructions, foundationModel, idleSessionTTL, tags } = req.body;

    // Validation
    if (!agentName || !instructions || !foundationModel) {
      return res.status(400).json({
        error: 'Missing required fields: agentName, instructions, and foundationModel'
      });
    }

    if (agentName.length > 100) {
      return res.status(400).json({
        error: 'Agent name must be 100 characters or less'
      });
    }

    if (instructions.length > 2000) {
      return res.status(400).json({
        error: 'Instructions must be 2000 characters or less'
      });
    }

    if (!bedrockAgentClient) {
      // Simulation mode - return mock response
      const mockAgent = {
        agentId: `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        agentArn: `arn:aws:bedrock:${process.env.AWS_REGION || 'us-east-1'}:123456789012:agent/${agentName.toLowerCase().replace(/\s+/g, '-')}`,
        agentName,
        agentStatus: 'PREPARED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return res.json({
        success: true,
        agent: mockAgent,
        simulation: true,
        message: 'Agent created in simulation mode'
      });
    }

    const command = new CreateAgentCommand({
      agentName,
      description,
      instruction: instructions,
      foundationModel,
      idleSessionTTLInSeconds: idleSessionTTL || 3600,
      tags: tags || {},
    });

    const response = await bedrockAgentClient.send(command);

    res.json({
      success: true,
      agent: {
        agentId: response.agent.agentId,
        agentArn: response.agent.agentArn,
        agentName: response.agent.agentName,
        agentStatus: response.agent.agentStatus,
        createdAt: response.agent.createdAt,
        updatedAt: response.agent.updatedAt,
      },
      simulation: false
    });
  } catch (error) {
    console.error('Error creating agent:', error);
    
    // Handle specific AWS errors
    if (error.name === 'ValidationException') {
      return res.status(400).json({ 
        error: 'Validation Error', 
        message: error.message 
      });
    }
    
    if (error.name === 'AccessDeniedException') {
      return res.status(403).json({ 
        error: 'Access Denied', 
        message: 'Insufficient permissions to create agents' 
      });
    }

    res.status(500).json({ 
      error: 'Failed to create agent', 
      message: error.message 
    });
  }
});

// List agents
app.get('/api/agents/list', async (req, res) => {
  try {
    const { maxResults = 10, nextToken } = req.query;

    if (!bedrockAgentClient) {
      // Simulation mode - return empty list
      return res.json({
        success: true,
        agents: [],
        nextToken: null,
        simulation: true,
        message: 'Running in simulation mode - no agents available'
      });
    }

    const command = new ListAgentsCommand({
      maxResults: parseInt(maxResults),
      nextToken: nextToken || undefined,
    });

    const response = await bedrockAgentClient.send(command);

    res.json({
      success: true,
      agents: response.agentSummaries || [],
      nextToken: response.nextToken || null,
      simulation: false
    });
  } catch (error) {
    console.error('Error listing agents:', error);
    res.status(500).json({ 
      error: 'Failed to list agents', 
      message: error.message,
      simulation: true
    });
  }
});

// Get specific agent
app.get('/api/agents/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;

    const command = new GetAgentCommand({ agentId });
    const response = await bedrockAgentClient.send(command);

    res.json({
      success: true,
      agent: response.agent
    });
  } catch (error) {
    console.error('Error getting agent:', error);
    res.status(500).json({ error: 'Failed to get agent', message: error.message });
  }
});

// Delete agent
app.delete('/api/agents/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;

    const command = new DeleteAgentCommand({ agentId });
    await bedrockAgentClient.send(command);

    res.json({ success: true, message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ error: 'Failed to delete agent', message: error.message });
  }
});

// Claude Analysis Endpoints

// Analyze code with Claude
app.post('/api/claude/analyze', async (req, res) => {
  try {
    const { code, filename, language } = req.body;

    if (!code) {
      return res.status(400).json({
        error: 'Code content is required'
      });
    }

    const modelId = process.env.CLAUDE_MODEL_ID || 'anthropic.claude-3-5-haiku-20241022-v2:0';
    
    const prompt = `
Analyze this code for errors, issues, and improvements:

File: ${filename || 'unknown'}
Language: ${language || 'javascript'}
Size: ${code.length} characters

Code:
\`\`\`${language || 'javascript'}
${code}
\`\`\`

Please provide a detailed analysis focusing on:

1. **Syntax Errors**: Any syntax issues that would prevent compilation/runtime
2. **Runtime Errors**: Potential runtime errors, null/undefined access, etc.
3. **Logic Issues**: Logical bugs or incorrect implementations
4. **Performance Issues**: Inefficient code, memory leaks, unnecessary re-renders
5. **Security Vulnerabilities**: XSS, injection attacks, sensitive data exposure
6. **Best Practices**: Code style, naming conventions, React/JS best practices
7. **Accessibility Issues**: Missing ARIA labels, keyboard navigation, etc.
8. **Dependencies**: Missing imports, circular dependencies, unused imports

Format your response as:
## Analysis for ${filename || 'code'}

### 🔴 Critical Issues (Must Fix)
- List critical errors that break functionality

### 🟡 Warnings (Should Fix)  
- List warnings and potential issues

### 💡 Suggestions (Nice to Have)
- List improvement suggestions

### ✅ Good Practices Found
- List positive aspects of the code

Rate the overall code quality from 1-10 and provide a summary.
`;

    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: parseInt(process.env.CLAUDE_MAX_TOKENS) || 4000,
      temperature: parseFloat(process.env.CLAUDE_TEMPERATURE) || 0.1,
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: prompt }]
        }
      ]
    };

    const response = await bedrockRuntimeClient.send(
      new InvokeModelCommand({
        contentType: "application/json",
        body: JSON.stringify(payload),
        modelId: modelId,
      })
    );

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const analysis = responseBody.content[0].text;

    res.json({
      success: true,
      analysis,
      modelUsed: modelId,
      filename,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error analyzing code:', error);
    res.status(500).json({ 
      error: 'Failed to analyze code', 
      message: error.message 
    });
  }
});

// Quick analysis for CI/CD
app.post('/api/claude/analyze-quick', async (req, res) => {
  try {
    const { code, filename } = req.body;

    if (!code) {
      return res.status(400).json({
        error: 'Code content is required'
      });
    }

    const modelId = process.env.CLAUDE_MODEL_ID || 'anthropic.claude-3-5-haiku-20241022-v2:0';
    
    const prompt = `
Quick CI analysis for this code:

File: ${filename || 'unknown'}
Size: ${code.length} characters

Code:
\`\`\`${filename?.split('.').pop() || 'javascript'}
${code}
\`\`\`

Provide ONLY a JSON response with this exact format:
{
  "status": "pass|warn|fail",
  "critical_errors": ["list of critical errors"],
  "warnings": ["list of warnings"],
  "score": 1-10,
  "summary": "brief summary"
}

Focus on:
1. Syntax errors that break builds
2. Runtime errors that crash the app
3. Security vulnerabilities
4. Performance issues
5. Missing dependencies

Be concise and actionable.
`;

    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 2000,
      temperature: 0.0, // Deterministic for CI
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: prompt }]
        }
      ]
    };

    const response = await bedrockRuntimeClient.send(
      new InvokeModelCommand({
        contentType: "application/json",
        body: JSON.stringify(payload),
        modelId: modelId,
      })
    );

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const analysisText = responseBody.content[0].text;
    
    // Try to parse JSON response
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      analysis = {
        status: 'warn',
        critical_errors: [],
        warnings: ['Could not parse AI response'],
        score: 5,
        summary: 'Analysis response parsing failed',
        rawResponse: analysisText
      };
    }

    res.json({
      success: true,
      ...analysis,
      modelUsed: modelId,
      filename,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in quick analysis:', error);
    res.status(500).json({ 
      error: 'Failed to analyze code', 
      message: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Bedrock Agent Builder API running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});