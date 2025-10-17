import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Edit3, Save, X, Code, Zap, Globe } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const ActionGroupBuilder = ({ actionGroups, onActionGroupsChange }) => {
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [newActionGroup, setNewActionGroup] = useState({
    name: '',
    description: '',
    lambdaFunctionArn: '',
    actionGroupExecutor: {
      lambda: ''
    },
    apiSchema: {
      payload: {
        type: 'object',
        properties: {}
      }
    }
  })

  const handleAddActionGroup = () => {
    if (!newActionGroup.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Action group name is required",
        variant: "destructive"
      })
      return
    }

    const actionGroup = {
      id: `ag-${Date.now()}`,
      ...newActionGroup,
      createdAt: new Date().toISOString()
    }

    onActionGroupsChange([...actionGroups, actionGroup])
    setNewActionGroup({
      name: '',
      description: '',
      lambdaFunctionArn: '',
      actionGroupExecutor: {
        lambda: ''
      },
      apiSchema: {
        payload: {
          type: 'object',
          properties: {}
        }
      }
    })
    setIsAdding(false)
    
    toast({
      title: "Action Group Added! 🎉",
      description: `Action group "${actionGroup.name}" has been created`,
    })
  }

  const handleDeleteActionGroup = (id) => {
    onActionGroupsChange(actionGroups.filter(ag => ag.id !== id))
    toast({
      title: "Action Group Deleted",
      description: "The action group has been removed",
    })
  }

  const handleEditActionGroup = (id) => {
    const actionGroup = actionGroups.find(ag => ag.id === id)
    setNewActionGroup(actionGroup)
    setEditingId(id)
    setIsAdding(true)
  }

  const handleUpdateActionGroup = () => {
    if (!newActionGroup.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Action group name is required",
        variant: "destructive"
      })
      return
    }

    onActionGroupsChange(actionGroups.map(ag => 
      ag.id === editingId 
        ? { ...ag, ...newActionGroup, updatedAt: new Date().toISOString() }
        : ag
    ))
    
    setNewActionGroup({
      name: '',
      description: '',
      lambdaFunctionArn: '',
      actionGroupExecutor: {
        lambda: ''
      },
      apiSchema: {
        payload: {
          type: 'object',
          properties: {}
        }
      }
    })
    setIsAdding(false)
    setEditingId(null)
    
    toast({
      title: "Action Group Updated! ✏️",
      description: `Action group "${newActionGroup.name}" has been updated`,
    })
  }

  const cancelEdit = () => {
    setNewActionGroup({
      name: '',
      description: '',
      lambdaFunctionArn: '',
      actionGroupExecutor: {
        lambda: ''
      },
      apiSchema: {
        payload: {
          type: 'object',
          properties: {}
        }
      }
    })
    setIsAdding(false)
    setEditingId(null)
  }

  return (
    <Card className="glass-effect border-0 shadow-lg hover-lift gradient-border animate-slide-up action-group-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg shadow-md">
            <Code className="w-4 h-4 text-white" />
          </div>
          <span className="gradient-text">Action Groups ({actionGroups.length})</span>
        </CardTitle>
        <CardDescription>
          Configure Lambda functions and API integrations for your agent
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Action Groups List */}
        {actionGroups.length > 0 && (
          <div className="space-y-3">
            {actionGroups.map((actionGroup, index) => (
              <div key={actionGroup.id} className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-300 animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-purple-800 dark:text-purple-200">{actionGroup.name}</h4>
                      <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs px-2 py-1">
                        <Zap className="w-3 h-3 mr-1" />
                        Lambda
                      </Badge>
                    </div>
                    {actionGroup.description && (
                      <p className="text-xs text-muted-foreground">{actionGroup.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Globe className="w-3 h-3" />
                      <span className="font-mono truncate">{actionGroup.lambdaFunctionArn || 'No ARN specified'}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditActionGroup(actionGroup.id)}
                      className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteActionGroup(actionGroup.id)}
                      className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Form */}
        {isAdding && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-700 animate-bounce-in">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                  {editingId ? 'Edit Action Group' : 'Add New Action Group'}
                </h4>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={editingId ? handleUpdateActionGroup : handleAddActionGroup}
                    className="gap-1 hover:bg-emerald-100 dark:hover:bg-emerald-900/20"
                  >
                    <Save className="w-3 h-3" />
                    {editingId ? 'Update' : 'Add'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={cancelEdit}
                    className="gap-1 hover:bg-red-100 dark:hover:bg-red-900/20"
                  >
                    <X className="w-3 h-3" />
                    Cancel
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="agName" className="text-xs font-semibold text-blue-700 dark:text-blue-300">Name *</Label>
                  <Input
                    id="agName"
                    value={newActionGroup.name}
                    onChange={(e) => setNewActionGroup({...newActionGroup, name: e.target.value})}
                    placeholder="Customer API Actions"
                    className="h-9 text-sm border-2 border-blue-200 dark:border-blue-700 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="agLambda" className="text-xs font-semibold text-blue-700 dark:text-blue-300">Lambda ARN</Label>
                  <Input
                    id="agLambda"
                    value={newActionGroup.lambdaFunctionArn}
                    onChange={(e) => setNewActionGroup({...newActionGroup, lambdaFunctionArn: e.target.value})}
                    placeholder="arn:aws:lambda:region:account:function:name"
                    className="h-9 text-sm border-2 border-blue-200 dark:border-blue-700 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="agDescription" className="text-xs font-semibold text-blue-700 dark:text-blue-300">Description</Label>
                <Textarea
                  id="agDescription"
                  value={newActionGroup.description}
                  onChange={(e) => setNewActionGroup({...newActionGroup, description: e.target.value})}
                  placeholder="Describe what this action group does..."
                  rows={2}
                  className="resize-none text-sm border-2 border-blue-200 dark:border-blue-700 focus:border-blue-500 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        )}

        {/* Add Button */}
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            variant="outline"
            className="w-full h-10 gap-2 text-sm font-semibold border-2 border-cyan-300 dark:border-cyan-700 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:border-cyan-500 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Add Action Group
          </Button>
        )}

        {actionGroups.length === 0 && !isAdding && (
          <div className="text-center py-8 text-muted-foreground">
            <Code className="w-12 h-12 mx-auto mb-3 opacity-50 animate-float" />
            <p className="text-sm font-medium">No action groups configured</p>
            <p className="text-xs">Add Lambda functions to extend your agent's capabilities</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ActionGroupBuilder