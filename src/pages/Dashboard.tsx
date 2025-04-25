
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DocumentUpload } from '@/components/DocumentUpload';
import { SignaturesTab } from '@/components/SignaturesTab';
import { ChatInterface } from '@/components/ChatInterface';
import { SecurityTab } from '@/components/SecurityTab';
import { useResponsive } from '@/hooks/use-responsive';
import { FileText, MessageSquare, Pencil, Shield, User, LogOut, Menu, X } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('documents');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isMdAndUp } = useResponsive();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-secondary-100 flex overflow-x-hidden">
      {/* Sidebar - Desktop */}
      <aside 
        className={`fixed md:relative z-30 md:z-auto h-full transition-all duration-300 ease-in-out transform 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        w-72 bg-[#1E293B] text-white md:flex flex-col shadow-lg`}
      >
        <div className="p-4 border-b border-secondary-600">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M10 13.5V10h-7v3.5a1.5 1.5 0 0 0 3 0V12a1 1 0 0 1 2 0v1.5a1.5 1.5 0 0 0 3 0Z" />
                <path d="M10 13.5V10h7v3.5a1.5 1.5 0 0 1-3 0V12a1 1 0 0 0-2 0v1.5a1.5 1.5 0 0 1-3 0Z" />
                <path d="M21 19H3" />
                <path d="M12 2v6" />
              </svg>
            </div>
            <span className="text-white font-display font-bold text-xl">SignThatDoc</span>
            
            {/* Close button for mobile */}
            <button 
              onClick={toggleSidebar}
              className="ml-auto text-white md:hidden"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <nav className="py-6 flex-1 overflow-y-auto">
          <div className="px-3 mb-4">
            <p className="text-xs uppercase text-gray-400 font-medium tracking-wider px-3 mb-2">Document Tools</p>
          </div>
          
          <button
            className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors ${
              activeTab === 'documents'
                ? 'bg-secondary-600 text-white border-l-2 border-primary'
                : 'text-gray-300 hover:bg-secondary-700'
            }`}
            onClick={() => {
              setActiveTab('documents');
              if (!isMdAndUp) setSidebarOpen(false);
            }}
          >
            <FileText className="h-5 w-5" />
            <span>Documents</span>
          </button>
          
          <button
            className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors ${
              activeTab === 'signatures'
                ? 'bg-secondary-600 text-white border-l-2 border-primary'
                : 'text-gray-300 hover:bg-secondary-700'
            }`}
            onClick={() => {
              setActiveTab('signatures');
              if (!isMdAndUp) setSidebarOpen(false);
            }}
          >
            <Pencil className="h-5 w-5" />
            <span>Signatures</span>
          </button>
          
          <div className="px-3 my-4">
            <p className="text-xs uppercase text-gray-400 font-medium tracking-wider px-3 mb-2">AI & Security</p>
          </div>
          
          <button
            className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors ${
              activeTab === 'assistant'
                ? 'bg-secondary-600 text-white border-l-2 border-primary'
                : 'text-gray-300 hover:bg-secondary-700'
            }`}
            onClick={() => {
              setActiveTab('assistant');
              if (!isMdAndUp) setSidebarOpen(false);
            }}
          >
            <MessageSquare className="h-5 w-5" />
            <span>AI Assistant</span>
          </button>
          
          <button
            className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors ${
              activeTab === 'security'
                ? 'bg-secondary-600 text-white border-l-2 border-primary'
                : 'text-gray-300 hover:bg-secondary-700'
            }`}
            onClick={() => {
              setActiveTab('security');
              if (!isMdAndUp) setSidebarOpen(false);
            }}
          >
            <Shield className="h-5 w-5" />
            <span>Security Keys</span>
          </button>
        </nav>
        
        <div className="border-t border-secondary-600 mt-auto">
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-secondary-700 flex items-center justify-center">
                <User className="h-5 w-5 text-gray-300" />
              </div>
              <div>
                <div className="font-medium text-white">John Doe</div>
                <div className="text-sm text-gray-400">john@example.com</div>
              </div>
            </div>
            <Button variant="outline" className="w-full flex items-center justify-center bg-transparent border-gray-600 text-gray-300 hover:bg-secondary-700 hover:text-white">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="bg-[#1E293B] text-white p-4 flex items-center justify-between shadow-md">
          {/* Menu button for mobile */}
          <button 
            onClick={toggleSidebar} 
            className="text-white md:hidden"
          >
            <Menu size={24} />
          </button>
          
          <div className="ml-4 md:ml-0">
            <h1 className="text-lg font-bold">
              {activeTab === 'documents' && 'Documents'}
              {activeTab === 'signatures' && 'Signatures'}
              {activeTab === 'assistant' && 'AI Assistant'}
              {activeTab === 'security' && 'Security Keys'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-secondary-700 flex items-center justify-center md:hidden">
              <User className="h-4 w-4 text-gray-300" />
            </div>
          </div>
        </div>
        
        {/* Content area */}
        <div className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold mb-1">My Documents</h2>
                    <p className="text-tertiary text-sm">Upload and manage your documents</p>
                  </div>
                  <Button>Upload Document</Button>
                </div>
                <div className="bg-white rounded-lg overflow-hidden border shadow-sm">
                  <div className="p-1 bg-secondary-100 border-b">
                    <div className="flex space-x-1 px-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <div className="p-6">
                    <DocumentUpload />
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'signatures' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Signature Manager</h2>
                  <p className="text-tertiary text-sm">Create and manage your digital signatures</p>
                </div>
                <div className="bg-white rounded-lg overflow-hidden border shadow-sm">
                  <div className="p-1 bg-secondary-100 border-b">
                    <div className="flex space-x-1 px-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <SignaturesTab />
                </div>
              </div>
            )}
            
            {activeTab === 'assistant' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">AI Document Assistant</h2>
                  <p className="text-tertiary text-sm">Get intelligent insights about your documents</p>
                </div>
                <div className="bg-white rounded-lg overflow-hidden border shadow-sm">
                  <div className="p-1 bg-secondary-100 border-b">
                    <div className="flex space-x-1 px-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <ChatInterface />
                </div>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Cryptographic Security</h2>
                  <p className="text-tertiary text-sm">Quantum-resistant key management</p>
                </div>
                <div className="bg-white rounded-lg overflow-hidden border shadow-sm">
                  <div className="p-1 bg-secondary-100 border-b">
                    <div className="flex space-x-1 px-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <SecurityTab />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
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
