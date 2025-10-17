import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bot, Trash2, Eye, Play, Pause, MoreVertical, Calendar, Brain, Wrench } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast'

const AgentList = ({ agents, setAgents }) => {
  const { toast } = useToast()
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const handleDeleteAgent = (agentId) => {
    setAgents(agents.filter(agent => agent.agentId !== agentId))
    toast({
      title: "Agent Deleted",
      description: "The agent has been successfully deleted",
    })
  }

  const handleViewDetails = (agent) => {
    setSelectedAgent(agent)
    setIsDetailsOpen(true)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'PREPARED': return 'bg-green-500'
      case 'CREATING': return 'bg-yellow-500'
      case 'FAILED': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-2 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Your Agents
          </CardTitle>
          <CardDescription>
            Manage and monitor your deployed AI agents
            {agents.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {agents.length} {agents.length === 1 ? 'agent' : 'agents'}
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {agents.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No agents yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first agent to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {agents.map(agent => (
                <Card key={agent.agentId} className="border-2 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold">{agent.agentName}</h3>
                              <Badge variant="outline" className={`${getStatusColor(agent.status)} text-white border-0`}>
                                {agent.status}
                              </Badge>
                            </div>
                            {agent.description && (
                              <p className="text-sm text-muted-foreground">{agent.description}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs">
                          <Badge variant="secondary" className="gap-1">
                            <Brain className="w-3 h-3" />
                            {agent.foundationModel.split('/').pop()}
                          </Badge>
                          {agent.tools.length > 0 && (
                            <Badge variant="secondary" className="gap-1">
                              <Wrench className="w-3 h-3" />
                              {agent.tools.length} {agent.tools.length === 1 ? 'tool' : 'tools'}
                            </Badge>
                          )}
                          <Badge variant="secondary" className="gap-1">
                            <Calendar className="w-3 h-3" />
                            Created {formatDate(agent.createdAt)}
                          </Badge>
                        </div>

                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground font-mono">
                            Agent ID: {agent.agentId}
                          </p>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(agent)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Play className="w-4 h-4 mr-2" />
                            Test Agent
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause Agent
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteAgent(agent.agentId)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Agent
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Agent Details
            </DialogTitle>
            <DialogDescription>
              Complete configuration and settings for this agent
            </DialogDescription>
          </DialogHeader>
          {selectedAgent && (
            <div className="space-y-4 py-4">
              <div>
                <h4 className="font-semibold mb-2">Basic Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="col-span-2 font-medium">{selectedAgent.agentName}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Agent ID:</span>
                    <span className="col-span-2 font-mono text-xs">{selectedAgent.agentId}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="col-span-2">
                      <Badge variant="outline" className={`${getStatusColor(selectedAgent.status)} text-white border-0`}>
                        {selectedAgent.status}
                      </Badge>
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Instructions</h4>
                <p className="text-sm bg-muted/50 p-3 rounded-lg">{selectedAgent.instructions}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Foundation Model</h4>
                <Badge variant="secondary">{selectedAgent.foundationModel}</Badge>
              </div>

              {selectedAgent.tools.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Tools ({selectedAgent.tools.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAgent.tools.map(tool => (
                      <Badge key={tool} variant="outline">{tool}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedAgent.actionGroups.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Action Groups ({selectedAgent.actionGroups.length})</h4>
                  <div className="space-y-2">
                    {selectedAgent.actionGroups.map(ag => (
                      <div key={ag.id} className="text-sm bg-muted/50 p-3 rounded-lg">
                        <div className="font-medium">{ag.name}</div>
                        <div className="text-muted-foreground text-xs">{ag.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedAgent.knowledgeBases.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Knowledge Bases ({selectedAgent.knowledgeBases.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAgent.knowledgeBases.map(kb => (
                      <Badge key={kb} variant="outline">{kb}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2">Advanced Settings</h4>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Session Timeout:</span>
                    <span className="col-span-2">{selectedAgent.idleSessionTTL} seconds</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Session Memory:</span>
                    <span className="col-span-2">
                      {selectedAgent.memoryConfiguration.enabledMemoryTypes.includes('SESSION_SUMMARY') ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Timestamps</h4>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="col-span-2">{formatDate(selectedAgent.createdAt)}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Updated:</span>
                    <span className="col-span-2">{formatDate(selectedAgent.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AgentList

