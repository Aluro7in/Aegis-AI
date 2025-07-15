import React, { useState } from 'react';
import { Phone, Image, TrendingUp, Database, Shield, ArrowRight, Star } from 'lucide-react';
import { UseCase } from '../../types';
import CallInsights from './CallInsights';
import ImageSynthesizer from './ImageSynthesizer';
import SupplyChain from './SupplyChain';
import DataGenerator from './DataGenerator';
import GovernanceFramework from './GovernanceFramework';

const UseCasesHub: React.FC = () => {
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null);

  const useCases: UseCase[] = [
    {
      id: 'call-insights',
      title: 'AI-Driven Live Call Insights',
      description: 'Real-time customer service enhancement with speech-to-text, sentiment analysis, and coaching suggestions',
      category: 'Customer Service',
      icon: 'Phone',
      status: 'active',
      features: [
        'Real-time speech-to-text conversion',
        'Live sentiment analysis',
        'Contextual coaching suggestions',
        'Customer satisfaction scoring',
        'Automated call summaries'
      ],
      path: '/call-insights'
    },
    {
      id: 'image-synthesizer',
      title: 'AI Image Synthesizer',
      description: 'Advanced image generation with AWS Bedrock integration, multiple styles, and high-resolution outputs',
      category: 'Creative AI',
      icon: 'Image',
      status: 'active',
      features: [
        'AWS Bedrock integration',
        'Multiple art styles',
        'High-resolution outputs',
        'Advanced generation controls',
        'Batch processing'
      ],
      path: '/image-synthesizer'
    },
    {
      id: 'supply-chain',
      title: 'Supply Chain Optimization',
      description: 'Intelligent inventory and demand management using TimeLLM for forecasting and optimization',
      category: 'Operations',
      icon: 'TrendingUp',
      status: 'active',
      features: [
        'TimeLLM-powered forecasting',
        'Inventory optimization',
        'Risk assessment',
        'Market trend analysis',
        'Performance tracking'
      ],
      path: '/supply-chain'
    },
    {
      id: 'data-generator',
      title: 'Smart Synthetic Data Generator',
      description: 'Privacy-preserving dataset creation with multi-domain support and custom schema configuration',
      category: 'Data Engineering',
      icon: 'Database',
      status: 'active',
      features: [
        'Multi-domain support',
        'Privacy preservation',
        'Custom schema support',
        'Quality validation',
        'Export capabilities'
      ],
      path: '/data-generator'
    },
    {
      id: 'governance-framework',
      title: 'Multi-Agent Governance Framework',
      description: 'Comprehensive AI governance with 7-agent pipeline, policy enforcement, and compliance monitoring',
      category: 'Governance',
      icon: 'Shield',
      status: 'active',
      features: [
        '7-agent processing pipeline',
        'Real-time policy enforcement',
        'Compliance monitoring',
        'Audit trail generation',
        'Advanced analytics'
      ],
      path: '/governance-framework'
    }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Phone': return <Phone className="h-8 w-8" />;
      case 'Image': return <Image className="h-8 w-8" />;
      case 'TrendingUp': return <TrendingUp className="h-8 w-8" />;
      case 'Database': return <Database className="h-8 w-8" />;
      case 'Shield': return <Shield className="h-8 w-8" />;
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

  const renderUseCase = () => {
    switch (selectedUseCase) {
      case 'call-insights': return <CallInsights onBack={() => setSelectedUseCase(null)} />;
      case 'image-synthesizer': return <ImageSynthesizer onBack={() => setSelectedUseCase(null)} />;
      case 'supply-chain': return <SupplyChain onBack={() => setSelectedUseCase(null)} />;
      case 'data-generator': return <DataGenerator onBack={() => setSelectedUseCase(null)} />;
      case 'governance-framework': return <GovernanceFramework onBack={() => setSelectedUseCase(null)} />;
      default: return null;
    }
  };

  if (selectedUseCase) {
    return renderUseCase();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">GenAI Use Cases Hub</h1>
          <p className="mt-2 text-gray-600">Explore real-world AI solutions with enterprise-grade governance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase) => (
            <div
              key={useCase.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedUseCase(useCase.id)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-blue-600">
                      {getIcon(useCase.icon)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{useCase.title}</h3>
                      <p className="text-sm text-gray-500">{useCase.category}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(useCase.status)}`}>
                    {useCase.status}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{useCase.description}</p>

                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-medium text-gray-900">Key Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {useCase.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                    {useCase.features.length > 3 && (
                      <li className="text-xs text-gray-500">+{useCase.features.length - 3} more features</li>
                    )}
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">4.8/5.0</span>
                  </div>
                  <div className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
                    <span className="text-sm font-medium">Launch</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Enterprise AI Solutions</h2>
            <p className="text-gray-600 mb-6">
              Each use case demonstrates real-world AI applications with comprehensive governance, 
              security, and compliance built-in from the ground up.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
                <p className="text-sm text-gray-600">Production-Ready Solutions</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
                <p className="text-sm text-gray-600">Governance Accuracy</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">7</div>
                <p className="text-sm text-gray-600">AI Agents per Request</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseCasesHub;