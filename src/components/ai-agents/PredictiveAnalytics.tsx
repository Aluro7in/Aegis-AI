import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Target, Brain, Zap, Users, Activity, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useGovernance } from '../../contexts/GovernanceContext';

interface UserInteraction {
  timestamp: Date;
  action: string;
  page: string;
  duration: number;
  success: boolean;
}

interface Prediction {
  id: string;
  type: 'churn_risk' | 'feature_adoption' | 'performance_issue' | 'policy_violation';
  confidence: number;
  prediction: string;
  recommendation: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  data: any;
}

interface AnalyticsData {
  userEngagement: number;
  sessionQuality: number;
  featureAdoption: number;
  riskScore: number;
  predictions: Prediction[];
  trends: {
    daily: number[];
    weekly: number[];
    labels: string[];
  };
}

const PredictiveAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [interactions, setInteractions] = useState<UserInteraction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { user } = useAuth();
  const { decisions, metrics } = useGovernance();

  // Collect user interaction data
  useEffect(() => {
    const trackInteraction = (action: string, page: string, success: boolean = true) => {
      const interaction: UserInteraction = {
        timestamp: new Date(),
        action,
        page,
        duration: Math.random() * 5000 + 1000, // Simulate duration
        success
      };
      
      setInteractions(prev => [...prev.slice(-49), interaction]); // Keep last 50 interactions
    };

    // Track page navigation
    const handlePageChange = () => {
      trackInteraction('page_view', window.location.pathname);
    };

    // Track clicks
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const action = target.tagName === 'BUTTON' ? 'button_click' : 'element_click';
      trackInteraction(action, window.location.pathname);
    };

    // Track form submissions
    const handleSubmit = () => {
      trackInteraction('form_submit', window.location.pathname);
    };

    window.addEventListener('popstate', handlePageChange);
    document.addEventListener('click', handleClick);
    document.addEventListener('submit', handleSubmit);

    return () => {
      window.removeEventListener('popstate', handlePageChange);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('submit', handleSubmit);
    };
  }, []);

  // Analyze data and generate predictions
  useEffect(() => {
    if (interactions.length < 5) return; // Need minimum data

    const analyzeData = async () => {
      setIsAnalyzing(true);
      
      try {
        // Simulate ML API call
        const analysis = await simulateMLAnalysis(interactions, decisions, metrics, user);
        setAnalyticsData(analysis);
      } catch (error) {
        console.error('Analytics error:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyzeData();
  }, [interactions, decisions, metrics, user]);

  // Auto-refresh analytics
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      if (interactions.length >= 5) {
        simulateMLAnalysis(interactions, decisions, metrics, user)
          .then(setAnalyticsData)
          .catch(console.error);
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, interactions, decisions, metrics, user]);

  const simulateMLAnalysis = async (
    interactions: UserInteraction[],
    decisions: any[],
    metrics: any,
    user: any
  ): Promise<AnalyticsData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Calculate engagement metrics
    const recentInteractions = interactions.slice(-20);
    const avgDuration = recentInteractions.reduce((sum, i) => sum + i.duration, 0) / recentInteractions.length;
    const successRate = recentInteractions.filter(i => i.success).length / recentInteractions.length;
    const uniquePages = new Set(recentInteractions.map(i => i.page)).size;

    // Generate predictions based on patterns
    const predictions: Prediction[] = [];

    // Churn risk prediction
    if (avgDuration < 2000 || successRate < 0.7) {
      predictions.push({
        id: 'churn_1',
        type: 'churn_risk',
        confidence: 0.75,
        prediction: 'High churn risk detected based on low engagement patterns',
        recommendation: 'Provide personalized onboarding or feature tutorials',
        priority: 'high',
        timestamp: new Date(),
        data: { avgDuration, successRate }
      });
    }

    // Feature adoption prediction
    if (uniquePages < 3 && interactions.length > 10) {
      predictions.push({
        id: 'adoption_1',
        type: 'feature_adoption',
        confidence: 0.68,
        prediction: 'Low feature adoption - user primarily uses basic features',
        recommendation: 'Suggest advanced features based on user role and needs',
        priority: 'medium',
        timestamp: new Date(),
        data: { uniquePages, totalInteractions: interactions.length }
      });
    }

    // Performance issue prediction
    if (decisions.length > 0) {
      const avgProcessingTime = decisions.reduce((sum, d) => sum + d.processingTime, 0) / decisions.length;
      if (avgProcessingTime > 2000) {
        predictions.push({
          id: 'performance_1',
          type: 'performance_issue',
          confidence: 0.82,
          prediction: 'System performance degradation detected',
          recommendation: 'Optimize governance pipeline or scale infrastructure',
          priority: 'critical',
          timestamp: new Date(),
          data: { avgProcessingTime }
        });
      }
    }

    // Policy violation prediction
    const recentBlocked = decisions.filter(d => d.finalDecision === 'block').length;
    if (recentBlocked > decisions.length * 0.3) {
      predictions.push({
        id: 'policy_1',
        type: 'policy_violation',
        confidence: 0.71,
        prediction: 'High policy violation rate indicates potential training need',
        recommendation: 'Provide policy training or adjust policy sensitivity',
        priority: 'medium',
        timestamp: new Date(),
        data: { blockedRate: recentBlocked / decisions.length }
      });
    }

    // Generate trend data
    const generateTrendData = (length: number) => {
      return Array.from({ length }, (_, i) => {
        const base = 50 + Math.sin(i * 0.5) * 20;
        return Math.max(0, Math.min(100, base + (Math.random() - 0.5) * 30));
      });
    };

    return {
      userEngagement: Math.round(successRate * 100),
      sessionQuality: Math.round((avgDuration / 5000) * 100),
      featureAdoption: Math.round((uniquePages / 6) * 100), // Assuming 6 main features
      riskScore: Math.round((1 - successRate) * 100),
      predictions,
      trends: {
        daily: generateTrendData(7),
        weekly: generateTrendData(4),
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      }
    };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getPredictionIcon = (type: string) => {
    switch (type) {
      case 'churn_risk': return <Users className="h-5 w-5" />;
      case 'feature_adoption': return <Target className="h-5 w-5" />;
      case 'performance_issue': return <Activity className="h-5 w-5" />;
      case 'policy_violation': return <AlertTriangle className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  if (!analyticsData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-center space-x-2">
          <Brain className="h-6 w-6 text-blue-600 animate-pulse" />
          <span className="text-gray-600">
            {isAnalyzing ? 'Analyzing user behavior...' : 'Collecting interaction data...'}
          </span>
        </div>
        <div className="mt-4 text-sm text-gray-500 text-center">
          Minimum 5 interactions required for analysis. Current: {interactions.length}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Predictive Analytics</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              autoRefresh 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Zap className="h-3 w-3 inline mr-1" />
            Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}
          </button>
          {isAnalyzing && (
            <div className="flex items-center space-x-1 text-blue-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-xs">Analyzing...</span>
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">User Engagement</p>
              <p className="text-2xl font-bold text-green-600">{analyticsData.userEngagement}%</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analyticsData.userEngagement}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Session Quality</p>
              <p className="text-2xl font-bold text-blue-600">{analyticsData.sessionQuality}%</p>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analyticsData.sessionQuality}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Feature Adoption</p>
              <p className="text-2xl font-bold text-purple-600">{analyticsData.featureAdoption}%</p>
            </div>
            <Target className="h-8 w-8 text-purple-600" />
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analyticsData.featureAdoption}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Risk Score</p>
              <p className="text-2xl font-bold text-red-600">{analyticsData.riskScore}%</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analyticsData.riskScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Predictions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">AI Predictions & Recommendations</h3>
          <TrendingUp className="h-5 w-5 text-blue-600" />
        </div>

        {analyticsData.predictions.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No predictions available</p>
            <p className="text-sm text-gray-400">Continue using the system to generate insights</p>
          </div>
        ) : (
          <div className="space-y-4">
            {analyticsData.predictions.map((prediction) => (
              <div key={prediction.id} className={`border rounded-lg p-4 ${getPriorityColor(prediction.priority)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getPredictionIcon(prediction.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{prediction.type.replace('_', ' ').toUpperCase()}</h4>
                        <span className="text-xs px-2 py-1 bg-white rounded-full">
                          {Math.round(prediction.confidence * 100)}% confidence
                        </span>
                      </div>
                      <p className="text-sm mb-2">{prediction.prediction}</p>
                      <div className="bg-white bg-opacity-50 p-2 rounded text-sm">
                        <strong>Recommendation:</strong> {prediction.recommendation}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(prediction.priority)}`}>
                      {prediction.priority}
                    </span>
                    <Clock className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trend Visualization */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Daily Trend (Last 7 days)</h4>
            <div className="flex items-end space-x-1 h-32">
              {analyticsData.trends.daily.map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-blue-500 rounded-t transition-all duration-500"
                    style={{ height: `${value}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">
                    {analyticsData.trends.labels[index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Weekly Trend (Last 4 weeks)</h4>
            <div className="flex items-end space-x-2 h-32">
              {analyticsData.trends.weekly.map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-purple-500 rounded-t transition-all duration-500"
                    style={{ height: `${value}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">W{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Interactions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Interactions</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {interactions.slice(-10).reverse().map((interaction, index) => (
            <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${interaction.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium">{interaction.action}</span>
                <span className="text-xs text-gray-500">{interaction.page}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{Math.round(interaction.duration)}ms</span>
                <span>{interaction.timestamp.toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalytics;