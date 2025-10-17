import { useState, useEffect } from 'react'
import ModelSelector from './ModelSelector'
import ToolSelector from './ToolSelector'
import ActionGroupBuilder from './ActionGroupBuilder'
import KnowledgeBaseSelector from './KnowledgeBaseSelector'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import apiService from '@/services/api'

const AgentBuilder = ({ agents, setAgents }) => {
  const { toast } = useToast()
  const [agentConfig, setAgentConfig] = useState({
    agentName: '',
    description: '',
    instructions: '',
    foundationModel: '',
    tools: [],
    actionGroups: [],
    knowledgeBases: [],
    guardrails: null,
    memoryConfiguration: {
      enabledMemoryTypes: ['SESSION_SUMMARY']
    },
    idleSessionTTL: 3600,
    tags: {}
  })

  const [isCreating, setIsCreating] = useState(false)
  const [availableModels, setAvailableModels] = useState([])
  const [availableTools, setAvailableTools] = useState([])
  const [useRealAPI, setUseRealAPI] = useState(false)

  useEffect(() => {
    fetchAvailableModels()
    fetchAvailableTools()
    checkAPIAvailability()
  }, [])

  const checkAPIAvailability = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || '/api'
      const response = await fetch(`${apiUrl}/health`)
      if (response.ok) {
        setUseRealAPI(true)
        return
      }
    } catch (error) {
      console.log('API not available, using simulated mode')
    }
    setUseRealAPI(false)
  }

  const fetchAvailableModels = async () => {
    try {
      if (useRealAPI) {
        const response = await apiService.getModels()
        if (response.success) {
          setAvailableModels(response.models)
          return
        }
      }
    } catch (error) {
      console.log('Failed to fetch real models, using fallback:', error)
    }
    
    // Fallback to simulated models
    const models = [
      {
        id: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
        name: 'Claude 3.5 Sonnet v2',
        provider: 'Anthropic',
        description: 'Most intelligent model, best for complex tasks',
        optimizedForAgents: true,
        capabilities: ['text', 'vision', 'tool-use']
      },
      {
        id: 'anthropic.claude-3-5-haiku-20241022-v1:0',
        name: 'Claude 3.5 Haiku',
        provider: 'Anthropic',
        description: 'Fast and efficient, great for quick responses',
        optimizedForAgents: true,
        capabilities: ['text', 'vision', 'tool-use']
      },
      {
        id: 'anthropic.claude-3-opus-20240229-v1:0',
        name: 'Claude 3 Opus',
        provider: 'Anthropic',
        description: 'Powerful model for complex reasoning',
        optimizedForAgents: true,
        capabilities: ['text', 'vision', 'tool-use']
      },
      {
        id: 'meta.llama3-2-90b-instruct-v1:0',
        name: 'Llama 3.2 90B Instruct',
        provider: 'Meta',
        description: 'Open-source model with strong performance',
        optimizedForAgents: false,
        capabilities: ['text']
      },
      {
        id: 'mistral.mistral-large-2402-v1:0',
        name: 'Mistral Large (24.02)',
        provider: 'Mistral AI',
        description: 'European model with multilingual capabilities',
        optimizedForAgents: false,
        capabilities: ['text', 'tool-use']
      }
    ]
    setAvailableModels(models)
  }

  const fetchAvailableTools = async () => {
    const tools = [
      { id: 'code_interpreter', name: 'Code Interpreter', description: 'Execute Python code and analyze data', icon: '💻' },
      { id: 'web_search', name: 'Web Search', description: 'Search the internet for information', icon: '🔍' },
      { id: 'file_upload', name: 'File Upload', description: 'Process and analyze uploaded files', icon: '📁' },
      { id: 'database_query', name: 'Database Query', description: 'Query SQL and NoSQL databases', icon: '🗄️' },
      { id: 'api_call', name: 'API Call', description: 'Make HTTP requests to external APIs', icon: '🌐' },
      { id: 'email_sender', name: 'Email Sender', description: 'Send emails via SMTP or SES', icon: '📧' },
      { id: 'calendar', name: 'Calendar', description: 'Manage calendar events and schedules', icon: '📅' },
      { id: 'document_generator', name: 'Document Generator', description: 'Generate PDF, Word, and other documents', icon: '📄' }
    ]
    setAvailableTools(tools)
  }

  const handleCreateAgent = async () => {
    if (!agentConfig.agentName || !agentConfig.instructions || !agentConfig.foundationModel) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Agent Name, Instructions, and Foundation Model)",
        variant: "destructive"
      })
      return
    }

    setIsCreating(true)
    
    try {
      if (useRealAPI) {
        // Real API call to AWS Bedrock
        const response = await apiService.createAgent({
          agentName: agentConfig.agentName,
          description: agentConfig.description,
          instructions: agentConfig.instructions,
          foundationModel: agentConfig.foundationModel,
          idleSessionTTL: agentConfig.idleSessionTTL,
          tags: agentConfig.tags
        })

        if (response.success) {
          const newAgent = {
            ...agentConfig,
            agentId: response.agent.agentId,
            agentArn: response.agent.agentArn,
            status: response.agent.agentStatus,
            createdAt: response.agent.createdAt,
            updatedAt: response.agent.updatedAt
          }
          
          setAgents([...agents, newAgent])
          
          toast({
            title: "Agent Created Successfully! 🎉",
            description: `Agent "${agentConfig.agentName}" has been created with ID: ${response.agent.agentId}`,
          })
        }
      } else {
        // Simulated creation (fallback)
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const newAgent = {
          agentId: `agent-${Date.now()}`,
          ...agentConfig,
          status: 'PREPARED',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        setAgents([...agents, newAgent])
        
        toast({
          title: "Agent Created Successfully! 🎉",
          description: `Agent "${agentConfig.agentName}" has been created (Simulated Mode)`,
        })
      }
      
      // Reset form
      setAgentConfig({
        agentName: '',
        description: '',
        instructions: '',
        foundationModel: '',
        tools: [],
        actionGroups: [],
        knowledgeBases: [],
        guardrails: null,
        memoryConfiguration: {
          enabledMemoryTypes: ['SESSION_SUMMARY']
        },
        idleSessionTTL: 3600,
        tags: {}
      })
    } catch (error) {
      toast({
        title: "Error Creating Agent",
        description: error.message || "Failed to create agent. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {!useRealAPI && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800">
          <CardContent className="pt-6">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ Running in <strong>Simulated Mode</strong>. Configure your API endpoint in .env to connect to real AWS Bedrock.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="border-2 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Basic Configuration
          </CardTitle>
          <CardDescription>Define your agent's identity and purpose</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="agentName">Agent Name *</Label>
            <Input
              id="agentName"
              value={agentConfig.agentName}
              onChange={(e) => setAgentConfig({...agentConfig, agentName: e.target.value})}
              placeholder="e.g., Customer Support Agent"
              className="transition-all focus:scale-[1.01]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={agentConfig.description}
              onChange={(e) => setAgentConfig({...agentConfig, description: e.target.value})}
              placeholder="Describe what your agent does and its main capabilities"
              rows={3}
              className="transition-all focus:scale-[1.01]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions *</Label>
            <Textarea
              id="instructions"
              value={agentConfig.instructions}
              onChange={(e) => setAgentConfig({...agentConfig, instructions: e.target.value})}
              placeholder="Provide detailed instructions for your agent's behavior, tone, and how it should respond to users..."
              rows={6}
              className="transition-all focus:scale-[1.01]"
            />
            <p className="text-xs text-muted-foreground">
              Be specific about the agent's role, constraints, and expected behavior patterns.
            </p>
          </div>
        </CardContent>
      </Card>

      <ModelSelector
        selectedModel={agentConfig.foundationModel}
        onModelSelect={(model) => setAgentConfig({...agentConfig, foundationModel: model})}
        availableModels={availableModels}
      />

      <ToolSelector
        selectedTools={agentConfig.tools}
        onToolsChange={(tools) => setAgentConfig({...agentConfig, tools})}
        availableTools={availableTools}
      />

      <ActionGroupBuilder
        actionGroups={agentConfig.actionGroups}
        onActionGroupsChange={(actionGroups) => setAgentConfig({...agentConfig, actionGroups})}
      />

      <KnowledgeBaseSelector
        selectedKnowledgeBases={agentConfig.knowledgeBases}
        onKnowledgeBasesChange={(knowledgeBases) => setAgentConfig({...agentConfig, knowledgeBases})}
      />

      <Card className="border-2 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
          <CardTitle>Advanced Settings</CardTitle>
          <CardDescription>Fine-tune your agent's behavior and memory</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Session Timeout (seconds)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              value={agentConfig.idleSessionTTL}
              onChange={(e) => setAgentConfig({...agentConfig, idleSessionTTL: parseInt(e.target.value)})}
              min={300}
              max={86400}
              className="transition-all focus:scale-[1.01]"
            />
            <p className="text-xs text-muted-foreground">
              Time in seconds before an idle session expires (300-86400)
            </p>
          </div>

          <div className="space-y-2">
            <Label>Memory Configuration</Label>
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
              <Checkbox
                id="sessionMemory"
                checked={agentConfig.memoryConfiguration.enabledMemoryTypes.includes('SESSION_SUMMARY')}
                onCheckedChange={(checked) => {
                  const types = checked ? ['SESSION_SUMMARY'] : []
                  setAgentConfig({
                    ...agentConfig, 
                    memoryConfiguration: { enabledMemoryTypes: types }
                  })
                }}
              />
              <label
                htmlFor="sessionMemory"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Enable Session Memory
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Allow the agent to remember context within a session for better continuity
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-lg sticky bottom-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
        <CardContent className="pt-6">
          <Button
            onClick={handleCreateAgent}
            disabled={!agentConfig.agentName || !agentConfig.instructions || !agentConfig.foundationModel || isCreating}
            className="w-full h-12 text-lg gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Agent...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Create Agent {useRealAPI ? '(Live)' : '(Simulated)'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default AgentBuilder
