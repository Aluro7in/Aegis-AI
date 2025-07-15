import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone, Mic, MicOff, Play, Pause, TrendingUp, Users, MessageCircle, Star } from 'lucide-react';
import { CallInsight } from '../../types';

interface CallInsightsProps {
  onBack: () => void;
}

const CallInsights: React.FC<CallInsightsProps> = ({ onBack }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [sentiment, setSentiment] = useState<'positive' | 'neutral' | 'negative'>('neutral');
  const [insights, setInsights] = useState<CallInsight[]>([]);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Sample insights data
  const sampleInsights: CallInsight[] = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 3600000),
      duration: 480,
      sentiment: 'positive',
      satisfaction: 4.5,
      transcript: 'Customer called about billing inquiry. Resolved successfully with account credit.',
      summary: 'Billing inquiry resolved with $25 credit applied to account.',
      actionItems: ['Follow up in 24 hours', 'Update customer preference in CRM'],
      coachingTips: ['Great active listening', 'Could have been more proactive about additional services']
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 7200000),
      duration: 320,
      sentiment: 'neutral',
      satisfaction: 3.8,
      transcript: 'Technical support call for password reset. Guided customer through process.',
      summary: 'Password reset completed successfully.',
      actionItems: ['Send follow-up email with security tips'],
      coachingTips: ['Good technical explanation', 'Could have been more empathetic to frustration']
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 10800000),
      duration: 600,
      sentiment: 'negative',
      satisfaction: 2.1,
      transcript: 'Customer complaint about service interruption. Escalated to technical team.',
      summary: 'Service interruption complaint escalated to technical team.',
      actionItems: ['Technical team to investigate', 'Schedule callback within 2 hours'],
      coachingTips: ['Maintain calm demeanor', 'Offer proactive solutions', 'Set clear expectations']
    }
  ];

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript + ' ');
          analyzeSentiment(finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      setRecognition(recognition);
    }

    // Load sample insights
    setInsights(sampleInsights);
  }, []);

  const analyzeSentiment = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('great') || lowerText.includes('excellent') || lowerText.includes('happy')) {
      setSentiment('positive');
    } else if (lowerText.includes('bad') || lowerText.includes('terrible') || lowerText.includes('angry')) {
      setSentiment('negative');
    } else {
      setSentiment('neutral');
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognition?.stop();
    } else {
      recognition?.start();
    }
    setIsRecording(!isRecording);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      case 'neutral': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const generateCoachingTips = () => {
    const tips = [
      'Try to use more empathetic language',
      'Ask open-ended questions to understand customer needs',
      'Summarize key points to ensure understanding',
      'Offer proactive solutions beyond the immediate issue',
      'Use positive language to frame solutions'
    ];
    return tips.slice(0, 3);
  };

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
          <h1 className="text-3xl font-bold text-gray-900">AI-Driven Live Call Insights</h1>
          <p className="mt-2 text-gray-600">Real-time customer service enhancement with AI-powered insights</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Call Interface */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Live Call Interface</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">{isRecording ? 'Recording' : 'Stopped'}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={toggleRecording}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                      isRecording 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
                  </button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg min-h-32">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Live Transcript</h4>
                  <p className="text-gray-600 text-sm">
                    {transcript || 'Click "Start Recording" to begin live transcription...'}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Sentiment:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSentimentColor(sentiment)}`}>
                      {sentiment}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Call Duration:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {isRecording ? '00:00:00' : '00:00:00'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Coaching */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Coaching</h3>
              <div className="space-y-3">
                {generateCoachingTips().map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Metrics & Analytics */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Calls</span>
                  <span className="text-lg font-semibold text-gray-900">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Duration</span>
                  <span className="text-lg font-semibold text-gray-900">8:30</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Satisfaction</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-lg font-semibold text-gray-900">4.2</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Resolution Rate</span>
                  <span className="text-lg font-semibold text-green-600">89%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Distribution</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Positive</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="w-16 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">65%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Neutral</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="w-6 h-2 bg-yellow-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">25%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Negative</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">10%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call History */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Call Insights</h3>
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {insight.timestamp.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {Math.floor(insight.duration / 60)}:{(insight.duration % 60).toString().padStart(2, '0')}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSentimentColor(insight.sentiment)}`}>
                        {insight.sentiment}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">{insight.satisfaction}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{insight.summary}</p>
                    <div className="flex flex-wrap gap-4">
                      {insight.actionItems.length > 0 && (
                        <div>
                          <span className="text-xs font-medium text-gray-500">Action Items:</span>
                          <ul className="text-xs text-gray-600 mt-1">
                            {insight.actionItems.map((item, index) => (
                              <li key={index}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {insight.coachingTips.length > 0 && (
                        <div>
                          <span className="text-xs font-medium text-gray-500">Coaching Tips:</span>
                          <ul className="text-xs text-gray-600 mt-1">
                            {insight.coachingTips.map((tip, index) => (
                              <li key={index}>• {tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallInsights;