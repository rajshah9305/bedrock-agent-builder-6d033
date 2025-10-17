// api/agents/list.js
import { BedrockAgentClient, ListAgentsCommand } from "@aws-sdk/client-bedrock-agent";

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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { maxResults = 10, nextToken } = req.query;

    const command = new ListAgentsCommand({
      maxResults: parseInt(maxResults),
      nextToken: nextToken || undefined,
    });

    const response = await client.send(command);

    return res.status(200).json({
      success: true,
      agents: response.agentSummaries || [],
      nextToken: response.nextToken || null,
    });

  } catch (error) {
    console.error('Error listing agents:', error);
    
    return res.status(500).json({
      error: 'Failed to list agents',
      message: error.message,
    });
  }
}
