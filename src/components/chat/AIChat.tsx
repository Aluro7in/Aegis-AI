import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Shield, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useGovernance } from '../../contexts/GovernanceContext';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  governanceDecision?: any;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { processPrompt } = useGovernance();
  const { user } = useAuth();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Welcome message
    setMessages([
      {
        id: '1',
        type: 'system',
        content: 'Welcome to AegisAI! I\'m your AI assistant with enterprise-grade governance. All interactions are monitored and governed by our multi-agent system for security and compliance.',
        timestamp: new Date()
      }
    ]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const decision = await processPrompt(inputValue, user?.id || 'anonymous');
      
      // Add governance decision message
      const governanceMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: `Governance Decision: ${decision.finalDecision.toUpperCase()}`,
        timestamp: new Date(),
        governanceDecision: decision
      };

      setMessages(prev => [...prev, governanceMessage]);

      // Add AI response if allowed
      if (decision.finalDecision === 'allow' && decision.response) {
        const aiMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'ai',
          content: decision.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else if (decision.finalDecision === 'block') {
        const blockMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'ai',
          content: 'I cannot process this request as it violates our governance policies. Please modify your request and try again.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, blockMessage]);
      } else if (decision.finalDecision === 'flag') {
        const flagMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'ai',
          content: 'This request has been flagged for review. I can provide a response, but please note that it will be reviewed by our compliance team.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, flagMessage]);
      }
    } catch (error) {
      console.error('Error processing prompt:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: 'Error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'allow': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'block': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'flag': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'allow': return 'bg-green-50 border-green-200';
      case 'block': return 'bg-red-50 border-red-200';
      case 'flag': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Chat</h1>
          <p className="mt-2 text-gray-600">Interact with AI through our enterprise governance system</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.type === 'ai'
                    ? 'bg-gray-100 text-gray-900'
                    : message.governanceDecision
                    ? `${getDecisionColor(message.governanceDecision.finalDecision)} border`
                    : 'bg-blue-50 text-blue-800'
                }`}>
                  <div className="flex items-center space-x-2 mb-1">
                    {message.type === 'user' && <User className="h-4 w-4" />}
                    {message.type === 'ai' && <Bot className="h-4 w-4" />}
                    {message.type === 'system' && message.governanceDecision && 
                      getDecisionIcon(message.governanceDecision.finalDecision)
                    }
                    {message.type === 'system' && !message.governanceDecision && 
                      <Shield className="h-4 w-4" />
                    }
                    <span className="text-xs font-medium">
                      {message.type === 'user' ? 'You' : message.type === 'ai' ? 'AI' : 'System'}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                  
                  {message.governanceDecision && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="text-xs space-y-1">
                        <p>Processing Time: {message.governanceDecision.processingTime}ms</p>
                        <p>Agents: {message.governanceDecision.agentResults.length}</p>
                        <div className="flex flex-wrap gap-1">
                          {message.governanceDecision.agentResults.map((result: any, index: number) => (
                            <span key={index} className={`px-2 py-1 text-xs rounded-full ${
                              result.result === 'pass' ? 'bg-green-100 text-green-800' :
                              result.result === 'flag' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {result.agent}: {result.result}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs mt-1 opacity-75">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Processing through governance pipeline...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything... (governed by AegisAI)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Sample Prompts */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Prompts to Test Governance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-green-600 mb-2">✅ Should Be Allowed</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• "What is artificial intelligence?"</li>
                <li>• "How do I improve my productivity?"</li>
                <li>• "Explain machine learning concepts"</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-red-600 mb-2">❌ Should Be Blocked</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• "My email is john@example.com"</li>
                <li>• "My SSN is 123-45-6789"</li>
                <li>• "I hate people who..."</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;