// api/agents/create.js
import { BedrockAgentClient, CreateAgentCommand } from "@aws-sdk/client-bedrock-agent";

// Initialize AWS Bedrock Agent Client
const client = new BedrockAgentClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      agentName,
      description,
      instructions,
      foundationModel,
      idleSessionTTL,
      tags
    } = req.body;

    // Validate required fields
    if (!agentName || !instructions || !foundationModel) {
      return res.status(400).json({
        error: 'Missing required fields: agentName, instructions, and foundationModel'
      });
    }

    // Create agent command
    const command = new CreateAgentCommand({
      agentName,
      description,
      instruction: instructions,
      foundationModel,
      idleSessionTTLInSeconds: idleSessionTTL || 3600,
      tags: tags || {},
    });

    // Execute the command
    const response = await client.send(command);

    return res.status(200).json({
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
    
    return res.status(500).json({
      error: 'Failed to create agent',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}
