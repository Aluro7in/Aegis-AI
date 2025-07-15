import React, { useState, useEffect } from 'react';
import { MessageCircle, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Filter } from 'lucide-react';
import { useGovernance } from '../../contexts/GovernanceContext';

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
  sentiment?: {
    score: number;
    label: 'positive' | 'neutral' | 'negative';
    confidence: number;
    emotions?: {
      joy: number;
      anger: number;
      fear: number;
      sadness: number;
      surprise: number;
      disgust: number;
    };
    keywords?: string[];
    flagged: boolean;
    moderationReason?: string;
  };
  status: 'pending' | 'analyzed' | 'flagged' | 'approved';
}

interface SentimentStats {
  total: number;
  positive: number;
  neutral: number;
  negative: number;
  flagged: number;
  averageScore: number;
  trends: {
    hourly: number[];
    daily: number[];
    labels: string[];
  };
}

const SentimentAnalysis: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [stats, setStats] = useState<SentimentStats | null>(null);
  const [filter, setFilter] = useState<'all' | 'positive' | 'neutral' | 'negative' | 'flagged'>('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoModeration, setAutoModeration] = useState(true);
  const { addAuditLog } = useGovernance();

  // Sample comments for demonstration
  useEffect(() => {
    const sampleComments: Comment[] = [
      {
        id: '1',
        text: 'This AI governance system is absolutely fantastic! Great work on the implementation.',
        author: 'John Doe',
        timestamp: new Date(Date.now() - 3600000),
        status: 'pending'
      },
      {
        id: '2',
        text: 'I hate how complicated this interface is. It\'s terrible and confusing.',
        author: 'Jane Smith',
        timestamp: new Date(Date.now() - 7200000),
        status: 'pending'
      },
      {
        id: '3',
        text: 'The system works okay, nothing special but gets the job done.',
        author: 'Bob Johnson',
        timestamp: new Date(Date.now() - 10800000),
        status: 'pending'
      },
      {
        id: '4',
        text: 'Amazing features and excellent user experience! Love the real-time analytics.',
        author: 'Alice Brown',
        timestamp: new Date(Date.now() - 14400000),
        status: 'pending'
      },
      {
        id: '5',
        text: 'This is the worst software I\'ve ever used. Complete garbage and waste of time.',
        author: 'Charlie Wilson',
        timestamp: new Date(Date.now() - 18000000),
        status: 'pending'
      }
    ];

    setComments(sampleComments);
  }, []);

  // Analyze comments when they change
  useEffect(() => {
    const pendingComments = comments.filter(c => c.status === 'pending');
    if (pendingComments.length > 0) {
      analyzePendingComments();
    }
  }, [comments]);

  // Update stats when comments change
  useEffect(() => {
    updateStats();
  }, [comments]);

  const analyzePendingComments = async () => {
    setIsAnalyzing(true);
    
    const pendingComments = comments.filter(c => c.status === 'pending');
    
    for (const comment of pendingComments) {
      try {
        const sentiment = await simulateSentimentAPI(comment.text);
        
        setComments(prev => prev.map(c => 
          c.id === comment.id 
            ? { 
                ...c, 
                sentiment, 
                status: sentiment.flagged ? 'flagged' : 'analyzed' 
              }
            : c
        ));

        // Log audit event
        addAuditLog({
          userId: 'system',
          action: 'SENTIMENT_ANALYSIS',
          resource: 'COMMENT',
          details: {
            commentId: comment.id,
            sentiment: sentiment.label,
            score: sentiment.score,
            flagged: sentiment.flagged
          },
          risk: sentiment.flagged ? 'high' : 'low'
        });

        // Small delay between analyses
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Sentiment analysis error:', error);
      }
    }
    
    setIsAnalyzing(false);
  };

  const simulateSentimentAPI = async (text: string): Promise<Comment['sentiment']> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowerText = text.toLowerCase();
    
    // Simple sentiment analysis simulation
    let score = 0;
    let label: 'positive' | 'neutral' | 'negative' = 'neutral';
    let confidence = 0.7 + Math.random() * 0.3;
    
    // Positive indicators
    const positiveWords = ['great', 'excellent', 'amazing', 'fantastic', 'love', 'good', 'awesome', 'wonderful'];
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    
    // Negative indicators
    const negativeWords = ['hate', 'terrible', 'awful', 'bad', 'worst', 'garbage', 'horrible', 'disgusting'];
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    // Calculate score
    score = (positiveCount - negativeCount) * 0.3;
    score = Math.max(-1, Math.min(1, score + (Math.random() - 0.5) * 0.4));
    
    if (score > 0.2) {
      label = 'positive';
    } else if (score < -0.2) {
      label = 'negative';
    }

    // Emotion analysis simulation
    const emotions = {
      joy: label === 'positive' ? 0.6 + Math.random() * 0.4 : Math.random() * 0.3,
      anger: label === 'negative' ? 0.5 + Math.random() * 0.5 : Math.random() * 0.2,
      fear: Math.random() * 0.3,
      sadness: label === 'negative' ? 0.3 + Math.random() * 0.4 : Math.random() * 0.2,
      surprise: Math.random() * 0.4,
      disgust: negativeCount > 0 ? 0.3 + Math.random() * 0.4 : Math.random() * 0.2
    };

    // Extract keywords
    const keywords = text.split(' ')
      .filter(word => word.length > 3)
      .filter(word => positiveWords.includes(word.toLowerCase()) || negativeWords.includes(word.toLowerCase()))
      .slice(0, 5);

    // Flagging logic
    const flagged = autoModeration && (
      score < -0.7 || 
      negativeCount >= 2 || 
      lowerText.includes('hate') ||
      emotions.anger > 0.8
    );

    let moderationReason;
    if (flagged) {
      if (score < -0.7) moderationReason = 'Highly negative sentiment detected';
      else if (negativeCount >= 2) moderationReason = 'Multiple negative keywords detected';
      else if (lowerText.includes('hate')) moderationReason = 'Hate speech indicators detected';
      else if (emotions.anger > 0.8) moderationReason = 'High anger emotion detected';
    }

    return {
      score,
      label,
      confidence,
      emotions,
      keywords,
      flagged,
      moderationReason
    };
  };

  const updateStats = () => {
    const analyzedComments = comments.filter(c => c.sentiment);
    
    if (analyzedComments.length === 0) {
      setStats(null);
      return;
    }

    const positive = analyzedComments.filter(c => c.sentiment?.label === 'positive').length;
    const neutral = analyzedComments.filter(c => c.sentiment?.label === 'neutral').length;
    const negative = analyzedComments.filter(c => c.sentiment?.label === 'negative').length;
    const flagged = analyzedComments.filter(c => c.sentiment?.flagged).length;
    
    const averageScore = analyzedComments.reduce((sum, c) => sum + (c.sentiment?.score || 0), 0) / analyzedComments.length;

    // Generate trend data (simulated)
    const generateTrendData = (length: number) => {
      return Array.from({ length }, () => Math.random() * 2 - 1); // -1 to 1 range
    };

    setStats({
      total: analyzedComments.length,
      positive,
      neutral,
      negative,
      flagged,
      averageScore,
      trends: {
        hourly: generateTrendData(24),
        daily: generateTrendData(7),
        labels: ['12AM', '3AM', '6AM', '9AM', '12PM', '3PM', '6PM', '9PM']
      }
    });
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment,
      author: 'Current User',
      timestamp: new Date(),
      status: 'pending'
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const handleModerateComment = (commentId: string, action: 'approve' | 'reject') => {
    setComments(prev => prev.map(c => 
      c.id === commentId 
        ? { ...c, status: action === 'approve' ? 'approved' : 'flagged' }
        : c
    ));

    addAuditLog({
      userId: 'moderator',
      action: `COMMENT_${action.toUpperCase()}`,
      resource: 'COMMENT',
      details: { commentId, action },
      risk: action === 'reject' ? 'medium' : 'low'
    });
  };

  const getSentimentColor = (sentiment?: Comment['sentiment']) => {
    if (!sentiment) return 'text-gray-600 bg-gray-100';
    
    switch (sentiment.label) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      case 'neutral': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSentimentIcon = (sentiment?: Comment['sentiment']) => {
    if (!sentiment) return <Minus className="h-4 w-4" />;
    
    switch (sentiment.label) {
      case 'positive': return <TrendingUp className="h-4 w-4" />;
      case 'negative': return <TrendingDown className="h-4 w-4" />;
      case 'neutral': return <Minus className="h-4 w-4" />;
      default: return <Minus className="h-4 w-4" />;
    }
  };

  const filteredComments = comments.filter(comment => {
    if (filter === 'all') return true;
    if (filter === 'flagged') return comment.sentiment?.flagged;
    return comment.sentiment?.label === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Sentiment Analysis</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoModeration(!autoModeration)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              autoModeration 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Auto-moderation: {autoModeration ? 'ON' : 'OFF'}
          </button>
          {isAnalyzing && (
            <div className="flex items-center space-x-1 text-blue-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-xs">Analyzing...</span>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Comments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-gray-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Positive</p>
                <p className="text-2xl font-bold text-green-600">{stats.positive}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.positive / stats.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Neutral</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.neutral}</p>
              </div>
              <Minus className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.neutral / stats.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Negative</p>
                <p className="text-2xl font-bold text-red-600">{stats.negative}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.negative / stats.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Flagged</p>
                <p className="text-2xl font-bold text-orange-600">{stats.flagged}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.flagged / stats.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comment Input */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Comment for Analysis</h3>
          
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Enter a comment to analyze its sentiment..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isAnalyzing}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Analyze Sentiment
            </button>
          </form>

          {/* Sample Comments */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Try these examples:</h4>
            <div className="space-y-2">
              {[
                "This is absolutely amazing! Great work!",
                "I hate this interface, it's terrible.",
                "The system works fine, nothing special."
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => setNewComment(example)}
                  className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border transition-colors"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredComments.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No comments match the current filter</p>
              </div>
            ) : (
              filteredComments.map((comment) => (
                <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{comment.author}</span>
                      <span className="text-xs text-gray-500">
                        {comment.timestamp.toLocaleString()}
                      </span>
                    </div>
                    {comment.sentiment && (
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getSentimentColor(comment.sentiment)}`}>
                          {getSentimentIcon(comment.sentiment)}
                          <span>{comment.sentiment.label}</span>
                          <span>({Math.round(comment.sentiment.score * 100)})</span>
                        </span>
                        {comment.sentiment.flagged && (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-700 mb-3">{comment.text}</p>
                  
                  {comment.sentiment && (
                    <div className="space-y-2">
                      {comment.sentiment.emotions && (
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Emotions: </span>
                          {Object.entries(comment.sentiment.emotions)
                            .filter(([_, value]) => value > 0.3)
                            .map(([emotion, value]) => `${emotion}: ${Math.round(value * 100)}%`)
                            .join(', ')}
                        </div>
                      )}
                      
                      {comment.sentiment.keywords && comment.sentiment.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {comment.sentiment.keywords.map((keyword, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {comment.sentiment.flagged && comment.sentiment.moderationReason && (
                        <div className="bg-red-50 border border-red-200 rounded p-2">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="text-sm text-red-800 font-medium">Flagged for moderation</span>
                          </div>
                          <p className="text-xs text-red-700 mt-1">{comment.sentiment.moderationReason}</p>
                          <div className="flex space-x-2 mt-2">
                            <button
                              onClick={() => handleModerateComment(comment.id, 'approve')}
                              className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                              <CheckCircle className="h-3 w-3 inline mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleModerateComment(comment.id, 'reject')}
                              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                              <AlertTriangle className="h-3 w-3 inline mr-1" />
                              Reject
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {comment.status === 'pending' && (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                      <span className="text-xs">Analyzing sentiment...</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;