import React from 'react';
import { Shield, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const { user, logout, switchRole } = useAuth();

  const handleRoleSwitch = (role: 'Admin' | 'Reviewer' | 'End-User') => {
    switchRole(role);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">AegisAI</span>
            <span className="ml-2 text-sm text-gray-500">Enterprise GenAI Governance</span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'dashboard' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('chat')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'chat' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              AI Chat
            </button>
            <button
              onClick={() => onNavigate('use-cases')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'use-cases' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Use Cases
            </button>
            <button
              onClick={() => onNavigate('ai-agents')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'ai-agents' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              AI Agents
            </button>
            {user?.role === 'Admin' && (
              <button
                onClick={() => onNavigate('policies')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'policies' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Policies
              </button>
            )}
            {(user?.role === 'Admin' || user?.role === 'Reviewer') && (
              <button
                onClick={() => onNavigate('audit')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'audit' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Audit
              </button>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {user?.role}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                    Switch Role
                  </div>
                  <button
                    onClick={() => handleRoleSwitch('Admin')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin</span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('Reviewer')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Reviewer</span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('End-User')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>End-User</span>
                  </button>
                  <div className="border-t border-gray-100">
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;