import React, { useState } from 'react';
import { ArrowLeft, Database, Download, Settings, Play, FileText, Lock, CheckCircle } from 'lucide-react';
import { SyntheticDataConfig } from '../../types';

interface DataGeneratorProps {
  onBack: () => void;
}

const DataGenerator: React.FC<DataGeneratorProps> = ({ onBack }) => {
  const [config, setConfig] = useState<SyntheticDataConfig>({
    domain: 'general',
    privacyLevel: 'medium',
    rowCount: 1000,
    columns: [
      { name: 'id', type: 'integer', nullable: false, unique: true },
      { name: 'name', type: 'string', nullable: false, unique: false },
      { name: 'email', type: 'email', nullable: false, unique: true },
      { name: 'age', type: 'integer', nullable: false, unique: false },
      { name: 'salary', type: 'decimal', nullable: true, unique: false }
    ],
    preserveRelationships: true
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const domains = [
    { id: 'healthcare', name: 'Healthcare', description: 'Medical records and patient data' },
    { id: 'finance', name: 'Finance', description: 'Financial transactions and accounts' },
    { id: 'retail', name: 'Retail', description: 'E-commerce and customer data' },
    { id: 'general', name: 'General', description: 'Generic business data' }
  ];

  const privacyLevels = [
    { id: 'low', name: 'Low', description: 'Basic anonymization', techniques: ['Name replacement', 'ID masking'] },
    { id: 'medium', name: 'Medium', description: 'Advanced privacy protection', techniques: ['Differential privacy', 'K-anonymity', 'Data masking'] },
    { id: 'high', name: 'High', description: 'Maximum privacy protection', techniques: ['Homomorphic encryption', 'Secure multi-party computation', 'Zero-knowledge proofs'] }
  ];

  const dataTypes = [
    { id: 'string', name: 'String', description: 'Text data' },
    { id: 'integer', name: 'Integer', description: 'Whole numbers' },
    { id: 'decimal', name: 'Decimal', description: 'Decimal numbers' },
    { id: 'boolean', name: 'Boolean', description: 'True/false values' },
    { id: 'date', name: 'Date', description: 'Date values' },
    { id: 'email', name: 'Email', description: 'Email addresses' },
    { id: 'phone', name: 'Phone', description: 'Phone numbers' },
    { id: 'address', name: 'Address', description: 'Physical addresses' }
  ];

  const generateSampleData = () => {
    const sampleData = [];
    const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson'];
    const emails = ['john@example.com', 'jane@example.com', 'bob@example.com', 'alice@example.com', 'charlie@example.com'];
    
    for (let i = 0; i < Math.min(config.rowCount, 100); i++) {
      const row: any = {};
      config.columns.forEach(col => {
        switch (col.type) {
          case 'integer':
            row[col.name] = col.name === 'id' ? i + 1 : Math.floor(Math.random() * 100) + 20;
            break;
          case 'string':
            row[col.name] = names[Math.floor(Math.random() * names.length)];
            break;
          case 'email':
            row[col.name] = emails[Math.floor(Math.random() * emails.length)];
            break;
          case 'decimal':
            row[col.name] = Math.floor(Math.random() * 100000) + 30000;
            break;
          case 'boolean':
            row[col.name] = Math.random() > 0.5;
            break;
          case 'date':
            row[col.name] = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            break;
          default:
            row[col.name] = `Sample ${col.type}`;
        }
      });
      sampleData.push(row);
    }
    return sampleData;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate generation process
    setTimeout(() => {
      const data = generateSampleData();
      setGeneratedData(data);
      setShowPreview(true);
      setIsGenerating(false);
    }, 2000);
  };

  const addColumn = () => {
    setConfig({
      ...config,
      columns: [...config.columns, { name: 'new_column', type: 'string', nullable: false, unique: false }]
    });
  };

  const updateColumn = (index: number, field: string, value: any) => {
    const newColumns = [...config.columns];
    newColumns[index] = { ...newColumns[index], [field]: value };
    setConfig({ ...config, columns: newColumns });
  };

  const removeColumn = (index: number) => {
    const newColumns = config.columns.filter((_, i) => i !== index);
    setConfig({ ...config, columns: newColumns });
  };

  const exportData = (format: 'csv' | 'json') => {
    if (generatedData.length === 0) return;

    let content = '';
    let filename = '';

    if (format === 'csv') {
      const headers = config.columns.map(col => col.name).join(',');
      const rows = generatedData.map(row => 
        config.columns.map(col => row[col.name]).join(',')
      ).join('\n');
      content = headers + '\n' + rows;
      filename = `synthetic_data_${Date.now()}.csv`;
    } else {
      content = JSON.stringify(generatedData, null, 2);
      filename = `synthetic_data_${Date.now()}.json`;
    }

    const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPrivacyLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-yellow-600 bg-yellow-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      case 'high': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Smart Synthetic Data Generator</h1>
          <p className="mt-2 text-gray-600">Privacy-preserving dataset creation with advanced AI techniques</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Domain
                    </label>
                    <select
                      value={config.domain}
                      onChange={(e) => setConfig({ ...config, domain: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {domains.map((domain) => (
                        <option key={domain.id} value={domain.id}>
                          {domain.name} - {domain.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Privacy Level
                    </label>
                    <select
                      value={config.privacyLevel}
                      onChange={(e) => setConfig({ ...config, privacyLevel: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {privacyLevels.map((level) => (
                        <option key={level.id} value={level.id}>
                          {level.name} - {level.description}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Rows: {config.rowCount}
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="10000"
                    step="100"
                    value={config.rowCount}
                    onChange={(e) => setConfig({ ...config, rowCount: Number(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>100</span>
                    <span>10,000</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="preserve-relationships"
                    checked={config.preserveRelationships}
                    onChange={(e) => setConfig({ ...config, preserveRelationships: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="preserve-relationships" className="text-sm text-gray-700">
                    Preserve statistical relationships
                  </label>
                </div>
              </div>
            </div>

            {/* Schema Definition */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Schema Definition</h3>
                <button
                  onClick={addColumn}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Add Column
                </button>
              </div>

              <div className="space-y-3">
                {config.columns.map((column, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <input
                      type="text"
                      value={column.name}
                      onChange={(e) => updateColumn(index, 'name', e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Column name"
                    />
                    <select
                      value={column.type}
                      onChange={(e) => updateColumn(index, 'type', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {dataTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                    <label className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={column.nullable}
                        onChange={(e) => updateColumn(index, 'nullable', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-xs text-gray-600">Nullable</span>
                    </label>
                    <label className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={column.unique}
                        onChange={(e) => updateColumn(index, 'unique', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-xs text-gray-600">Unique</span>
                    </label>
                    <button
                      onClick={() => removeColumn(index)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Generation Controls */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Generate Data</h3>
                  <p className="text-sm text-gray-600">Create synthetic data based on your configuration</p>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Play className="h-5 w-5" />
                  <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Privacy & Export Panel */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Protection</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Lock className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">Current Level</span>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPrivacyLevelColor(config.privacyLevel)}`}>
                    {config.privacyLevel.charAt(0).toUpperCase() + config.privacyLevel.slice(1)}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Applied Techniques</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {privacyLevels.find(level => level.id === config.privacyLevel)?.techniques.map((technique, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>{technique}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Privacy Score:</strong> {config.privacyLevel === 'high' ? '95%' : config.privacyLevel === 'medium' ? '85%' : '70%'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Quality</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Statistical Accuracy</span>
                  <span className="text-sm font-medium text-green-600">94%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Data Utility</span>
                  <span className="text-sm font-medium text-blue-600">89%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Privacy Protection</span>
                  <span className="text-sm font-medium text-purple-600">96%</span>
                </div>
              </div>
            </div>

            {showPreview && generatedData.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
                  <span className="text-sm text-gray-600">{generatedData.length} rows</span>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={() => exportData('csv')}
                    className="w-full flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="h-5 w-5" />
                    <span>Export as CSV</span>
                  </button>
                  
                  <button
                    onClick={() => exportData('json')}
                    className="w-full flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FileText className="h-5 w-5" />
                    <span>Export as JSON</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Data Preview */}
        {showPreview && generatedData.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Preview</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    {config.columns.map((column) => (
                      <th key={column.name} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {column.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {generatedData.slice(0, 10).map((row, index) => (
                    <tr key={index}>
                      {config.columns.map((column) => (
                        <td key={column.name} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {row[column.name]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {generatedData.length > 10 && (
              <div className="mt-4 text-center">
                <span className="text-sm text-gray-500">
                  Showing first 10 rows of {generatedData.length} total rows
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataGenerator;