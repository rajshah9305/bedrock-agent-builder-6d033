import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Bot, Play, Copy, Download, Edit3, Save, X, MessageSquare, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const AgentOutput = ({ agents, selectedAgent: preSelectedAgent, onAgentChange }) => {
  const { toast } = useToast()
  const [selectedAgent, setSelectedAgent] = useState(preSelectedAgent)
  const [userInput, setUserInput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [outputs, setOutputs] = useState([])
  const [editingOutput, setEditingOutput] = useState(null)
  const [editedContent, setEditedContent] = useState('')

  // Update selected agent when pre-selected agent changes
  useEffect(() => {
    if (preSelectedAgent) {
      setSelectedAgent(preSelectedAgent)
      if (onAgentChange) onAgentChange(preSelectedAgent)
    }
  }, [preSelectedAgent, onAgentChange])

  const runAgent = async () => {
    if (!selectedAgent || !userInput.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select an agent and enter a task",
        variant: "destructive"
      })
      return
    }

    setIsRunning(true)
    
    // Simulate agent execution
    setTimeout(() => {
      const newOutput = {
        id: Date.now(),
        agentId: selectedAgent.agentId,
        agentName: selectedAgent.agentName,
        input: userInput,
        output: generateMockOutput(userInput, selectedAgent),
        timestamp: new Date().toISOString(),
        status: 'completed'
      }
      
      setOutputs(prev => [newOutput, ...prev])
      setUserInput('')
      setIsRunning(false)
      
      toast({
        title: "Task Completed! ✨",
        description: `Agent "${selectedAgent.agentName}" has finished processing your request`,
      })
    }, 2000)
  }

  const generateMockOutput = (input, agent) => {
    const outputs = [
      `# Analysis Complete\n\nBased on your request: "${input}"\n\nI've analyzed the requirements and here's my comprehensive response:\n\n## Key Findings\n- Identified 3 main areas for improvement\n- Processed data from multiple sources\n- Generated actionable recommendations\n\n## Recommendations\n1. **Immediate Actions**: Implement the suggested changes within 24 hours\n2. **Medium-term Goals**: Plan for scalability improvements\n3. **Long-term Strategy**: Consider advanced automation options\n\n## Next Steps\nWould you like me to elaborate on any specific aspect of this analysis?`,
      
      `# Task Execution Report\n\n**Agent**: ${agent.agentName}\n**Request**: ${input}\n**Status**: ✅ Completed Successfully\n\n## Processing Summary\n- **Duration**: 1.2 seconds\n- **Tools Used**: ${agent.tools.length} tools\n- **Data Sources**: Multiple APIs\n\n## Results\n\`\`\`json\n{\n  "success": true,\n  "confidence": 0.95,\n  "recommendations": [\n    "Option A: High impact, low effort",\n    "Option B: Medium impact, medium effort",\n    "Option C: Low impact, high effort"\n  ]\n}\n\`\`\`\n\n## Conclusion\nThe analysis is complete. All requirements have been addressed with high confidence.`,
      
      `# Creative Solution Generated\n\n## Your Request\n"${input}"\n\n## My Response\nI've crafted a tailored solution that addresses your specific needs:\n\n### 🎯 Core Solution\n- **Primary Approach**: Leveraging AI-driven automation\n- **Secondary Options**: Manual fallback procedures\n- **Success Metrics**: Measurable KPIs defined\n\n### 📊 Expected Outcomes\n- 40% improvement in efficiency\n- 60% reduction in manual work\n- 95% accuracy rate\n\n### 🔧 Implementation Guide\n1. **Phase 1**: Setup and configuration (2 hours)\n2. **Phase 2**: Testing and validation (4 hours)\n3. **Phase 3**: Full deployment (1 day)\n\n*Ready to proceed with implementation?*`
    ]
    
    return outputs[Math.floor(Math.random() * outputs.length)]
  }

  const copyOutput = (output) => {
    navigator.clipboard.writeText(output.output)
    toast({
      title: "Copied! 📋",
      description: "Output copied to clipboard"
    })
  }

  const downloadOutput = (output) => {
    const blob = new Blob([output.output], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `agent-output-${output.id}.md`
    a.click()
    URL.revokeObjectURL(url)
    
    toast({
      title: "Downloaded! 📥",
      description: "Output saved as markdown file"
    })
  }

  const startEditing = (output) => {
    setEditingOutput(output.id)
    setEditedContent(output.output)
  }

  const saveEdit = (outputId) => {
    setOutputs(prev => prev.map(output => 
      output.id === outputId 
        ? { ...output, output: editedContent, edited: true }
        : output
    ))
    setEditingOutput(null)
    setEditedContent('')
    
    toast({
      title: "Saved! ✏️",
      description: "Output has been updated"
    })
  }

  const cancelEdit = () => {
    setEditingOutput(null)
    setEditedContent('')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Agent Runner */}
      <Card className="glass-effect border-0 shadow-xl gradient-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg animate-float">
              <Play className="w-6 h-6 text-white" />
            </div>
            <span className="gradient-text">Run Agent Task</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-purple-700 dark:text-purple-300">Select Agent</label>
              <select
                value={selectedAgent?.agentId || ''}
                onChange={(e) => {
                  const agent = agents.find(a => a.agentId === e.target.value)
                  setSelectedAgent(agent)
                  if (onAgentChange) onAgentChange(agent)
                }}
                className="w-full h-11 px-3 border-2 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-slate-800 focus:border-purple-500 transition-all duration-300"
              >
                <option value="">Choose an agent...</option>
                {agents.filter(agent => agent.status === 'PREPARED').map(agent => (
                  <option key={agent.agentId} value={agent.agentId}>
                    {agent.agentName} - {agent.foundationModel.split('/').pop().split('-')[0]}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-purple-700 dark:text-purple-300">Task Description</label>
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Describe the task you want the agent to perform..."
                className="h-11 border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 transition-all duration-300"
              />
            </div>
          </div>
          
          <Button
            onClick={runAgent}
            disabled={!selectedAgent || !userInput.trim() || isRunning}
            className="w-full h-12 gap-3 text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl animate-gradient"
          >
            {isRunning ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Running Agent...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Execute Task
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Output History */}
      <div className="space-y-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-3 px-6 py-3 glass-effect rounded-2xl shadow-xl">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold gradient-text">
              Agent Outputs ({outputs.length})
            </h2>
          </div>
        </div>

        {outputs.length === 0 ? (
          <Card className="glass-effect border-0 shadow-xl">
            <CardContent className="text-center py-16">
              <div className="animate-float">
                <MessageSquare className="w-24 h-24 mx-auto mb-6 text-purple-400 opacity-60" />
              </div>
              <h3 className="text-2xl font-bold mb-3 gradient-text">No outputs yet</h3>
              <p className="text-muted-foreground text-lg">
                Run an agent task to see the results here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {outputs.map((output, index) => (
              <Card key={output.id} className="glass-effect border-0 shadow-xl hover-lift animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl shadow-lg">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg gradient-text">{output.agentName}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {new Date(output.timestamp).toLocaleString()}
                          {output.edited && <Badge className="bg-orange-500 text-white text-xs">Edited</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {output.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                    <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                      <strong>Input:</strong> {output.input}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-purple-700 dark:text-purple-300">Output:</h4>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyOutput(output)}
                          className="gap-1 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                        >
                          <Copy className="w-4 h-4" />
                          Copy
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadOutput(output)}
                          className="gap-1 hover:bg-green-100 dark:hover:bg-green-900/20"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                        {editingOutput === output.id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => saveEdit(output.id)}
                              className="gap-1 hover:bg-emerald-100 dark:hover:bg-emerald-900/20"
                            >
                              <Save className="w-4 h-4" />
                              Save
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={cancelEdit}
                              className="gap-1 hover:bg-red-100 dark:hover:bg-red-900/20"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(output)}
                            className="gap-1 hover:bg-purple-100 dark:hover:bg-purple-900/20"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {editingOutput === output.id ? (
                      <Textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        rows={12}
                        className="font-mono text-sm border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 transition-all duration-300"
                      />
                    ) : (
                      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 dark:text-gray-200">
                          {output.output}
                        </pre>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AgentOutput