import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wrench, Check } from 'lucide-react'

const ToolSelector = ({ selectedTools, onToolsChange, availableTools }) => {
  const toggleTool = (toolId) => {
    if (selectedTools.includes(toolId)) {
      onToolsChange(selectedTools.filter(id => id !== toolId))
    } else {
      onToolsChange([...selectedTools, toolId])
    }
  }

  return (
    <Card className="glass-effect border-0 shadow-lg hover-lift gradient-border animate-slide-up">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="p-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-md">
            <Wrench className="w-4 h-4 text-white" />
          </div>
          <span className="gradient-text">Tools ({selectedTools.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {availableTools.slice(0, 6).map(tool => {
            const isSelected = selectedTools.includes(tool.id)
            return (
              <div
                key={tool.id}
                onClick={() => toggleTool(tool.id)}
                className={`
                  interactive-card p-2 rounded-lg border-2 text-center transition-all duration-300
                  ${isSelected 
                    ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 shadow-md neon-glow' 
                    : 'border-orange-200 dark:border-orange-700 hover:border-orange-400 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-red-50/50 dark:hover:from-orange-900/10 dark:hover:to-red-900/10'
                  }
                `}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="relative">
                    <span className="text-xl animate-float">{tool.icon}</span>
                    {isSelected && (
                      <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center animate-bounce-in">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-bold text-xs leading-tight text-orange-800 dark:text-orange-200">{tool.name}</h4>
                </div>
              </div>
            )
          })}
        </div>
        
        {availableTools.length > 6 && (
          <div className="text-center">
            <button className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200 transition-colors font-medium hover:scale-105 transform duration-200">
              +{availableTools.length - 6} more tools
            </button>
          </div>
        )}

        {selectedTools.length === 0 && (
          <div className="text-center py-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-700">
            <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
              No tools selected
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ToolSelector

