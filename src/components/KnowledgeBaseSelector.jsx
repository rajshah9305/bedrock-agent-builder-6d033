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
    <Card className="border-2 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          Knowledge Bases
        </CardTitle>
        <CardDescription>
          Connect knowledge bases to provide your agent with domain-specific information
          {selectedKnowledgeBases.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {selectedKnowledgeBases.length} connected
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-3">
        {availableKnowledgeBases.map(kb => {
          const isSelected = selectedKnowledgeBases.includes(kb.id)
          return (
            <div
              key={kb.id}
              onClick={() => toggleKnowledgeBase(kb.id)}
              className={`
                p-4 border-2 rounded-lg cursor-pointer transition-all
                ${isSelected 
                  ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30 shadow-md' 
                  : 'border-border hover:border-cyan-300 hover:bg-accent/50'
                }
              `}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <h4 className="font-semibold">{kb.name}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{kb.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="outline" className="gap-1">
                      <Database className="w-3 h-3" />
                      {kb.vectorStore}
                    </Badge>
                    <Badge variant="outline">
                      {kb.documents.toLocaleString()} documents
                    </Badge>
                    <Badge variant="outline">
                      Updated {kb.lastUpdated}
                    </Badge>
                  </div>
                </div>
                {isSelected && (
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {selectedKnowledgeBases.length === 0 && (
          <div className="text-center py-4 text-sm text-muted-foreground bg-muted/30 rounded-lg mt-4">
            No knowledge bases connected. Your agent will rely on its foundation model's training data.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default KnowledgeBaseSelector

