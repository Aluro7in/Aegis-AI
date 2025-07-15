export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Reviewer' | 'End-User';
  avatar?: string;
  lastLogin?: Date;
  permissions: string[];
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  roles: string[];
  conditions: string[];
  action: 'block' | 'flag' | 'allow';
  severity: 'low' | 'medium' | 'high';
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  details: any;
  ip?: string;
  userAgent?: string;
  risk: 'low' | 'medium' | 'high';
}

export interface AgentResult {
  agent: string;
  result: 'pass' | 'flag' | 'block';
  reason: string;
  confidence: number;
  processingTime: number;
  metadata?: any;
}

export interface GovernanceDecision {
  id: string;
  prompt: string;
  userId: string;
  timestamp: Date;
  agentResults: AgentResult[];
  finalDecision: 'allow' | 'block' | 'flag';
  response?: string;
  feedback?: number;
  processingTime: number;
}

export interface SystemMetrics {
  totalRequests: number;
  blockedRequests: number;
  flaggedRequests: number;
  allowedRequests: number;
  averageProcessingTime: number;
  userSatisfaction: number;
  activeUsers: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

export interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  status: 'compliant' | 'partial' | 'non-compliant';
  lastAssessed: Date;
}

export interface UseCase {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  status: 'active' | 'beta' | 'coming-soon';
  features: string[];
  path: string;
}

export interface CallInsight {
  id: string;
  timestamp: Date;
  duration: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  satisfaction: number;
  transcript: string;
  summary: string;
  actionItems: string[];
  coachingTips: string[];
}

export interface ImageGeneration {
  id: string;
  prompt: string;
  style: string;
  resolution: string;
  timestamp: Date;
  imageUrl?: string;
  status: 'generating' | 'completed' | 'failed';
  parameters: {
    guidance: number;
    steps: number;
    seed?: number;
    negativePrompt?: string;
  };
}

export interface SupplyChainData {
  id: string;
  product: string;
  currentStock: number;
  forecastedDemand: number;
  reorderPoint: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  timestamp: Date;
}

export interface SyntheticDataConfig {
  domain: 'healthcare' | 'finance' | 'retail' | 'general';
  privacyLevel: 'low' | 'medium' | 'high';
  rowCount: number;
  columns: {
    name: string;
    type: string;
    nullable: boolean;
    unique: boolean;
  }[];
  preserveRelationships: boolean;
}