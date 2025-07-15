import React, { useState } from 'react';
import { Bot, MessageCircle, Eye, TrendingUp, Brain, ArrowRight, Zap, Star } from 'lucide-react';
import ProactiveChatbot from './ProactiveChatbot';
import PredictiveAnalytics from './PredictiveAnalytics';
import ImageRecognition from './ImageRecognition';
import SentimentAnalysis from './SentimentAnalysis';
import AutomatedDecisionMaking from './AutomatedDecisionMaking';

interface AIAgent {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  status: 'active' | 'beta' | 'coming-soon';
  features: string[];
  capabilities: string[];
  metrics: {
    accuracy: number;
    responseTime: string;
    usage: number;
  };
}

const AIAgentsHub: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const aiAgents: AIAgent[] = [
    {
      id: 'proactive-chatbot',
      title: 'Proactive AI Chatbot',
      description: 'Intelligent chatbot with proactive engagement based on user behavior patterns and idle detection',
      category: 'Conversational AI',
      icon: 'Bot',
      status: 'active',
      features: [
        'Real-time behavior tracking',
        'Proactive engagement patterns',
        'Context-aware responses',
        'Sentiment analysis integration',
        'Multi-trigger automation'
      ],
      capabilities: [
        'Idle time detection (5+ minutes)',
        'Session behavior analysis',
        'Contextual recommendations',
        'Natural language processing',
        'User preference learning'
      ],
      metrics: {
        accuracy: 94.2,
        responseTime: '< 500ms',
        usage: 1247
      }
    },
    {
      id: 'predictive-analytics',
      title: 'Predictive Analytics Engine',
      description: 'Advanced ML-powered analytics with automated recommendations and behavioral predictions',
      category: 'Machine Learning',
      icon: 'TrendingUp',
      status: 'active',
      features: [
        'User behavior prediction',
        'Churn risk assessment',
        'Feature adoption forecasting',
        'Performance optimization',
        'Automated recommendations'
      ],
      capabilities: [
        'Real-time data collection',
        'ML model inference',
        'Trend visualization',
        'Risk scoring algorithms',
        'Predictive notifications'
      ],
      metrics: {
        accuracy: 89.7,
        responseTime: '< 2s',
        usage: 892
      }
    },
    {
      id: 'image-recognition',
      title: 'AI Image Recognition',
      description: 'Computer vision system for comprehensive image analysis including object detection and text recognition',
      category: 'Computer Vision',
      icon: 'Eye',
      status: 'active',
      features: [
        'Object detection & classification',
        'Text recognition (OCR)',
        'Face analysis & emotions',
        'Color palette extraction',
        'Content moderation'
      ],
      capabilities: [
        'Multi-format image support',
        'Real-time processing',
        'Batch analysis',
        'Confidence scoring',
        'Metadata extraction'
      ],
      metrics: {
        accuracy: 96.3,
        responseTime: '< 3s',
        usage: 634
      }
    },
    {
      id: 'sentiment-analysis',
      title: 'Sentiment Analysis System',
      description: 'Advanced NLP system for real-time sentiment analysis with automated content moderation',
      category: 'Natural Language Processing',
      icon: 'MessageCircle',
      status: 'active',
      features: [
        'Real-time sentiment scoring',
        'Emotion detection',
        'Automated moderation',
        'Keyword extraction',
        'Trend analysis'
      ],
      capabilities: [
        'Multi-language support',
        'Confidence scoring',
        'Batch processing',
        'Custom thresholds',
        'Integration APIs'
      ],
      metrics: {
        accuracy: 91.8,
        responseTime: '< 800ms',
        usage: 2156
      }
    },
    {
      id: 'automated-decisions',
      title: 'Automated Decision Making',
      description: 'Intelligent decision engine with rule-based automation and contextual recommendations',
      category: 'Decision Intelligence',
      icon: 'Brain',
      status: 'active',
      features: [
        'Rule-based decision trees',
        'Context-aware automation',
        'Multi-condition evaluation',
        'Action orchestration',
        'Performance monitoring'
      ],
      capabilities: [
        'Dynamic rule evaluation',
        'Real-time context analysis',
        'Automated workflows',
        'Decision confidence scoring',
        'Audit trail generation'
      ],
      metrics: {
        accuracy: 87.4,
        responseTime: '< 100ms',
        usage: 1789
      }
    }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bot': return <Bot className="h-8 w-8" />;
      case 'TrendingUp': return <TrendingUp className="h-8 w-8" />;
      case 'Eye': return <Eye className="h-8 w-8" />;
      case 'MessageCircle': return <MessageCircle className="h-8 w-8" />;
      case 'Brain': return <Brain className="h-8 w-8" />;
      default: return <Star className="h-8 w-8" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'beta': return 'bg-yellow-100 text-yellow-800';
      case 'coming-soon': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return 'text-green-600';
    if (accuracy >= 90) return 'text-blue-600';
    if (accuracy >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderAgent = () => {
    switch (selectedAgent) {
      case 'proactive-chatbot': return <ProactiveChatbot />;
      case 'predictive-analytics': return <PredictiveAnalytics />;
      case 'image-recognition': return <ImageRecognition />;
      case 'sentiment-analysis': return <SentimentAnalysis />;
      case 'automated-decisions': return <AutomatedDecisionMaking />;
      default: return null;
    }
  };

  if (selectedAgent) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => setSelectedAgent(null)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowRight className="h-5 w-5 rotate-180" />
            <span>Back to AI Agents Hub</span>
          </button>
          {renderAgent()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">AI Agents Hub</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Advanced AI-powered agents with proactive capabilities and intelligent automation
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Agents</p>
                <p className="text-2xl font-bold text-green-600">{aiAgents.filter(a => a.status === 'active').length}</p>
              </div>
              <Bot className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Usage</p>
                <p className="text-2xl font-bold text-blue-600">
                  {aiAgents.reduce((sum, agent) => sum + agent.metrics.usage, 0).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Accuracy</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(aiAgents.reduce((sum, agent) => sum + agent.metrics.accuracy, 0) / aiAgents.length)}%
                </p>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-orange-600">
                  {new Set(aiAgents.map(a => a.category)).size}
                </p>
              </div>
              <Star className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* AI Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiAgents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
              onClick={() => setSelectedAgent(agent.id)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
                      {getIcon(agent.icon)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                        {agent.title}
                      </h3>
                      <p className="text-sm text-gray-500">{agent.category}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(agent.status)}`}>
                    {agent.status}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{agent.description}</p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getAccuracyColor(agent.metrics.accuracy)}`}>
                      {agent.metrics.accuracy}%
                    </div>
                    <div className="text-xs text-gray-500">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{agent.metrics.responseTime}</div>
                    <div className="text-xs text-gray-500">Response</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{agent.metrics.usage.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Usage</div>
                  </div>
                </div>

                {/* Key Features */}
                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-medium text-gray-900">Key Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {agent.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                    {agent.features.length > 3 && (
                      <li className="text-xs text-gray-500">+{agent.features.length - 3} more features</li>
                    )}
                  </ul>
                </div>

                {/* Capabilities */}
                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-medium text-gray-900">Capabilities:</h4>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.slice(0, 3).map((capability, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {capability}
                      </span>
                    ))}
                    {agent.capabilities.length > 3 && (
                      <span className="text-xs text-gray-500">+{agent.capabilities.length - 3} more</span>
                    )}
                  </div>
                </div>

                {/* Launch Button */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">4.8/5.0</span>
                  </div>
                  <div className="flex items-center space-x-1 text-blue-600 group-hover:text-blue-700 transition-colors">
                    <span className="text-sm font-medium">Launch Agent</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* System Information */}
        <div className="mt-12 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Advanced AI Agent Capabilities</h2>
            <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
              Our AI agents leverage cutting-edge machine learning, natural language processing, and computer vision 
              technologies to provide intelligent, proactive assistance across all aspects of the AegisAI platform.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
                <p className="text-sm text-gray-600">Specialized AI Agents</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">99.2%</div>
                <p className="text-sm text-gray-600">System Uptime</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">&lt; 1s</div>
                <p className="text-sm text-gray-600">Average Response Time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAgentsHub;