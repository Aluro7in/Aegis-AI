import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Policy, AuditLog, GovernanceDecision, SystemMetrics, ComplianceFramework } from '../types';

interface GovernanceContextType {
  policies: Policy[];
  auditLogs: AuditLog[];
  decisions: GovernanceDecision[];
  metrics: SystemMetrics;
  compliance: ComplianceFramework[];
  addPolicy: (policy: Omit<Policy, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePolicy: (id: string, updates: Partial<Policy>) => void;
  deletePolicy: (id: string) => void;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  processPrompt: (prompt: string, userId: string) => Promise<GovernanceDecision>;
  updateMetrics: () => void;
}

const GovernanceContext = createContext<GovernanceContextType | undefined>(undefined);

const defaultPolicies: Policy[] = [
  {
    id: 'pii-protection',
    name: 'PII Protection',
    description: 'Blocks prompts containing personally identifiable information',
    roles: ['Admin', 'Reviewer', 'End-User'],
    conditions: ['contains_email', 'contains_phone', 'contains_ssn'],
    action: 'block',
    severity: 'high',
    enabled: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'harmful-content',
    name: 'Harmful Content Filter',
    description: 'Flags violent, hateful, or inappropriate content',
    roles: ['Admin', 'Reviewer', 'End-User'],
    conditions: ['contains_violence', 'contains_hate', 'contains_adult'],
    action: 'flag',
    severity: 'high',
    enabled: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'gdpr-compliance',
    name: 'GDPR Compliance',
    description: 'Ensures compliance with GDPR data protection requirements',
    roles: ['Admin', 'Reviewer', 'End-User'],
    conditions: ['eu_data_subject', 'personal_data_processing'],
    action: 'flag',
    severity: 'medium',
    enabled: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'bias-prevention',
    name: 'Bias Prevention',
    description: 'Detects and mitigates potential bias in responses',
    roles: ['Admin', 'Reviewer', 'End-User'],
    conditions: ['gender_bias', 'racial_bias', 'age_bias'],
    action: 'flag',
    severity: 'medium',
    enabled: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

const defaultCompliance: ComplianceFramework[] = [
  {
    id: 'fisma',
    name: 'FISMA Security Controls',
    description: 'Federal Information Security Management Act compliance',
    requirements: ['Access Control', 'Audit Logging', 'Risk Assessment'],
    status: 'compliant',
    lastAssessed: new Date()
  },
  {
    id: 'gdpr',
    name: 'GDPR Data Sensitivity',
    description: 'General Data Protection Regulation compliance',
    requirements: ['Data Minimization', 'Right to Erasure', 'Privacy by Design'],
    status: 'compliant',
    lastAssessed: new Date()
  },
  {
    id: 'eu-ai-act',
    name: 'EU AI Act Risk Categories',
    description: 'European Union Artificial Intelligence Act compliance',
    requirements: ['Risk Assessment', 'Transparency', 'Human Oversight'],
    status: 'partial',
    lastAssessed: new Date()
  }
];

export const GovernanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [decisions, setDecisions] = useState<GovernanceDecision[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalRequests: 0,
    blockedRequests: 0,
    flaggedRequests: 0,
    allowedRequests: 0,
    averageProcessingTime: 0,
    userSatisfaction: 4.2,
    activeUsers: 0,
    systemHealth: 'healthy'
  });
  const [compliance] = useState<ComplianceFramework[]>(defaultCompliance);

  useEffect(() => {
    const savedPolicies = localStorage.getItem('aegis-policies');
    const savedAuditLogs = localStorage.getItem('aegis-audit-logs');
    const savedDecisions = localStorage.getItem('aegis-decisions');
    const savedMetrics = localStorage.getItem('aegis-metrics');

    setPolicies(savedPolicies ? JSON.parse(savedPolicies) : defaultPolicies);
    setAuditLogs(savedAuditLogs ? JSON.parse(savedAuditLogs) : []);
    setDecisions(savedDecisions ? JSON.parse(savedDecisions) : []);
    setMetrics(savedMetrics ? JSON.parse(savedMetrics) : metrics);
  }, []);

  useEffect(() => {
    localStorage.setItem('aegis-policies', JSON.stringify(policies));
  }, [policies]);

  useEffect(() => {
    localStorage.setItem('aegis-audit-logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('aegis-decisions', JSON.stringify(decisions));
  }, [decisions]);

  useEffect(() => {
    localStorage.setItem('aegis-metrics', JSON.stringify(metrics));
  }, [metrics]);

  const addPolicy = (policy: Omit<Policy, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPolicy: Policy = {
      ...policy,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setPolicies([...policies, newPolicy]);
  };

  const updatePolicy = (id: string, updates: Partial<Policy>) => {
    setPolicies(policies.map(policy => 
      policy.id === id ? { ...policy, ...updates, updatedAt: new Date() } : policy
    ));
  };

  const deletePolicy = (id: string) => {
    setPolicies(policies.filter(policy => policy.id !== id));
  };

  const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const processPrompt = async (prompt: string, userId: string): Promise<GovernanceDecision> => {
    const startTime = Date.now();
    
    // Simulate multi-agent processing
    const agentResults = await Promise.all([
      simulateAgent('Prompt Guard', prompt),
      simulateAgent('Policy Enforcer', prompt),
      simulateAgent('Content Analyzer', prompt),
      simulateAgent('Bias Detector', prompt),
      simulateAgent('Risk Assessor', prompt)
    ]);

    const processingTime = Date.now() - startTime;
    
    // Determine final decision
    const hasBlock = agentResults.some(r => r.result === 'block');
    const hasFlag = agentResults.some(r => r.result === 'flag');
    const finalDecision = hasBlock ? 'block' : hasFlag ? 'flag' : 'allow';

    const decision: GovernanceDecision = {
      id: Math.random().toString(36).substr(2, 9),
      prompt,
      userId,
      timestamp: new Date(),
      agentResults,
      finalDecision,
      response: finalDecision === 'allow' ? generateAIResponse(prompt) : undefined,
      processingTime
    };

    setDecisions([decision, ...decisions]);
    updateMetrics();

    return decision;
  };

  const simulateAgent = async (agent: string, prompt: string): Promise<any> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 50));
    
    const lowerPrompt = prompt.toLowerCase();
    let result = 'pass';
    let reason = 'No issues detected';
    let confidence = 0.8 + Math.random() * 0.2;

    // Basic detection logic
    if (lowerPrompt.includes('@') || lowerPrompt.includes('phone') || lowerPrompt.includes('ssn')) {
      result = 'block';
      reason = 'PII detected';
      confidence = 0.95;
    } else if (lowerPrompt.includes('hate') || lowerPrompt.includes('violence') || lowerPrompt.includes('kill')) {
      result = 'flag';
      reason = 'Potentially harmful content';
      confidence = 0.85;
    } else if (agent === 'Bias Detector' && (lowerPrompt.includes('men') || lowerPrompt.includes('women'))) {
      result = 'flag';
      reason = 'Potential gender bias';
      confidence = 0.7;
    }

    return {
      agent,
      result,
      reason,
      confidence,
      processingTime: Math.random() * 200 + 50
    };
  };

