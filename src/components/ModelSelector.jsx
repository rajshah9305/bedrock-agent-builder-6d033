import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Brain, Zap, Eye, Wrench } from 'lucide-react'

const ModelSelector = ({ selectedModel, onModelSelect, availableModels }) => {
  const [showOptimizedOnly, setShowOptimizedOnly] = useState(true)

  const filteredModels = showOptimizedOnly 
    ? availableModels.filter(m => m.optimizedForAgents)
    : availableModels

  const modelsByProvider = filteredModels.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = []
    }
    acc[model.provider].push(model)
    return acc
  }, {})

  const getCapabilityIcon = (capability) => {
    switch(capability) {
      case 'text': return <Brain className="w-3 h-3" />
      case 'vision': return <Eye className="w-3 h-3" />
      case 'tool-use': return <Wrench className="w-3 h-3" />
      default: return null
    }
  }

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-green-600 dark:text-green-400" />
          Foundation Model Selection
        </CardTitle>
        <CardDescription>Choose the AI model that powers your agent</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <Checkbox
            id="optimizedOnly"
            checked={showOptimizedOnly}
            onCheckedChange={setShowOptimizedOnly}
          />
          <label
            htmlFor="optimizedOnly"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Show only Bedrock Agents optimized models
          </label>
        </div>

        <div className="space-y-2">
          <Label>Select Model *</Label>
          <div className="grid gap-3">
            {Object.entries(modelsByProvider).map(([provider, models]) => (
              <div key={provider} className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground px-2">{provider}</h3>
                {models.map(model => (
                  <div
                    key={model.id}
                    onClick={() => onModelSelect(model.id)}
                    className={`
                      p-4 border-2 rounded-lg cursor-pointer transition-all
                      ${selectedModel === model.id 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-md scale-[1.02]' 
                        : 'border-border hover:border-blue-300 hover:bg-accent/50'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{model.name}</h4>
                          {model.optimizedForAgents && (
                            <Badge variant="secondary" className="text-xs gap-1">
                              <Zap className="w-3 h-3" />
                              Optimized
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{model.description}</p>
                        <div className="flex gap-1 mt-2">
                          {model.capabilities.map(cap => (
                            <Badge key={cap} variant="outline" className="text-xs gap-1">
                              {getCapabilityIcon(cap)}
                              {cap}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {selectedModel === model.id && (
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {filteredModels.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No models available with current filters</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ModelSelector

