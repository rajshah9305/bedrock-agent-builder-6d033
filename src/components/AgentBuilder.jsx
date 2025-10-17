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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
    } catch (_error) {
      console.log('Failed to fetch real models, using fallback:', _error)
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
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-400/20 to-orange-400/20 border border-amber-300/50 rounded-2xl p-4 glass-effect animate-bounce-in">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-orange-400/10 animate-shimmer" />
          <p className="relative text-sm text-amber-800 dark:text-amber-200 flex items-center gap-3 font-medium">
            <span className="text-2xl animate-bounce">⚠️</span>
            <span><strong>Simulated Mode</strong> - Configure API endpoint in .env for live AWS Bedrock</span>
          </p>
        </div>
      )}

      <div className="symmetry-grid">
        {/* Left Column - Basic Config */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-effect border-0 shadow-lg hover-lift gradient-border animate-slide-up">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-md">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="gradient-text">Basic Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="agentName" className="text-xs font-semibold text-purple-700 dark:text-purple-300">Agent Name *</Label>
                  <Input
                    id="agentName"
                    value={agentConfig.agentName}
                    onChange={(e) => setAgentConfig({...agentConfig, agentName: e.target.value})}
                    placeholder="Customer Support Agent"
                    className="h-9 text-sm border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 transition-all duration-300 hover:shadow-md"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sessionTimeout" className="text-xs font-semibold text-purple-700 dark:text-purple-300">Session Timeout (sec)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={agentConfig.idleSessionTTL}
                    onChange={(e) => setAgentConfig({...agentConfig, idleSessionTTL: parseInt(e.target.value)})}
                    min={300}
                    max={86400}
                    className="h-9 text-sm border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 transition-all duration-300 hover:shadow-md"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-semibold text-purple-700 dark:text-purple-300">Description</Label>
                <Textarea
                  id="description"
                  value={agentConfig.description}
                  onChange={(e) => setAgentConfig({...agentConfig, description: e.target.value})}
                  placeholder="Describe your agent's capabilities and purpose"
                  rows={2}
                  className="resize-none text-sm border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 transition-all duration-300 hover:shadow-md"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="instructions" className="text-xs font-semibold text-purple-700 dark:text-purple-300">Instructions *</Label>
                <Textarea
                  id="instructions"
                  value={agentConfig.instructions}
                  onChange={(e) => setAgentConfig({...agentConfig, instructions: e.target.value})}
                  placeholder="Define your agent's behavior, tone, and response patterns..."
                  rows={3}
                  className="resize-none text-sm border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 transition-all duration-300 hover:shadow-md"
                />
              </div>
              
              <div className="flex items-center space-x-2 p-2.5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700 hover:shadow-md transition-all duration-300">
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
                  className="border-2 border-purple-300 data-[state=checked]:bg-purple-600"
                />
                <label htmlFor="sessionMemory" className="text-xs font-semibold cursor-pointer text-purple-700 dark:text-purple-300">
                  Enable Session Memory
                </label>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToolSelector
              selectedTools={agentConfig.tools}
              onToolsChange={(tools) => setAgentConfig({...agentConfig, tools})}
              availableTools={availableTools}
            />
            
            <KnowledgeBaseSelector
              selectedKnowledgeBases={agentConfig.knowledgeBases}
              onKnowledgeBasesChange={(knowledgeBases) => setAgentConfig({...agentConfig, knowledgeBases})}
            />
          </div>
          
          <ActionGroupBuilder
            actionGroups={agentConfig.actionGroups}
            onActionGroupsChange={(actionGroups) => setAgentConfig({...agentConfig, actionGroups})}
          />
          

        </div>

        {/* Right Column - Model & Preview */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ModelSelector
              selectedModel={agentConfig.foundationModel}
              onModelSelect={(model) => setAgentConfig({...agentConfig, foundationModel: model})}
              availableModels={availableModels}
            />
            
            {/* Agent Preview Card */}
            <Card className="glass-effect border-0 shadow-lg animate-slide-up gradient-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-md">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="gradient-text">Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <p className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-1">Agent Name</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {agentConfig.agentName || 'Not specified'}
                  </p>
                </div>
                
                <div className="p-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
                  <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-200 mb-1">Foundation Model</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {agentConfig.foundationModel ? agentConfig.foundationModel.split('/').pop().split('-')[0] : 'Not selected'}
                  </p>
                </div>
                
                <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                  <p className="text-xs font-semibold text-orange-800 dark:text-orange-200 mb-1">Tools</p>
                  <div className="flex flex-wrap gap-1">
                    {agentConfig.tools.length > 0 ? (
                      agentConfig.tools.slice(0, 2).map(tool => (
                        <span key={tool} className="text-xs bg-orange-200 dark:bg-orange-800 px-1.5 py-0.5 rounded text-xs">
                          {tool.replace('_', ' ')}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">None</span>
                    )}
                    {agentConfig.tools.length > 2 && (
                      <span className="text-xs text-muted-foreground">+{agentConfig.tools.length - 2}</span>
                    )}
                  </div>
                </div>
                
                <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                  <p className="text-xs font-semibold text-purple-800 dark:text-purple-200 mb-1">Knowledge</p>
                  <p className="text-xs text-muted-foreground">
                    {agentConfig.knowledgeBases.length > 0 ? `${agentConfig.knowledgeBases.length} bases` : 'None'}
                  </p>
                </div>
                
                <div className="p-3 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg border border-cyan-200 dark:border-cyan-700">
                  <p className="text-xs font-semibold text-cyan-800 dark:text-cyan-200 mb-1">Actions</p>
                  <p className="text-xs text-muted-foreground">
                    {agentConfig.actionGroups.length > 0 ? `${agentConfig.actionGroups.length} groups` : 'None'}
                  </p>
                </div>
              </div>
              </CardContent>
            </Card>
          </div>
          
          <Button
            onClick={handleCreateAgent}
            disabled={!agentConfig.agentName || !agentConfig.instructions || !agentConfig.foundationModel || isCreating}
            className="w-full h-10 gap-2 text-sm font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 hover:from-purple-700 hover:via-pink-700 hover:to-red-600 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl animate-gradient"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Create Agent
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AgentBuilder
