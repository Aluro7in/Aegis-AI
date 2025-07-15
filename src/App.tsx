import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GovernanceProvider } from './contexts/GovernanceContext';
import LoginForm from './components/auth/LoginForm';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import AIChat from './components/chat/AIChat';
import UseCasesHub from './components/use-cases/UseCasesHub';
import PolicyManagement from './components/policies/PolicyManagement';
import AuditLogs from './components/audit/AuditLogs';
import AIAgentsHub from './components/ai-agents/AIAgentsHub';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'chat':
        return <AIChat />;
      case 'use-cases':
        return <UseCasesHub />;
      case 'policies':
        return <PolicyManagement />;
      case 'audit':
        return <AuditLogs />;
      case 'ai-agents':
        return <AIAgentsHub />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />
      <main>
        {renderPage()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <GovernanceProvider>
        <AppContent />
      </GovernanceProvider>
    </AuthProvider>
  );
};

export default App;