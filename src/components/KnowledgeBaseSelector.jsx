import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { BookOpen, Database, Check } from 'lucide-react'

const KnowledgeBaseSelector = ({ selectedKnowledgeBases, onKnowledgeBasesChange }) => {
  const [availableKnowledgeBases, setAvailableKnowledgeBases] = useState([])

  useEffect(() => {
    // Simulated knowledge bases
    const kbs = [
      {
        id: 'kb-1',
        name: 'Product Documentation',
        description: 'Complete product manuals and technical documentation',
        vectorStore: 'Amazon OpenSearch Serverless',
        documents: 1247,
        lastUpdated: '2024-10-15'
      },
      {
        id: 'kb-2',
        name: 'Customer Support FAQs',
        description: 'Frequently asked questions and support articles',
        vectorStore: 'Pinecone',
        documents: 856,
        lastUpdated: '2024-10-14'
      },
      {
        id: 'kb-3',
        name: 'Company Policies',
        description: 'Internal policies, procedures, and guidelines',
        vectorStore: 'Amazon OpenSearch Serverless',
        documents: 342,
        lastUpdated: '2024-10-10'
      },
      {
        id: 'kb-4',
        name: 'Technical Specifications',
        description: 'API documentation and technical specifications',
        vectorStore: 'Amazon Aurora',
        documents: 623,
        lastUpdated: '2024-10-12'
      }
    ]
    setAvailableKnowledgeBases(kbs)
  }, [])

  const toggleKnowledgeBase = (kbId) => {
    if (selectedKnowledgeBases.includes(kbId)) {
      onKnowledgeBasesChange(selectedKnowledgeBases.filter(id => id !== kbId))
    } else {
      onKnowledgeBasesChange([...selectedKnowledgeBases, kbId])
    }
  }

  return (
    <Card className="glass-effect border-0 shadow-lg hover-lift gradient-border animate-slide-up">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="p-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg shadow-md">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="gradient-text">Knowledge ({selectedKnowledgeBases.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {availableKnowledgeBases.slice(0, 3).map(kb => {
          const isSelected = selectedKnowledgeBases.includes(kb.id)
          return (
            <div
              key={kb.id}
              onClick={() => toggleKnowledgeBase(kb.id)}
              className={`
                interactive-card p-2 rounded-lg border-2 transition-all duration-300
                ${isSelected 
                  ? 'border-cyan-500 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30 shadow-md neon-glow' 
                  : 'border-cyan-200 dark:border-cyan-700 hover:border-cyan-400 hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-blue-50/50 dark:hover:from-cyan-900/10 dark:hover:to-blue-900/10'
                }
              `}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Database className="w-3 h-3 text-cyan-600 dark:text-cyan-400 flex-shrink-0 animate-float" />
                    <h4 className="font-bold text-xs truncate text-cyan-800 dark:text-cyan-200">{kb.name}</h4>
                  </div>
                  <div className="flex gap-1">
                    <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs px-1.5 py-0.5">
                      {kb.documents.toLocaleString()} docs
                    </Badge>
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-cyan-300 text-cyan-700 dark:text-cyan-300">
                      {kb.vectorStore.split(' ')[0]}
                    </Badge>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md animate-bounce-in">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </div>
          )
        })}
        
        {availableKnowledgeBases.length > 3 && (
          <div className="text-center">
            <button className="text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-200 transition-colors font-medium hover:scale-105 transform duration-200">
              +{availableKnowledgeBases.length - 3} more knowledge bases
            </button>
          </div>
        )}

        {selectedKnowledgeBases.length === 0 && (
          <div className="text-center py-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl border border-cyan-200 dark:border-cyan-700">
            <p className="text-sm text-cyan-700 dark:text-cyan-300 font-medium">
              No knowledge bases connected
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default KnowledgeBaseSelector

