import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AIAssistantPanel } from '@/components/dashboard/AIAssistantPanel';
import { UploadDropzone } from '@/components/dashboard/UploadDropzone';
import { StatCard } from '@/components/ui/stat-card';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { FileText, Clock, CheckCircle, Bot, Sparkles } from 'lucide-react';

export default function DashboardNew() {
  const [activeTab, setActiveTab] = useState('documents');
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  
  const stats = [
    { title: 'Documents Uploaded', value: '24', change: '+12%', icon: FileText, trend: 'up' as const },
    { title: 'Pending Signatures', value: '8', change: '-5%', icon: Clock, trend: 'down' as const },
    { title: 'Completed', value: '142', change: '+23%', icon: CheckCircle, trend: 'up' as const },
  ];

  const handleFileSelect = (files: File[]) => {
    console.log('Files selected:', files);
    // TODO: Handle file upload
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex">
      <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="glass-panel border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-1"
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Document Dashboard
              </h1>
              <p className="text-muted-foreground">Manage, sign, and analyze your documents with AI</p>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setAiPanelOpen(!aiPanelOpen)}
                className={`btn-gradient ${aiPanelOpen ? 'glow-primary' : ''}`}
              >
                <Bot className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <StatCard key={stat.title} {...stat} index={index} />
              ))}
            </div>

            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <UploadDropzone onFileSelect={handleFileSelect} />
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="btn-glass justify-start h-auto p-4">
                  <Sparkles className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Create Template</div>
                    <div className="text-sm text-muted-foreground">Design reusable forms</div>
                  </div>
                </Button>
                
                <Button className="btn-glass justify-start h-auto p-4">
                  <CheckCircle className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Bulk Sign</div>
                    <div className="text-sm text-muted-foreground">Sign multiple documents</div>
                  </div>
                </Button>
                
                <Button className="btn-glass justify-start h-auto p-4">
                  <FileText className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Generate Report</div>
                    <div className="text-sm text-muted-foreground">Analytics overview</div>
                  </div>
                </Button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      <AIAssistantPanel 
        isOpen={aiPanelOpen} 
        onClose={() => setAiPanelOpen(false)} 
      />
    </div>
  );
}