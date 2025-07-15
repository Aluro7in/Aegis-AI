import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, Package, Truck, DollarSign, BarChart3 } from 'lucide-react';
import { SupplyChainData } from '../../types';

interface SupplyChainProps {
  onBack: () => void;
}

const SupplyChain: React.FC<SupplyChainProps> = ({ onBack }) => {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [supplyChainData, setSupplyChainData] = useState<SupplyChainData[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);

  const sampleData: SupplyChainData[] = [
    {
      id: '1',
      product: 'Wireless Headphones',
      currentStock: 150,
      forecastedDemand: 300,
      reorderPoint: 100,
      riskLevel: 'high',
      recommendations: [
        'Increase order quantity by 50%',
        'Diversify suppliers to reduce risk',
        'Consider promotional pricing to boost demand'
      ],
      timestamp: new Date()
    },
    {
      id: '2',
      product: 'Smart Watch',
      currentStock: 450,
      forecastedDemand: 400,
      reorderPoint: 200,
      riskLevel: 'low',
      recommendations: [
        'Maintain current inventory levels',
        'Monitor seasonal trends',
        'Optimize storage costs'
      ],
      timestamp: new Date()
    },
    {
      id: '3',
      product: 'Bluetooth Speaker',
      currentStock: 75,
      forecastedDemand: 200,
      reorderPoint: 80,
      riskLevel: 'medium',
      recommendations: [
        'Reorder now to avoid stockout',
        'Review lead time with supplier',
        'Consider safety stock increase'
      ],
      timestamp: new Date()
    },
    {
      id: '4',
      product: 'Phone Case',
      currentStock: 800,
      forecastedDemand: 600,
      reorderPoint: 300,
      riskLevel: 'low',
      recommendations: [
        'Reduce order frequency',
        'Optimize inventory turnover',
        'Consider bundle opportunities'
      ],
      timestamp: new Date()
    }
  ];

  const forecastData = [
    { month: 'Jan', demand: 420, supply: 400 },
    { month: 'Feb', demand: 380, supply: 450 },
    { month: 'Mar', demand: 520, supply: 480 },
    { month: 'Apr', demand: 600, supply: 580 },
    { month: 'May', demand: 680, supply: 650 },
    { month: 'Jun', demand: 720, supply: 700 }
  ];

  useEffect(() => {
    setSupplyChainData(sampleData);
    setPredictions(forecastData);
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStockStatus = (current: number, reorderPoint: number) => {
    if (current <= reorderPoint) return 'critical';
    if (current <= reorderPoint * 1.5) return 'warning';
    return 'healthy';
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'healthy': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const totalProducts = supplyChainData.length;
  const criticalStock = supplyChainData.filter(item => 
    getStockStatus(item.currentStock, item.reorderPoint) === 'critical'
  ).length;
  const highRiskItems = supplyChainData.filter(item => item.riskLevel === 'high').length;
  const averageStock = Math.round(
    supplyChainData.reduce((sum, item) => sum + item.currentStock, 0) / totalProducts
  );

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
          <h1 className="text-3xl font-bold text-gray-900">Supply Chain Optimization</h1>
          <p className="mt-2 text-gray-600">AI-powered demand forecasting and inventory optimization</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Stock</p>
                <p className="text-2xl font-bold text-red-600">{criticalStock}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk Items</p>
                <p className="text-2xl font-bold text-yellow-600">{highRiskItems}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Stock Level</p>
                <p className="text-2xl font-bold text-green-600">{averageStock}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inventory Overview */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Overview</h3>
            <div className="space-y-4">
              {supplyChainData.map((item) => {
                const stockStatus = getStockStatus(item.currentStock, item.reorderPoint);
                return (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{item.product}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(item.riskLevel)}`}>
                          {item.riskLevel} risk
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStockStatusColor(stockStatus)}`}>
                          {stockStatus}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Current Stock</p>
                        <p className="text-lg font-semibold text-gray-900">{item.currentStock}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Forecasted Demand</p>
                        <p className="text-lg font-semibold text-gray-900">{item.forecastedDemand}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Reorder Point</p>
                        <p className="text-lg font-semibold text-gray-900">{item.reorderPoint}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Stock Level</span>
                        <span>{Math.round((item.currentStock / item.forecastedDemand) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            stockStatus === 'critical' ? 'bg-red-500' :
                            stockStatus === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min((item.currentStock / item.forecastedDemand) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">AI Recommendations:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {item.recommendations.slice(0, 2).map((rec, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Demand Forecasting */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Demand Forecasting (TimeLLM)</h3>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Forecast Accuracy</span>
                <span className="text-sm font-medium text-green-600">94.2%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="w-11/12 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>

            <div className="space-y-4">
              {predictions.map((prediction, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">{prediction.month}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Demand: {prediction.demand}</p>
                      <p className="text-xs text-gray-500">Supply: {prediction.supply}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {prediction.demand > prediction.supply ? (
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-500" />
                    )}
                    <span className={`text-xs font-medium ${
                      prediction.demand > prediction.supply ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {prediction.demand > prediction.supply ? 'Shortage' : 'Surplus'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Market Trends</span>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Q2 demand expected to increase 15%</li>
                <li>• Seasonal peak in May-June</li>
                <li>• New product launches impacting demand</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Assessment & Mitigation</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-red-800">High Risk</span>
              </div>
              <ul className="text-sm text-red-700 space-y-2">
                <li>• Supplier concentration risk</li>
                <li>• Lead time variability</li>
                <li>• Demand volatility</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Medium Risk</span>
              </div>
              <ul className="text-sm text-yellow-700 space-y-2">
                <li>• Seasonal demand patterns</li>
                <li>• Economic indicators</li>
                <li>• Competitive pressure</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Package className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Low Risk</span>
              </div>
              <ul className="text-sm text-green-700 space-y-2">
                <li>• Stable supplier relationships</li>
                <li>• Consistent demand patterns</li>
                <li>• Adequate safety stock</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyChain;