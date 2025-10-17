import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bot, Activity, Clock, Zap, TrendingUp, Users, Settings, BarChart3 } from 'lucide-react'

const Dashboard = ({ agents }) => {
  const totalAgents = agents.length
  const activeAgents = agents.filter(agent => agent.status === 'PREPARED').length
  const creatingAgents = agents.filter(agent => agent.status === 'CREATING').length
  const failedAgents = agents.filter(agent => agent.status === 'FAILED').length

  const recentAgents = agents
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)

  const getStatusColor = (status) => {
    switch(status) {
      case 'PREPARED': return 'bg-emerald-500'
      case 'CREATING': return 'bg-yellow-500'
      case 'FAILED': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-effect border-0 shadow-lg hover-lift gradient-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Agents</p>
                <p className="text-3xl font-bold gradient-text">{totalAgents}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-lg hover-lift gradient-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-3xl font-bold text-emerald-600">{activeAgents}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-lg hover-lift gradient-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Creating</p>
                <p className="text-3xl font-bold text-yellow-600">{creatingAgents}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-lg hover-lift gradient-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                <p className="text-3xl font-bold text-red-600">{failedAgents}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect border-0 shadow-lg hover-lift gradient-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-md">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="gradient-text">Recent Agents</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAgents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="w-12 h-12 mx-auto mb-3 opacity-50 animate-float" />
                <p className="text-sm font-medium">No agents created yet</p>
              </div>
            ) : (
              recentAgents.map((agent, index) => (
                <div key={agent.agentId} className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800 rounded-lg hover:shadow-md transition-all duration-300 animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-md">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-purple-800 dark:text-purple-200">{agent.agentName}</h4>
                      <p className="text-xs text-muted-foreground">{formatDate(agent.createdAt)}</p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(agent.status)} text-white border-0 text-xs px-2 py-1`}>
                    {agent.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-lg hover-lift gradient-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg shadow-md">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <span className="gradient-text">Quick Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Model Distribution</span>
                </div>
                <span className="text-sm font-bold text-blue-600">
                  {agents.filter(a => a.foundationModel?.includes('claude')).length} Claude
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Tools Used</span>
                </div>
                <span className="text-sm font-bold text-purple-600">
                  {agents.reduce((acc, agent) => acc + (agent.tools?.length || 0), 0)} total
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Success Rate</span>
                </div>
                <span className="text-sm font-bold text-emerald-600">
                  {totalAgents > 0 ? Math.round((activeAgents / totalAgents) * 100) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard