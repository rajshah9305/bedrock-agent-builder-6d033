// server.js - Express backend for AWS Bedrock integration
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { BedrockAgentClient, CreateAgentCommand, ListAgentsCommand, GetAgentCommand, DeleteAgentCommand } from "@aws-sdk/client-bedrock-agent";
import { BedrockClient, ListFoundationModelsCommand } from "@aws-sdk/client-bedrock";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// AWS Clients
const bedrockAgentClient = new BedrockAgentClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const bedrockClient = new BedrockClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Routes

// Get available foundation models
app.get('/api/models', async (req, res) => {
  try {
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

    res.json({ success: true, models });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: 'Failed to fetch models', message: error.message });
  }
});

// Create agent
app.post('/api/agents/create', async (req, res) => {
  try {
    const { agentName, description, instructions, foundationModel, idleSessionTTL, tags } = req.body;

    if (!agentName || !instructions || !foundationModel) {
      return res.status(400).json({
        error: 'Missing required fields: agentName, instructions, and foundationModel'
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
      }
    });
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(500).json({ error: 'Failed to create agent', message: error.message });
  }
});

// List agents
app.get('/api/agents/list', async (req, res) => {
  try {
    const { maxResults = 10, nextToken } = req.query;

    const command = new ListAgentsCommand({
      maxResults: parseInt(maxResults),
      nextToken: nextToken || undefined,
    });

    const response = await bedrockAgentClient.send(command);

    res.json({
      success: true,
      agents: response.agentSummaries || [],
      nextToken: response.nextToken || null,
    });
  } catch (error) {
    console.error('Error listing agents:', error);
    res.status(500).json({ error: 'Failed to list agents', message: error.message });
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Bedrock Agent Builder API running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});