  const generateAIResponse = (prompt: string): string => {
    // Simple response generation
    const responses = [
      "I understand your request. Based on the governance policies in place, I can provide the following information...",
      "Thank you for your question. After reviewing the content against our policies, here's what I can share...",
      "I've analyzed your prompt and can provide a helpful response while maintaining compliance with our governance framework...",
      "Your question has been processed through our multi-agent system. Here's a compliant response..."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] + 
           " This response has been generated in accordance with enterprise governance policies and has been approved by our AI safety framework.";
  };

  const updateMetrics = () => {
    const total = decisions.length;
    const blocked = decisions.filter(d => d.finalDecision === 'block').length;
    const flagged = decisions.filter(d => d.finalDecision === 'flag').length;
    const allowed = decisions.filter(d => d.finalDecision === 'allow').length;
    const avgProcessingTime = decisions.length > 0 ? 
      decisions.reduce((sum, d) => sum + d.processingTime, 0) / decisions.length : 0;

    setMetrics({
      totalRequests: total,
      blockedRequests: blocked,
      flaggedRequests: flagged,
      allowedRequests: allowed,
      averageProcessingTime: avgProcessingTime,
      userSatisfaction: 4.2,
      activeUsers: 156,
      systemHealth: 'healthy'
    });
  };

  return (
    <GovernanceContext.Provider value={{
      policies,
      auditLogs,
      decisions,
      metrics,
      compliance,
      addPolicy,
      updatePolicy,
      deletePolicy,
      addAuditLog,
      processPrompt,
      updateMetrics
    }}>
      {children}
    </GovernanceContext.Provider>
  );
};

export const useGovernance = () => {
  const context = useContext(GovernanceContext);
  if (context === undefined) {
    throw new Error('useGovernance must be used within a GovernanceProvider');
  }
  return context;
};