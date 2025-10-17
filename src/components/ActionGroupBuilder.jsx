import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Settings, Plus, Trash2, Code } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const ActionGroupBuilder = ({ actionGroups, onActionGroupsChange }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newActionGroup, setNewActionGroup] = useState({
    name: '',
    description: '',
    apiSchema: '',
    lambdaArn: ''
  })

  const handleAddActionGroup = () => {
    if (!newActionGroup.name) return
    
    const actionGroup = {
      id: `ag-${Date.now()}`,
      ...newActionGroup,
      createdAt: new Date().toISOString()
    }
    
    onActionGroupsChange([...actionGroups, actionGroup])
    setNewActionGroup({
      name: '',
      description: '',
      apiSchema: '',
      lambdaArn: ''
    })
    setIsDialogOpen(false)
  }

  const handleRemoveActionGroup = (id) => {
    onActionGroupsChange(actionGroups.filter(ag => ag.id !== id))
  }

  return (
    <Card className="glass-effect border-0 shadow-lg hover-lift gradient-border animate-slide-up action-group-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="p-1.5 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg shadow-md">
            <Settings className="w-4 h-4 text-white" />
          </div>
          <span className="gradient-text">Action Groups ({actionGroups.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {actionGroups.slice(0, 2).map(ag => (
            <div
              key={ag.id}
              className="p-2 border-2 border-violet-200 dark:border-violet-700 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Code className="w-3 h-3 text-violet-600 dark:text-violet-400 flex-shrink-0 animate-float" />
                    <h4 className="font-bold text-xs truncate text-violet-800 dark:text-violet-200">{ag.name}</h4>
                  </div>
                  <p className="text-xs text-violet-600 dark:text-violet-300 truncate">{ag.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveActionGroup(ag.id)}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all duration-200 hover:scale-110"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {actionGroups.length > 2 && (
          <div className="text-center">
            <button className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-200 transition-colors font-medium hover:scale-105 transform duration-200">
              +{actionGroups.length - 2} more action groups
            </button>
          </div>
        )}

        {actionGroups.length === 0 && (
          <div className="text-center py-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-violet-200 dark:border-violet-700">
            <p className="text-sm text-violet-700 dark:text-violet-300 font-medium">
              No action groups configured
            </p>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full gap-1.5 text-sm h-9 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              <Plus className="w-3.5 h-3.5" />
              Add Action Group
            </Button>
          </DialogTrigger>
          <DialogContent className="dialog-content-responsive">
            <DialogHeader>
              <DialogTitle>Create Action Group</DialogTitle>
              <DialogDescription>
                Define a new action group to extend your agent's capabilities with custom APIs
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="ag-name">Action Group Name *</Label>
                <Input
                  id="ag-name"
                  value={newActionGroup.name}
                  onChange={(e) => setNewActionGroup({...newActionGroup, name: e.target.value})}
                  placeholder="e.g., CustomerDataAPI"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ag-description">Description</Label>
                <Textarea
                  id="ag-description"
                  value={newActionGroup.description}
                  onChange={(e) => setNewActionGroup({...newActionGroup, description: e.target.value})}
                  placeholder="Describe what this action group does"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ag-lambda">Lambda Function ARN</Label>
                <Input
                  id="ag-lambda"
                  value={newActionGroup.lambdaArn}
                  onChange={(e) => setNewActionGroup({...newActionGroup, lambdaArn: e.target.value})}
                  placeholder="arn:aws:lambda:us-east-1:123456789012:function:my-function"
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ag-schema">API Schema (OpenAPI)</Label>
                <Textarea
                  id="ag-schema"
                  value={newActionGroup.apiSchema}
                  onChange={(e) => setNewActionGroup({...newActionGroup, apiSchema: e.target.value})}
                  placeholder='{"openapi": "3.0.0", "info": {...}, "paths": {...}}'
                  rows={4}
                  className="font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Provide an OpenAPI 3.0 schema defining the API endpoints
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddActionGroup} disabled={!newActionGroup.name}>
                  Add Action Group
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default ActionGroupBuilder

