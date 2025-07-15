import React from 'react';
import { Shield, Users, Activity, AlertTriangle, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useGovernance } from '../../contexts/GovernanceContext';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { metrics, decisions, policies, compliance } = useGovernance();
  const { user } = useAuth();

  const recentDecisions = decisions.slice(0, 5);
  const activePolicies = policies.filter(p => p.enabled).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'allow': return 'text-green-600 bg-green-100';
      case 'block': return 'text-red-600 bg-red-100';
      case 'flag': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-100';
      case 'partial': return 'text-yellow-600 bg-yellow-100';
      case 'non-compliant': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {user?.name}. Here's your governance overview.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalRequests}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">↑ 12% from last week</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Blocked Requests</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.blockedRequests}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-red-600">↓ 8% from last week</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">↑ 5% from last week</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(metrics.averageProcessingTime)}ms</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">↓ 15% from last week</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* System Health */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600 font-medium">Healthy</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">API Availability</span>
                <span className="text-sm font-medium text-green-600">99.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Policies</span>
                <span className="text-sm font-medium text-blue-600">{activePolicies}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Processing Queue</span>
                <span className="text-sm font-medium text-green-600">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">User Satisfaction</span>
                <span className="text-sm font-medium text-green-600">{metrics.userSatisfaction}/5.0</span>
              </div>
            </div>
          </div>

          {/* Compliance Status */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Compliance Status</h3>
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-3">
              {compliance.map((framework) => (
                <div key={framework.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{framework.name}</p>
                    <p className="text-xs text-gray-500">{framework.description}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getComplianceColor(framework.status)}`}>
                    {framework.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Decisions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Governance Decisions</h3>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          
          {recentDecisions.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recent decisions to display</p>
              <p className="text-sm text-gray-400">Start interacting with the AI chat to see governance decisions here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentDecisions.map((decision) => (
                <div key={decision.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {decision.prompt.length > 60 ? `${decision.prompt.substring(0, 60)}...` : decision.prompt}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500">
                        {decision.timestamp.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {decision.processingTime}ms
                      </span>
                      <span className="text-xs text-gray-500">
                        {decision.agentResults.length} agents
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(decision.finalDecision)}`}>
                      {decision.finalDecision}
                    </span>
                    {decision.finalDecision === 'allow' && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                    {decision.finalDecision === 'block' && (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    {decision.finalDecision === 'flag' && (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              View All Policies
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Generate Report
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Test AI Chat
            </button>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              View Audit Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;