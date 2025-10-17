// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Models API
  async getModels() {
    return this.request('/models', {
      method: 'GET',
    });
  }

  // Agent APIs
  async createAgent(agentConfig) {
    return this.request('/agents/create', {
      method: 'POST',
      body: JSON.stringify(agentConfig),
    });
  }

  async listAgents(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return this.request(`/agents/list?${queryParams}`, {
      method: 'GET',
    });
  }

  async getAgent(agentId) {
    return this.request(`/agents/${agentId}`, {
      method: 'GET',
    });
  }

  async deleteAgent(agentId) {
    return this.request(`/agents/${agentId}`, {
      method: 'DELETE',
    });
  }

  async updateAgent(agentId, updates) {
    return this.request(`/agents/${agentId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Action Group APIs
  async createActionGroup(agentId, actionGroupConfig) {
    return this.request(`/agents/${agentId}/action-groups`, {
      method: 'POST',
      body: JSON.stringify(actionGroupConfig),
    });
  }

  // Knowledge Base APIs
  async associateKnowledgeBase(agentId, knowledgeBaseId) {
    return this.request(`/agents/${agentId}/knowledge-bases/${knowledgeBaseId}`, {
      method: 'POST',
    });
  }
}

export default new ApiService();
