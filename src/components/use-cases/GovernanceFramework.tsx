import React, { useState } from 'react';
import { ArrowLeft, Shield, Users, FileText, BarChart3, Settings, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { useGovernance } from '../../contexts/GovernanceContext';

interface GovernanceFrameworkProps {
  onBack: () => void;
}

const GovernanceFramework: React.FC<GovernanceFrameworkProps> = ({ onBack }) => {
  const { policies, decisions, metrics, compliance } = useGovernance();
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const agents = [
    {
      id: 'prompt-guard',
      name: 'Prompt Guard',
      description: 'Intercepts and analyzes user prompts for PII, harmful content, and regulatory risks',
      status: 'active',
      processedRequests: 1245,
      averageTime: 45,
      accuracy: 98.5
    },
    {
      id: 'policy-enforcer',
      name: 'Policy Enforcer',
      description: 'Applies dynamic rules based on user role, domain, and organizational policies',
      status: 'active',
      processedRequests: 1245,
      averageTime: 32,
      accuracy: 97.8
    },
    {
      id: 'llm-processor',
      name: 'LLM Processor',
      description: 'Securely processes approved prompts through OpenAI API or simulation',
      status: 'active',
      processedRequests: 892,
      averageTime: 1850,
      accuracy: 94.2
    },
    {
      id: 'output-auditor',
      name: 'Output Auditor',
      description: 'Post-processes responses for toxicity, bias, and hallucination detection',
      status: 'active',
      processedRequests: 892,
      averageTime: 78,
      accuracy: 96.7
    },
    {
      id: 'audit-logger',
      name: 'Audit Logger',
      description: 'Comprehensive logging to local storage and audit trails',
      status: 'active',
      processedRequests: 1245,
      averageTime: 15,
      accuracy: 100
    },
    {
      id: 'advisory-agent',
      name: 'Advisory Agent',
      description: 'Provides natural language explanations for governance decisions',
      status: 'active',
      processedRequests: 345,
      averageTime: 125,
      accuracy: 89.3
    },
    {
      id: 'feedback-agent',
      name: 'Feedback Agent',
      description: 'Collects and analyzes user feedback for continuous improvement',
      status: 'active',
      processedRequests: 178,
      averageTime: 95,
      accuracy: 91.8
    }
  ];

  const regulatoryFrameworks = [
    {
      id: 'fisma',
      name: 'FISMA Security Controls',
      description: 'Federal Information Security Management Act compliance',
      coverage: 95,
      lastAssessed: '2024-01-15',
      requirements: ['Access Control', 'Audit Logging', 'Risk Assessment', 'Incident Response']
    },
    {
      id: 'gdpr',
      name: 'GDPR Data Sensitivity',
      description: 'General Data Protection Regulation compliance',
      coverage: 98,
      lastAssessed: '2024-01-10',
      requirements: ['Data Minimization', 'Right to Erasure', 'Privacy by Design', 'Consent Management']
    },
    {
      id: 'eu-ai-act',
      name: 'EU AI Act Risk Categories',
      description: 'European Union Artificial Intelligence Act compliance',
      coverage: 87,
      lastAssessed: '2024-01-20',
      requirements: ['Risk Assessment', 'Transparency', 'Human Oversight', 'Bias Testing']
    },
    {
      id: 'dsa',
      name: 'Digital Services Act',
      description: 'EU Digital Services Act compliance',
      coverage: 92,
      lastAssessed: '2024-01-18',
      requirements: ['Content Moderation', 'Transparency Reports', 'Risk Mitigation', 'User Rights']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 95) return 'text-green-600 bg-green-100';
    if (coverage >= 85) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const recentDecisions = decisions.slice(0, 5);
  const activePolicies = policies.filter(p => p.enabled);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Use Cases</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Multi-Agent Governance Framework</h1>
          <p className="mt-2 text-gray-600">Comprehensive AI governance with 7-agent pipeline and real-time monitoring</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalRequests}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">↑ 12% from last week</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Policies</p>
                <p className="text-2xl font-bold text-gray-900">{activePolicies.length}</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-blue-600">All policies active</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                <p className="text-2xl font-bold text-gray-900">96%</p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">Excellent compliance</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(metrics.averageProcessingTime)}ms</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">↓ 15% improvement</span>
            </div>
          </div>
        </div>

        {/* Agent Pipeline */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">7-Agent Processing Pipeline</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedAgent === agent.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{agent.name}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(agent.status)}`}>
                    {agent.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{agent.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Processed</span>
                    <span className="font-medium">{agent.processedRequests.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Avg Time</span>
                    <span className="font-medium">{agent.averageTime}ms</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Accuracy</span>
                    <span className="font-medium text-green-600">{agent.accuracy}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Regulatory Compliance */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Regulatory Compliance</h3>
            
            <div className="space-y-4">
              {regulatoryFrameworks.map((framework) => (
                <div key={framework.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{framework.name}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCoverageColor(framework.coverage)}`}>
                      {framework.coverage}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{framework.description}</p>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Coverage</span>
                      <span>Last Assessed: {framework.lastAssessed}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          framework.coverage >= 95 ? 'bg-green-500' :
                          framework.coverage >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${framework.coverage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-2">Key Requirements:</p>
                    <div className="flex flex-wrap gap-1">
                      {framework.requirements.map((req, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Governance Decisions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Governance Decisions</h3>
            
            <div className="space-y-4">
              {recentDecisions.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recent decisions to display</p>
                  <p className="text-sm text-gray-400">Use the AI chat to see governance decisions</p>
                </div>
              ) : (
                recentDecisions.map((decision) => (
                  <div key={decision.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {decision.prompt.length > 50 ? `${decision.prompt.substring(0, 50)}...` : decision.prompt}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {decision.timestamp.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          decision.finalDecision === 'allow' ? 'text-green-600 bg-green-100' :
                          decision.finalDecision === 'block' ? 'text-red-600 bg-red-100' :
                          'text-yellow-600 bg-yellow-100'
                        }`}>
                          {decision.finalDecision}
                        </span>
                        {decision.finalDecision === 'allow' && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {decision.finalDecision === 'flag' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {decision.agentResults.map((result, index) => (
                        <span key={index} className={`px-2 py-1 text-xs rounded-full ${
                          result.result === 'pass' ? 'bg-green-100 text-green-800' :
                          result.result === 'flag' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {result.agent}
                        </span>
                      ))}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Processing Time: {decision.processingTime}ms
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Policy Overview */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Active Policies</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activePolicies.map((policy) => (
              <div key={policy.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{policy.name}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    policy.severity === 'high' ? 'text-red-600 bg-red-100' :
                    policy.severity === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                    'text-green-600 bg-green-100'
                  }`}>
                    {policy.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{policy.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {policy.roles.map((role, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {role}
                      </span>
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${
                    policy.action === 'block' ? 'text-red-600' :
                    policy.action === 'flag' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {policy.action}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernanceFramework;