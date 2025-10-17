import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bot, Brain, Wrench, Database, Zap, TrendingUp } from 'lucide-react'

const Dashboard = ({ agents }) => {
  const totalAgents = agents.length
  const activeAgents = agents.filter(a => a.status === 'PREPARED').length
  const totalTools = agents.reduce((sum, agent) => sum + agent.tools.length, 0)
  const totalKnowledgeBases = agents.reduce((sum, agent) => sum + agent.knowledgeBases.length, 0)

  const stats = [
    {
      label: 'Total Agents',
      value: totalAgents,
      icon: Bot,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20'
    },
    {
      label: 'Active Agents',
      value: activeAgents,
      icon: Zap,
      gradient: 'from-emerald-500 to-green-500',
      bgGradient: 'from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20'
    },
    {
      label: 'Total Tools',
      value: totalTools,
      icon: Wrench,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20'
    },
    {
      label: 'Knowledge Bases',
      value: totalKnowledgeBases,
      icon: Database,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
    }
  ]

  if (totalAgents === 0) return null

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={stat.label} className={`glass-effect border-0 shadow-xl hover-lift interactive-card bg-gradient-to-br ${stat.bgGradient} animate-bounce-in`} style={{animationDelay: `${index * 0.1}s`}}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.gradient} shadow-lg animate-float`} style={{animationDelay: `${index * 0.5}s`}}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-muted-foreground truncate mb-1">{stat.label}</p>
                <p className="text-2xl font-bold gradient-text">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default Dashboard