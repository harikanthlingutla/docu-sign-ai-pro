
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DocumentUpload } from '@/components/DocumentUpload';
import { SignaturesTab } from '@/components/SignaturesTab';
import { SecurityTab } from '@/components/SecurityTab';
import { ProfileTab } from '@/components/ProfileTab';
import { useResponsive } from '@/hooks/use-responsive';
import { FileText, Pencil, Shield, User, LogOut, Menu, X, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('documents');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isMdAndUp } = useResponsive();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Professional Sidebar */}
      <aside 
        className={`fixed md:relative z-30 md:z-auto h-full transition-all duration-300 ease-in-out transform 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        w-72 bg-white border-r border-slate-200 md:flex flex-col shadow-xl`}
      >
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">SignThatDoc</h1>
              <p className="text-sm text-slate-500">Professional Edition</p>
            </div>
            
            <button 
              onClick={toggleSidebar}
              className="ml-auto text-slate-400 hover:text-slate-600 md:hidden"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <nav className="py-6 flex-1 overflow-y-auto">
          <div className="px-6 mb-6">
            <p className="text-xs uppercase text-slate-400 font-semibold tracking-wider mb-4">Workspace</p>
          </div>
          
          <button
            className={`w-full flex items-center space-x-4 px-6 py-3 text-left transition-all duration-200 ${
              activeTab === 'documents'
                ? 'bg-primary/10 text-primary border-l-4 border-primary font-medium'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            onClick={() => {
              setActiveTab('documents');
              if (!isMdAndUp) setSidebarOpen(false);
            }}
          >
            <div className={`p-2 rounded-lg ${
              activeTab === 'documents' ? 'bg-primary/20' : 'bg-slate-100'
            }`}>
              <FileText className="h-5 w-5" />
            </div>
            <span>Documents</span>
          </button>
          
          <button
            className={`w-full flex items-center space-x-4 px-6 py-3 text-left transition-all duration-200 ${
              activeTab === 'signatures'
                ? 'bg-primary/10 text-primary border-l-4 border-primary font-medium'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            onClick={() => {
              setActiveTab('signatures');
              if (!isMdAndUp) setSidebarOpen(false);
            }}
          >
            <div className={`p-2 rounded-lg ${
              activeTab === 'signatures' ? 'bg-primary/20' : 'bg-slate-100'
            }`}>
              <Pencil className="h-5 w-5" />
            </div>
            <span>Signatures</span>
          </button>
          
          <div className="px-6 my-6">
            <p className="text-xs uppercase text-slate-400 font-semibold tracking-wider mb-4">Security & Settings</p>
          </div>
          
          <button
            className={`w-full flex items-center space-x-4 px-6 py-3 text-left transition-all duration-200 ${
              activeTab === 'security'
                ? 'bg-primary/10 text-primary border-l-4 border-primary font-medium'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            onClick={() => {
              setActiveTab('security');
              if (!isMdAndUp) setSidebarOpen(false);
            }}
          >
            <div className={`p-2 rounded-lg ${
              activeTab === 'security' ? 'bg-primary/20' : 'bg-slate-100'
            }`}>
              <Shield className="h-5 w-5" />
            </div>
            <span>Security Keys</span>
          </button>
          
          <button
            className={`w-full flex items-center space-x-4 px-6 py-3 text-left transition-all duration-200 ${
              activeTab === 'profile'
                ? 'bg-primary/10 text-primary border-l-4 border-primary font-medium'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            onClick={() => {
              setActiveTab('profile');
              if (!isMdAndUp) setSidebarOpen(false);
            }}
          >
            <div className={`p-2 rounded-lg ${
              activeTab === 'profile' ? 'bg-primary/20' : 'bg-slate-100'
            }`}>
              <User className="h-5 w-5" />
            </div>
            <span>Profile</span>
          </button>
        </nav>
        
        <div className="border-t border-slate-200 mt-auto">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">John Doe</div>
                <div className="text-sm text-slate-500">john@example.com</div>
              </div>
            </div>
            <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col w-full">
        {/* Professional Header */}
        <div className="bg-white border-b border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleSidebar} 
                className="text-slate-600 hover:text-slate-900 md:hidden"
              >
                <Menu size={24} />
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {activeTab === 'documents' && 'Document Management'}
                  {activeTab === 'signatures' && 'Signature Center'}
                  {activeTab === 'security' && 'Security Center'}
                  {activeTab === 'profile' && 'Account Settings'}
                </h1>
                <p className="text-slate-600 mt-1">
                  {activeTab === 'documents' && 'Upload, manage, and edit your professional documents'}
                  {activeTab === 'signatures' && 'Create and manage your digital signatures'}
                  {activeTab === 'security' && 'Quantum-resistant security management'}
                  {activeTab === 'profile' && 'Manage your account and preferences'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center md:hidden">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-8 overflow-x-hidden">
          <div className="max-w-6xl mx-auto w-full">
            {activeTab === 'documents' && <DocumentUpload />}
            {activeTab === 'signatures' && (
              <Card className="professional-card p-0">
                <SignaturesTab />
              </Card>
            )}
            {activeTab === 'security' && (
              <Card className="professional-card p-0">
                <SecurityTab />
              </Card>
            )}
            {activeTab === 'profile' && <ProfileTab />}
          </div>
        </div>
      </div>
      
      {sidebarOpen && !isMdAndUp && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;
