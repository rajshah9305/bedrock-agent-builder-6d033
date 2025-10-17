import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, Edit3, Save, X, Database, FileText, Search, Globe } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const KnowledgeBaseSelector = ({ selectedKnowledgeBases, onKnowledgeBasesChange }) => {
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [newKnowledgeBase, setNewKnowledgeBase] = useState({
    name: '',
    description: '',
    dataSourceId: '',
    vectorStoreId: '',
    knowledgeBaseId: ''
  })

  // Mock knowledge bases - in real implementation, these would come from API
  const [availableKnowledgeBases] = useState([
    {
      id: 'kb-1',
      name: 'Company Documentation',
      description: 'Internal company policies and procedures',
      dataSourceId: 'ds-company-docs',
      vectorStoreId: 'vs-company-docs',
      knowledgeBaseId: 'kb-company-docs',
      status: 'ACTIVE',
      documentCount: 150,
      lastUpdated: '2024-01-15'
    },
    {
      id: 'kb-2',
      name: 'Product Knowledge',
      description: 'Product specifications and user guides',
      dataSourceId: 'ds-product-kb',
      vectorStoreId: 'vs-product-kb',
      knowledgeBaseId: 'kb-product-kb',
      status: 'ACTIVE',
      documentCount: 89,
      lastUpdated: '2024-01-10'
    },
    {
      id: 'kb-3',
      name: 'Technical Support',
      description: 'Technical documentation and troubleshooting guides',
      dataSourceId: 'ds-tech-support',
      vectorStoreId: 'vs-tech-support',
      knowledgeBaseId: 'kb-tech-support',
      status: 'ACTIVE',
      documentCount: 234,
      lastUpdated: '2024-01-12'
    },
    {
      id: 'kb-4',
      name: 'Customer FAQs',
      description: 'Frequently asked questions and answers',
      dataSourceId: 'ds-customer-faqs',
      vectorStoreId: 'vs-customer-faqs',
      knowledgeBaseId: 'kb-customer-faqs',
      status: 'ACTIVE',
      documentCount: 67,
      lastUpdated: '2024-01-08'
    }
  ])

  const handleToggleKnowledgeBase = (kbId) => {
    if (selectedKnowledgeBases.includes(kbId)) {
      onKnowledgeBasesChange(selectedKnowledgeBases.filter(id => id !== kbId))
    } else {
      onKnowledgeBasesChange([...selectedKnowledgeBases, kbId])
    }
  }

  const handleAddCustomKnowledgeBase = () => {
    if (!newKnowledgeBase.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Knowledge base name is required",
        variant: "destructive"
      })
      return
    }

    const customKB = {
      id: `kb-custom-${Date.now()}`,
      ...newKnowledgeBase,
      status: 'PENDING',
      documentCount: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      isCustom: true
    }

    // In real implementation, this would call an API to create the knowledge base
    toast({
      title: "Custom Knowledge Base Added! 🎉",
      description: `Knowledge base "${customKB.name}" has been created`,
    })

    setNewKnowledgeBase({
      name: '',
      description: '',
      dataSourceId: '',
      vectorStoreId: '',
      knowledgeBaseId: ''
    })
    setIsAdding(false)
  }

  const handleEditCustomKnowledgeBase = (kbId) => {
    const kb = availableKnowledgeBases.find(k => k.id === kbId && k.isCustom)
    if (kb) {
      setNewKnowledgeBase(kb)
      setEditingId(kbId)
      setIsAdding(true)
    }
  }

  const handleUpdateCustomKnowledgeBase = () => {
    if (!newKnowledgeBase.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Knowledge base name is required",
        variant: "destructive"
      })
      return
    }

    // In real implementation, this would call an API to update the knowledge base
    toast({
      title: "Knowledge Base Updated! ✏️",
      description: `Knowledge base "${newKnowledgeBase.name}" has been updated`,
    })

    setNewKnowledgeBase({
      name: '',
      description: '',
      dataSourceId: '',
      vectorStoreId: '',
      knowledgeBaseId: ''
    })
    setIsAdding(false)
    setEditingId(null)
  }

  const cancelEdit = () => {
    setNewKnowledgeBase({
      name: '',
      description: '',
      dataSourceId: '',
      vectorStoreId: '',
      knowledgeBaseId: ''
    })
    setIsAdding(false)
    setEditingId(null)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'ACTIVE': return 'bg-emerald-500'
      case 'PENDING': return 'bg-yellow-500'
      case 'FAILED': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <Card className="glass-effect border-0 shadow-lg hover-lift gradient-border animate-slide-up">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-md">
            <Database className="w-4 h-4 text-white" />
          </div>
          <span className="gradient-text">Knowledge Bases ({selectedKnowledgeBases.length})</span>
        </CardTitle>
        <CardDescription>
          Connect your agent to knowledge sources for enhanced responses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Available Knowledge Bases */}
        <div className="space-y-2">
          {availableKnowledgeBases.map((kb, index) => {
            const isSelected = selectedKnowledgeBases.includes(kb.id)
            return (
              <div
                key={kb.id}
                className={`
                  p-3 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-md animate-slide-up
                  ${isSelected 
                    ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 shadow-lg neon-glow' 
                    : 'border-purple-200 dark:border-purple-700 hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 dark:hover:from-purple-900/10 dark:hover:to-pink-900/10'
                  }
                `}
                style={{animationDelay: `${index * 0.1}s`}}
                onClick={() => handleToggleKnowledgeBase(kb.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-md">
                      <Database className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-sm text-purple-800 dark:text-purple-200 truncate">{kb.name}</h4>
                        <Badge className={`${getStatusColor(kb.status)} text-white text-xs px-1.5 py-0.5`}>
                          {kb.status}
                        </Badge>
                        {kb.isCustom && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-purple-300 text-purple-700 dark:text-purple-300">
                            Custom
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{kb.description}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span>{kb.documentCount} docs</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Search className="w-3 h-3" />
                          <span>Updated {kb.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-md animate-bounce-in">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    {kb.isCustom && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditCustomKnowledgeBase(kb.id)
                          }}
                          className="h-6 w-6 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Add Custom Knowledge Base Form */}
        {isAdding && (
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700 animate-bounce-in">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-purple-800 dark:text-purple-200">
                  {editingId ? 'Edit Custom Knowledge Base' : 'Add Custom Knowledge Base'}
                </h4>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={editingId ? handleUpdateCustomKnowledgeBase : handleAddCustomKnowledgeBase}
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
                  <Label htmlFor="kbName" className="text-xs font-semibold text-purple-700 dark:text-purple-300">Name *</Label>
                  <Input
                    id="kbName"
                    value={newKnowledgeBase.name}
                    onChange={(e) => setNewKnowledgeBase({...newKnowledgeBase, name: e.target.value})}
                    placeholder="My Knowledge Base"
                    className="h-9 text-sm border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 transition-all duration-300"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="kbId" className="text-xs font-semibold text-purple-700 dark:text-purple-300">Knowledge Base ID</Label>
                  <Input
                    id="kbId"
                    value={newKnowledgeBase.knowledgeBaseId}
                    onChange={(e) => setNewKnowledgeBase({...newKnowledgeBase, knowledgeBaseId: e.target.value})}
                    placeholder="kb-custom-001"
                    className="h-9 text-sm border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="kbDescription" className="text-xs font-semibold text-purple-700 dark:text-purple-300">Description</Label>
                <Input
                  id="kbDescription"
                  value={newKnowledgeBase.description}
                  onChange={(e) => setNewKnowledgeBase({...newKnowledgeBase, description: e.target.value})}
                  placeholder="Describe the content of this knowledge base..."
                  className="h-9 text-sm border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 transition-all duration-300"
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
            className="w-full h-10 gap-2 text-sm font-semibold border-2 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-500 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Add Custom Knowledge Base
          </Button>
        )}

        {selectedKnowledgeBases.length === 0 && (
          <div className="text-center py-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
            <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
              No knowledge bases selected
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default KnowledgeBaseSelector