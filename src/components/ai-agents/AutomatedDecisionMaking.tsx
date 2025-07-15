import React, { useState, useEffect } from 'react';
import { Brain, Zap, Settings, Play, Pause, Target, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useGovernance } from '../../contexts/GovernanceContext';

interface DecisionRule {
  id: string;
  name: string;
  description: string;
  conditions: Array<{
    field: string;
    operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'not_equals';
    value: string | number;
  }>;
  actions: Array<{
    type: 'recommend_service' | 'assign_task' | 'send_notification' | 'update_status' | 'trigger_workflow';
    parameters: Record<string, any>;
  }>;
  priority: number;
  enabled: boolean;
  triggers: number;
  lastTriggered?: Date;
}

interface UserContext {
  role: string;
  sessionDuration: number;
  interactionCount: number;
  currentPage: string;
  recentActions: string[];
  preferences: Record<string, any>;
  milestones: string[];
}

interface Decision {
  id: string;
  ruleId: string;
  ruleName: string;
  timestamp: Date;
  context: UserContext;
  decision: string;
  confidence: number;
  executed: boolean;
  result?: string;
}

const AutomatedDecisionMaking: React.FC = () => {
  const [rules, setRules] = useState<DecisionRule[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [isSystemActive, setIsSystemActive] = useState(true);
  const [showRuleEditor, setShowRuleEditor] = useState(false);
  const [editingRule, setEditingRule] = useState<DecisionRule | null>(null);
  const { user } = useAuth();
  const { addAuditLog } = useGovernance();

  // Initialize default rules
  useEffect(() => {
    const defaultRules: DecisionRule[] = [
      {
        id: 'new_user_onboarding',
        name: 'New User Onboarding',
        description: 'Recommend onboarding tutorial for new users with low interaction count',
        conditions: [
          { field: 'interactionCount', operator: 'less_than', value: 5 },
          { field: 'sessionDuration', operator: 'greater_than', value: 300000 } // 5 minutes
        ],
        actions: [
          {
            type: 'recommend_service',
            parameters: {
              service: 'onboarding_tutorial',
              message: 'Welcome! Would you like a quick tour of AegisAI features?',
              priority: 'high'
            }
          }
        ],
        priority: 1,
        enabled: true,
        triggers: 0
      },
      {
        id: 'advanced_user_features',
        name: 'Advanced Features Recommendation',
        description: 'Suggest advanced features for experienced users',
        conditions: [
          { field: 'interactionCount', operator: 'greater_than', value: 20 },
          { field: 'role', operator: 'equals', value: 'Admin' }
        ],
        actions: [
          {
            type: 'recommend_service',
            parameters: {
              service: 'advanced_analytics',
              message: 'You might be interested in our advanced analytics features!',
              priority: 'medium'
            }
          }
        ],
        priority: 2,
        enabled: true,
        triggers: 0
      },
      {
        id: 'policy_assistance',
        name: 'Policy Management Assistance',
        description: 'Offer help when user visits policy page',
        conditions: [
          { field: 'currentPage', operator: 'equals', value: 'policies' },
          { field: 'sessionDuration', operator: 'greater_than', value: 120000 } // 2 minutes
        ],
        actions: [
          {
            type: 'send_notification',
            parameters: {
              message: 'Need help with policy management? I can assist with creating or modifying policies.',
              type: 'info'
            }
          }
        ],
        priority: 3,
        enabled: true,
        triggers: 0
      },
      {
        id: 'milestone_achievement',
        name: 'Milestone Achievement',
        description: 'Congratulate users on reaching milestones',
        conditions: [
          { field: 'milestones', operator: 'contains', value: 'first_policy_created' }
        ],
        actions: [
          {
            type: 'send_notification',
            parameters: {
              message: 'Congratulations! You\'ve created your first policy. Keep up the great work!',
              type: 'success'
            }
          },
          {
            type: 'recommend_service',
            parameters: {
              service: 'policy_best_practices',
              message: 'Learn about policy best practices to optimize your governance setup.',
              priority: 'low'
            }
          }
        ],
        priority: 4,
        enabled: true,
        triggers: 0
      },
      {
        id: 'idle_user_engagement',
        name: 'Idle User Re-engagement',
        description: 'Re-engage users who have been idle for too long',
        conditions: [
          { field: 'sessionDuration', operator: 'greater_than', value: 1800000 }, // 30 minutes
          { field: 'interactionCount', operator: 'less_than', value: 3 }
        ],
        actions: [
          {
            type: 'trigger_workflow',
            parameters: {
              workflow: 'user_engagement',
              message: 'You\'ve been browsing for a while. Would you like me to show you some key features?',
              actions: ['show_dashboard', 'demo_features']
            }
          }
        ],
        priority: 5,
        enabled: true,
        triggers: 0
      }
    ];

    setRules(defaultRules);
  }, []);

  // Track user context
  useEffect(() => {
    const updateUserContext = () => {
      const context: UserContext = {
        role: user?.role || 'End-User',
        sessionDuration: Date.now() - (sessionStorage.getItem('sessionStart') ? 
          parseInt(sessionStorage.getItem('sessionStart')!) : Date.now()),
        interactionCount: parseInt(localStorage.getItem('interactionCount') || '0'),
        currentPage: window.location.pathname.split('/').pop() || 'dashboard',
        recentActions: JSON.parse(localStorage.getItem('recentActions') || '[]'),
        preferences: JSON.parse(localStorage.getItem('userPreferences') || '{}'),
        milestones: JSON.parse(localStorage.getItem('userMilestones') || '[]')
      };

      setUserContext(context);
    };

    // Initialize session start time
    if (!sessionStorage.getItem('sessionStart')) {
      sessionStorage.setItem('sessionStart', Date.now().toString());
    }

    updateUserContext();

    // Update context every 30 seconds
    const interval = setInterval(updateUserContext, 30000);

    return () => clearInterval(interval);
  }, [user]);

  // Decision engine
  useEffect(() => {
    if (!isSystemActive || !userContext) return;

    const evaluateRules = () => {
      const enabledRules = rules.filter(rule => rule.enabled);
      
      for (const rule of enabledRules) {
        if (evaluateConditions(rule.conditions, userContext)) {
          executeRule(rule, userContext);
        }
      }
    };

    // Evaluate rules every 10 seconds
    const interval = setInterval(evaluateRules, 10000);

    return () => clearInterval(interval);
  }, [isSystemActive, userContext, rules]);

  const evaluateConditions = (conditions: DecisionRule['conditions'], context: UserContext): boolean => {
    return conditions.every(condition => {
      const contextValue = getContextValue(condition.field, context);
      
      switch (condition.operator) {
        case 'equals':
          return contextValue === condition.value;
        case 'not_equals':
          return contextValue !== condition.value;
        case 'greater_than':
          return Number(contextValue) > Number(condition.value);
        case 'less_than':
          return Number(contextValue) < Number(condition.value);
        case 'contains':
          if (Array.isArray(contextValue)) {
            return contextValue.includes(condition.value);
          }
          return String(contextValue).includes(String(condition.value));
        default:
          return false;
      }
    });
  };

  const getContextValue = (field: string, context: UserContext): any => {
    switch (field) {
      case 'role': return context.role;
      case 'sessionDuration': return context.sessionDuration;
      case 'interactionCount': return context.interactionCount;
      case 'currentPage': return context.currentPage;
      case 'recentActions': return context.recentActions;
      case 'milestones': return context.milestones;
      default: return context.preferences[field];
    }
  };

  const executeRule = (rule: DecisionRule, context: UserContext) => {
    // Check if rule was recently triggered (avoid spam)
    const recentDecisions = decisions.filter(d => 
      d.ruleId === rule.id && 
      Date.now() - d.timestamp.getTime() < 300000 // 5 minutes
    );
    
    if (recentDecisions.length > 0) return;

    const decision: Decision = {
      id: Date.now().toString(),
      ruleId: rule.id,
      ruleName: rule.name,
      timestamp: new Date(),
      context: { ...context },
      decision: generateDecisionText(rule, context),
      confidence: calculateConfidence(rule, context),
      executed: false
    };

    setDecisions(prev => [decision, ...prev.slice(0, 49)]); // Keep last 50 decisions

    // Execute actions
    rule.actions.forEach(action => {
      executeAction(action, decision);
    });

    // Update rule trigger count
    setRules(prev => prev.map(r => 
      r.id === rule.id 
        ? { ...r, triggers: r.triggers + 1, lastTriggered: new Date() }
        : r
    ));

    // Log audit event
    addAuditLog({
      userId: user?.id || 'system',
      action: 'AUTOMATED_DECISION',
      resource: 'DECISION_ENGINE',
      details: {
        ruleId: rule.id,
        ruleName: rule.name,
        decision: decision.decision,
        confidence: decision.confidence
      },
      risk: 'low'
    });
  };

  const generateDecisionText = (rule: DecisionRule, context: UserContext): string => {
    const templates = {
      new_user_onboarding: `Recommend onboarding for user with ${context.interactionCount} interactions`,
      advanced_user_features: `Suggest advanced features for experienced ${context.role}`,
      policy_assistance: `Offer policy help on ${context.currentPage} page`,
      milestone_achievement: `Congratulate on milestone: ${context.milestones.join(', ')}`,
      idle_user_engagement: `Re-engage idle user after ${Math.round(context.sessionDuration / 60000)} minutes`
    };

    return templates[rule.id as keyof typeof templates] || `Execute rule: ${rule.name}`;
  };

  const calculateConfidence = (rule: DecisionRule, context: UserContext): number => {
    // Simple confidence calculation based on how well conditions are met
    let confidence = 0.7; // Base confidence
    
    // Increase confidence based on rule priority (higher priority = higher confidence)
    confidence += (6 - rule.priority) * 0.05;
    
    // Increase confidence based on context strength
    if (context.interactionCount > 10) confidence += 0.1;
    if (context.sessionDuration > 600000) confidence += 0.1; // 10 minutes
    
    return Math.min(0.95, confidence);
  };

  const executeAction = (action: DecisionRule['actions'][0], decision: Decision) => {
    switch (action.type) {
      case 'recommend_service':
        showRecommendation(action.parameters, decision);
        break;
      case 'send_notification':
        showNotification(action.parameters, decision);
        break;
      case 'assign_task':
        assignTask(action.parameters, decision);
        break;
      case 'update_status':
        updateUserStatus(action.parameters, decision);
        break;
      case 'trigger_workflow':
        triggerWorkflow(action.parameters, decision);
        break;
    }

    // Mark decision as executed
    setDecisions(prev => prev.map(d => 
      d.id === decision.id ? { ...d, executed: true, result: `Executed ${action.type}` } : d
    ));
  };

  const showRecommendation = (params: any, decision: Decision) => {
    // In a real implementation, this would show a UI recommendation
    console.log('Recommendation:', params.message);
    
    // Simulate showing a toast or modal
    if (window.confirm(`${params.message}\n\nWould you like to proceed?`)) {
      // User accepted recommendation
      setDecisions(prev => prev.map(d => 
        d.id === decision.id ? { ...d, result: 'User accepted recommendation' } : d
      ));
    }
  };

  const showNotification = (params: any, decision: Decision) => {
    // In a real implementation, this would show a notification
    console.log('Notification:', params.message);
    
    // Simulate notification
    alert(`${params.type.toUpperCase()}: ${params.message}`);
  };

  const assignTask = (params: any, decision: Decision) => {
    console.log('Task assigned:', params);
    // Implementation would assign task to user or system
  };

  const updateUserStatus = (params: any, decision: Decision) => {
    console.log('Status updated:', params);
    // Implementation would update user status or preferences
  };

  const triggerWorkflow = (params: any, decision: Decision) => {
    console.log('Workflow triggered:', params);
    // Implementation would trigger a workflow or automation
  };

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const deleteRule = (ruleId: string) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      setRules(prev => prev.filter(rule => rule.id !== ruleId));
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'text-red-600 bg-red-100';
      case 2: return 'text-orange-600 bg-orange-100';
      case 3: return 'text-yellow-600 bg-yellow-100';
      case 4: return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Automated Decision Making</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSystemActive(!isSystemActive)}
            className={`flex items-center space-x-2 px-3 py-1 text-sm rounded-full transition-colors ${
              isSystemActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}
          >
            {isSystemActive ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
            <span>System: {isSystemActive ? 'Active' : 'Paused'}</span>
          </button>
          <button
            onClick={() => setShowRuleEditor(true)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            <Settings className="h-3 w-3 inline mr-1" />
            Manage Rules
          </button>
        </div>
      </div>

      {/* User Context */}
      {userContext && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current User Context</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Role:</span>
                <span className="text-sm font-medium text-gray-900">{userContext.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Session Duration:</span>
                <span className="text-sm font-medium text-gray-900">
                  {Math.round(userContext.sessionDuration / 60000)}m
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Interactions:</span>
                <span className="text-sm font-medium text-gray-900">{userContext.interactionCount}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Current Page:</span>
                <span className="text-sm font-medium text-gray-900">{userContext.currentPage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Recent Actions:</span>
                <span className="text-sm font-medium text-gray-900">
                  {userContext.recentActions.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Milestones:</span>
                <span className="text-sm font-medium text-gray-900">
                  {userContext.milestones.length}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Recent Milestones:</div>
              <div className="space-y-1">
                {userContext.milestones.slice(-3).map((milestone, index) => (
                  <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {milestone}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Decision Rules */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Decision Rules</h3>
            <span className="text-sm text-gray-500">{rules.filter(r => r.enabled).length} active</span>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {rules.map((rule) => (
              <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">{rule.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(rule.priority)}`}>
                        P{rule.priority}
                      </span>
                      {rule.enabled ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{rule.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Triggers: {rule.triggers}</span>
                      {rule.lastTriggered && (
                        <span>Last: {rule.lastTriggered.toLocaleTimeString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        rule.enabled 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {rule.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  <div className="mb-1">
                    <strong>Conditions:</strong> {rule.conditions.length} rules
                  </div>
                  <div>
                    <strong>Actions:</strong> {rule.actions.map(a => a.type).join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Decisions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Decisions</h3>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {decisions.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No decisions made yet</p>
                <p className="text-sm text-gray-400">The system will make decisions based on user behavior</p>
              </div>
            ) : (
              decisions.map((decision) => (
                <div key={decision.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{decision.ruleName}</h4>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {Math.round(decision.confidence * 100)}% confidence
                        </span>
                        {decision.executed ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Zap className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{decision.decision}</p>
                      {decision.result && (
                        <p className="text-xs text-green-600">{decision.result}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {decision.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Context: {decision.context.role} • {decision.context.currentPage} • 
                    {decision.context.interactionCount} interactions
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* System Statistics */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{rules.length}</div>
            <div className="text-sm text-gray-600">Total Rules</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{rules.filter(r => r.enabled).length}</div>
            <div className="text-sm text-gray-600">Active Rules</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{decisions.length}</div>
            <div className="text-sm text-gray-600">Decisions Made</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {decisions.filter(d => d.executed).length}
            </div>
            <div className="text-sm text-gray-600">Actions Executed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomatedDecisionMaking;