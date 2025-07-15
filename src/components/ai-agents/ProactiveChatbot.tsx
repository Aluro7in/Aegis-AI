import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Zap, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'proactive';
  content: string;
  timestamp: Date;
  sentiment?: 'positive' | 'neutral' | 'negative';
  confidence?: number;
}

interface UserBehavior {
  lastActivity: Date;
  idleTime: number;
  sessionDuration: number;
  interactionCount: number;
  currentPage: string;
}

const ProactiveChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userBehavior, setUserBehavior] = useState<UserBehavior>({
    lastActivity: new Date(),
    idleTime: 0,
    sessionDuration: 0,
    interactionCount: 0,
    currentPage: 'dashboard'
  });
  const [isProactiveMode, setIsProactiveMode] = useState(true);
  const { user } = useAuth();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<NodeJS.Timeout>();
  const sessionStartRef = useRef<Date>(new Date());

  // Proactive engagement patterns
  const proactivePatterns = [
    {
      trigger: 'idle_5min',
      condition: (behavior: UserBehavior) => behavior.idleTime >= 300000, // 5 minutes
      message: "I noticed you've been inactive for a while. Is there anything I can help you with?",
      priority: 'medium'
    },
    {
      trigger: 'low_interaction',
      condition: (behavior: UserBehavior) => behavior.sessionDuration > 600000 && behavior.interactionCount < 3,
      message: "You've been browsing for a while but haven't interacted much. Would you like a quick tour of the features?",
      priority: 'low'
    },
    {
      trigger: 'policy_page_visit',
      condition: (behavior: UserBehavior) => behavior.currentPage === 'policies',
      message: "I see you're looking at policies. I can help explain any governance rules or help you create new ones!",
      priority: 'high'
    },
    {
      trigger: 'audit_page_extended',
      condition: (behavior: UserBehavior) => behavior.currentPage === 'audit' && behavior.idleTime > 120000,
      message: "Need help analyzing the audit logs? I can help you identify patterns or explain specific entries.",
      priority: 'high'
    }
  ];

  // Initialize welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      type: 'bot',
      content: `Hello ${user?.name}! I'm your AI assistant. I'm here to help you navigate AegisAI and can proactively assist based on your activity. How can I help you today?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [user]);

  // Track user behavior
  useEffect(() => {
    const updateActivity = () => {
      setUserBehavior(prev => ({
        ...prev,
        lastActivity: new Date(),
        idleTime: 0,
        interactionCount: prev.interactionCount + 1
      }));
    };

    const updateSessionDuration = () => {
      setUserBehavior(prev => ({
        ...prev,
        sessionDuration: Date.now() - sessionStartRef.current.getTime()
      }));
    };

    // Track mouse movement, clicks, and keyboard activity
    document.addEventListener('mousemove', updateActivity);
    document.addEventListener('click', updateActivity);
    document.addEventListener('keypress', updateActivity);

    // Update session duration every 30 seconds
    const sessionTimer = setInterval(updateSessionDuration, 30000);

    return () => {
      document.removeEventListener('mousemove', updateActivity);
      document.removeEventListener('click', updateActivity);
      document.removeEventListener('keypress', updateActivity);
      clearInterval(sessionTimer);
    };
  }, []);

  // Idle time tracking
  useEffect(() => {
    if (idleTimerRef.current) {
      clearInterval(idleTimerRef.current);
    }

    idleTimerRef.current = setInterval(() => {
      setUserBehavior(prev => {
        const newIdleTime = Date.now() - prev.lastActivity.getTime();
        return { ...prev, idleTime: newIdleTime };
      });
    }, 1000);

    return () => {
      if (idleTimerRef.current) {
        clearInterval(idleTimerRef.current);
      }
    };
  }, [userBehavior.lastActivity]);

  // Proactive engagement logic
  useEffect(() => {
    if (!isProactiveMode) return;

    const checkProactivePatterns = () => {
      const triggeredPatterns = proactivePatterns.filter(pattern => 
        pattern.condition(userBehavior)
      );

      // Sort by priority and take the highest priority pattern
      const sortedPatterns = triggeredPatterns.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority as keyof typeof priorityOrder] - 
               priorityOrder[a.priority as keyof typeof priorityOrder];
      });

      if (sortedPatterns.length > 0) {
        const pattern = sortedPatterns[0];
        
        // Check if we haven't already sent this type of message recently
        const recentMessages = messages.slice(-5);
        const hasRecentProactive = recentMessages.some(msg => 
          msg.type === 'proactive' && msg.content.includes(pattern.message.split(' ')[0])
        );

        if (!hasRecentProactive) {
          sendProactiveMessage(pattern.message, pattern.trigger);
        }
      }
    };

    const proactiveTimer = setInterval(checkProactivePatterns, 10000); // Check every 10 seconds

    return () => clearInterval(proactiveTimer);
  }, [userBehavior, messages, isProactiveMode]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendProactiveMessage = (content: string, trigger: string) => {
    const proactiveMessage: Message = {
      id: Date.now().toString(),
      type: 'proactive',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, proactiveMessage]);
  };

  const sendMessage = async (content: string, isProactive = false) => {
    if (!content.trim() && !isProactive) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    if (!isProactive) {
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
    }

    setIsTyping(true);

    try {
      // Simulate API call to NLP service
      const response = await simulateNLPAPI(content, userBehavior);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.message,
        timestamp: new Date(),
        sentiment: response.sentiment,
        confidence: response.confidence
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const simulateNLPAPI = async (message: string, behavior: UserBehavior) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Context-aware responses based on user behavior and current state
    const contextualResponses = {
      greeting: [
        "Hello! I'm here to help you with AegisAI. What would you like to know?",
        "Hi there! I can assist you with governance policies, audit logs, or any other features.",
        "Welcome! I'm your AI assistant for AegisAI. How can I make your experience better?"
      ],
      help: [
        "I can help you with various aspects of AegisAI including policy management, audit analysis, and system navigation.",
        "Here are some things I can assist with: explaining governance decisions, helping with policy creation, analyzing audit logs, and providing system insights.",
        "I'm designed to help you navigate AegisAI efficiently. Would you like help with a specific feature?"
      ],
      policies: [
        "I can help you understand our governance policies. They're designed to ensure AI safety and compliance with regulations like GDPR and FISMA.",
        "Our policy system uses a multi-agent approach to evaluate requests. Would you like me to explain how a specific policy works?",
        "Policy management is crucial for AI governance. I can help you create, modify, or understand existing policies."
      ],
      audit: [
        "Audit logs provide complete traceability of all AI interactions. I can help you analyze patterns or explain specific entries.",
        "The audit system tracks every request through our governance pipeline. What specific aspect would you like to explore?",
        "Audit analysis can reveal important insights about system usage and policy effectiveness. Need help with a specific query?"
      ]
    };

    // Simple intent detection
    const lowerMessage = message.toLowerCase();
    let intent = 'general';
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    let confidence = 0.8;

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      intent = 'greeting';
      sentiment = 'positive';
    } else if (lowerMessage.includes('help') || lowerMessage.includes('assist') || lowerMessage.includes('support')) {
      intent = 'help';
      sentiment = 'neutral';
    } else if (lowerMessage.includes('policy') || lowerMessage.includes('policies') || lowerMessage.includes('governance')) {
      intent = 'policies';
      sentiment = 'neutral';
    } else if (lowerMessage.includes('audit') || lowerMessage.includes('log') || lowerMessage.includes('logs')) {
      intent = 'audit';
      sentiment = 'neutral';
    }

    // Sentiment analysis simulation
    if (lowerMessage.includes('great') || lowerMessage.includes('good') || lowerMessage.includes('excellent')) {
      sentiment = 'positive';
    } else if (lowerMessage.includes('bad') || lowerMessage.includes('terrible') || lowerMessage.includes('hate')) {
      sentiment = 'negative';
    }

    const responses = contextualResponses[intent as keyof typeof contextualResponses] || [
      "I understand your question. Let me help you with that.",
      "That's an interesting point. Based on your current activity, I think I can provide relevant assistance.",
      "I'm processing your request. Given your session context, here's what I recommend."
    ];

    const selectedResponse = responses[Math.floor(Math.random() * responses.length)];

    // Add behavioral context to response
    let contextualAddition = '';
    if (behavior.sessionDuration > 1800000) { // 30 minutes
      contextualAddition = " I notice you've been using the system for a while - would you like me to summarize your recent activity?";
    } else if (behavior.interactionCount < 2) {
      contextualAddition = " Since you're new to this session, feel free to ask me about any features you'd like to explore.";
    }

    return {
      message: selectedResponse + contextualAddition,
      sentiment,
      confidence
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'neutral': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'proactive': return <Zap className="h-4 w-4 text-purple-600" />;
      case 'bot': return <Bot className="h-4 w-4 text-blue-600" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsProactiveMode(!isProactiveMode)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              isProactiveMode 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Zap className="h-3 w-3 inline mr-1" />
            Proactive: {isProactiveMode ? 'ON' : 'OFF'}
          </button>
          <div className="text-xs text-gray-500">
            <Clock className="h-3 w-3 inline mr-1" />
            Idle: {Math.floor(userBehavior.idleTime / 1000)}s
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.type === 'user'
                ? 'bg-blue-600 text-white'
                : message.type === 'proactive'
                ? 'bg-purple-50 text-purple-900 border border-purple-200'
                : 'bg-gray-100 text-gray-900'
            }`}>
              <div className="flex items-center space-x-2 mb-1">
                {getMessageIcon(message.type)}
                <span className="text-xs font-medium">
                  {message.type === 'user' ? 'You' : 
                   message.type === 'proactive' ? 'AI (Proactive)' : 'AI Assistant'}
                </span>
                {message.sentiment && (
                  <span className={`text-xs ${getSentimentColor(message.sentiment)}`}>
                    {message.sentiment} ({Math.round((message.confidence || 0) * 100)}%)
                  </span>
                )}
              </div>
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-75">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm">AI is typing...</span>
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
            placeholder="Ask me anything about AegisAI..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !inputValue.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
        
        {/* Behavior Stats */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Session: {Math.floor(userBehavior.sessionDuration / 60000)}m</span>
          <span>Interactions: {userBehavior.interactionCount}</span>
          <span>Page: {userBehavior.currentPage}</span>
        </div>
      </div>
    </div>
  );
};

export default ProactiveChatbot;