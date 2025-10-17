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
    <Card className="border-2 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30">
        <CardTitle className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          Tools & Capabilities
        </CardTitle>
        <CardDescription>
          Select tools your agent can use to accomplish tasks
          {selectedTools.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {selectedTools.length} selected
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {availableTools.map(tool => {
            const isSelected = selectedTools.includes(tool.id)
            return (
              <div
                key={tool.id}
                onClick={() => toggleTool(tool.id)}
                className={`
                  p-4 border-2 rounded-lg cursor-pointer transition-all
                  ${isSelected 
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 shadow-md scale-[1.02]' 
                    : 'border-border hover:border-orange-300 hover:bg-accent/50'
                  }
                `}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{tool.icon}</span>
                      <h4 className="font-semibold text-sm">{tool.name}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">{tool.description}</p>
                  </div>
                  {isSelected && (
                    <div className="flex-shrink-0">
                      <div className="w-5 h-5 rounded-full bg-orange-600 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {selectedTools.length === 0 && (
          <div className="text-center py-4 text-sm text-muted-foreground bg-muted/30 rounded-lg mt-4">
            No tools selected. Your agent will only use its foundation model capabilities.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ToolSelector

