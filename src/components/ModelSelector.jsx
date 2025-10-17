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
    <Card className="glass-effect border-0 shadow-lg hover-lift gradient-border animate-slide-up">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-1.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg shadow-md">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="gradient-text">Model</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2 p-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-700 hover:shadow-md transition-all duration-300">
          <Checkbox
            id="optimizedOnly"
            checked={showOptimizedOnly}
            onCheckedChange={setShowOptimizedOnly}
            className="border-2 border-blue-300 data-[state=checked]:bg-blue-600"
          />
          <label htmlFor="optimizedOnly" className="text-xs font-semibold cursor-pointer flex items-center gap-1.5 text-blue-700 dark:text-blue-300">
            <Zap className="w-3 h-3 animate-bounce" />
            Optimized Only
          </label>
        </div>

        <div className="space-y-2">
          {Object.entries(modelsByProvider).map(([provider, models]) => (
            <div key={provider} className="space-y-1.5">
              <h3 className="text-xs font-bold text-purple-700 dark:text-purple-300 px-1">{provider}</h3>
              {models.map(model => (
                <div
                  key={model.id}
                  onClick={() => onModelSelect(model.id)}
                  className={`
                    interactive-card p-3 rounded-lg border-2 transition-all duration-300
                    ${selectedModel === model.id 
                      ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 shadow-lg neon-glow' 
                      : 'border-purple-200 dark:border-purple-700 hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 dark:hover:from-purple-900/10 dark:hover:to-pink-900/10'
                    }
                  `}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <h4 className="font-bold text-xs truncate text-purple-800 dark:text-purple-200">{model.name}</h4>
                        {model.optimizedForAgents && (
                          <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs px-1.5 py-0.5 animate-pulse">
                            <Zap className="w-2.5 h-2.5 mr-0.5" />
                            Opt
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 mb-1">{model.description}</p>
                      <div className="flex gap-0.5">
                        {model.capabilities.slice(0, 3).map(cap => (
                          <Badge key={cap} variant="outline" className="text-xs px-1 py-0.5 border-purple-300 text-purple-700 dark:text-purple-300">
                            {getCapabilityIcon(cap)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {selectedModel === model.id && (
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-md animate-bounce-in">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {filteredModels.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="w-12 h-12 mx-auto mb-3 opacity-50 animate-float" />
            <p className="text-sm font-medium">No models available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ModelSelector

