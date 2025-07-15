import React, { useState } from 'react';
import { Plus, Edit, Trash2, Shield, AlertTriangle, CheckCircle, Settings } from 'lucide-react';
import { useGovernance } from '../../contexts/GovernanceContext';
import { Policy } from '../../types';

const PolicyManagement: React.FC = () => {
  const { policies, addPolicy, updatePolicy, deletePolicy } = useGovernance();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    roles: [] as string[],
    conditions: [] as string[],
    action: 'flag' as 'block' | 'flag' | 'allow',
    severity: 'medium' as 'low' | 'medium' | 'high',
    enabled: true
  });

  const availableRoles = ['Admin', 'Reviewer', 'End-User'];
  const availableConditions = [
    'contains_email', 'contains_phone', 'contains_ssn', 'contains_violence',
    'contains_hate', 'contains_adult', 'eu_data_subject', 'personal_data_processing',
    'gender_bias', 'racial_bias', 'age_bias'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPolicy) {
      updatePolicy(editingPolicy.id, formData);
      setEditingPolicy(null);
    } else {
      addPolicy(formData);
    }
    
    setIsCreateModalOpen(false);
    setFormData({
      name: '',
      description: '',
      roles: [],
      conditions: [],
      action: 'flag',
      severity: 'medium',
      enabled: true
    });
  };

  const handleEdit = (policy: Policy) => {
    setEditingPolicy(policy);
    setFormData({
      name: policy.name,
      description: policy.description,
      roles: policy.roles,
      conditions: policy.conditions,
      action: policy.action,
      severity: policy.severity,
      enabled: policy.enabled
    });
    setIsCreateModalOpen(true);
  };

  const handleDelete = (policyId: string) => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      deletePolicy(policyId);
    }
  };

  const handleRoleToggle = (role: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const handleConditionToggle = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition]
    }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'block': return 'text-red-600 bg-red-100';
      case 'flag': return 'text-yellow-600 bg-yellow-100';
      case 'allow': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Policy Management</h1>
              <p className="mt-2 text-gray-600">Configure and manage governance policies</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Create Policy</span>
            </button>
          </div>
        </div>

        {/* Policy List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Active Policies</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {policies.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No policies configured</p>
                <p className="text-sm text-gray-400">Create your first policy to get started</p>
              </div>
            ) : (
              policies.map((policy) => (
                <div key={policy.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{policy.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(policy.severity)}`}>
                          {policy.severity}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getActionColor(policy.action)}`}>
                          {policy.action}
                        </span>
                        {policy.enabled ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{policy.description}</p>
                      
                      <div className="flex flex-wrap gap-4 mb-3">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Roles:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {policy.roles.map((role, index) => (
                              <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-sm font-medium text-gray-700">Conditions:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {policy.conditions.map((condition, index) => (
                              <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {condition}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Created: {policy.createdAt.toLocaleDateString()}</span>
                        <span>Updated: {policy.updatedAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(policy)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(policy.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Create/Edit Policy Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingPolicy ? 'Edit Policy' : 'Create New Policy'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Policy Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Action
                    </label>
                    <select
                      value={formData.action}
                      onChange={(e) => setFormData({ ...formData, action: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="allow">Allow</option>
                      <option value="flag">Flag</option>
                      <option value="block">Block</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Severity
                    </label>
                    <select
                      value={formData.severity}
                      onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Applicable Roles
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableRoles.map((role) => (
                      <label key={role} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.roles.includes(role)}
                          onChange={() => handleRoleToggle(role)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{role}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conditions
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableConditions.map((condition) => (
                      <label key={condition} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.conditions.includes(condition)}
                          onChange={() => handleConditionToggle(condition)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{condition}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enabled"
                    checked={formData.enabled}
                    onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enabled" className="text-sm text-gray-700">
                    Enable this policy
                  </label>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setEditingPolicy(null);
                      setFormData({
                        name: '',
                        description: '',
                        roles: [],
                        conditions: [],
                        action: 'flag',
                        severity: 'medium',
                        enabled: true
                      });
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingPolicy ? 'Update Policy' : 'Create Policy'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyManagement;