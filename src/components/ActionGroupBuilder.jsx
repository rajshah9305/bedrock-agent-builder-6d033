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
    <Card className="border-2 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30">
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          Action Groups
        </CardTitle>
        <CardDescription>
          Define custom actions your agent can perform via API integrations
          {actionGroups.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {actionGroups.length} configured
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-3">
          {actionGroups.map(ag => (
            <div
              key={ag.id}
              className="p-4 border-2 border-violet-200 dark:border-violet-800 rounded-lg bg-violet-50/50 dark:bg-violet-950/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    <h4 className="font-semibold">{ag.name}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{ag.description}</p>
                  {ag.lambdaArn && (
                    <p className="text-xs text-muted-foreground font-mono bg-background/50 p-1 rounded">
                      Lambda: {ag.lambdaArn}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveActionGroup(ag.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {actionGroups.length === 0 && (
          <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg">
            <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No action groups configured</p>
            <p className="text-xs">Action groups allow your agent to call custom APIs</p>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full gap-2 border-dashed border-2 hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950/30">
              <Plus className="w-4 h-4" />
              Add Action Group
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
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

