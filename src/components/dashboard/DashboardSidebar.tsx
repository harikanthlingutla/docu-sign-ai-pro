import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Pencil, 
  Shield, 
  User, 
  LogOut, 
  Sparkles,
  Settings,
  BarChart3
} from "lucide-react";

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const sidebarItems = [
  { id: 'documents', icon: FileText, label: 'Documents', tooltip: 'Document Management' },
  { id: 'signatures', icon: Pencil, label: 'Signatures', tooltip: 'Signature Center' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics', tooltip: 'Usage Analytics' },
  { id: 'security', icon: Shield, label: 'Security', tooltip: 'Security Center' },
  { id: 'profile', icon: User, label: 'Profile', tooltip: 'Account Settings' },
];

export function DashboardSidebar({ activeTab, onTabChange }: DashboardSidebarProps) {
  return (
    <aside className="w-20 glass-sidebar flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-white/10">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mx-auto glow-primary"
        >
          <Sparkles className="h-6 w-6 text-white" />
        </motion.div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 py-6">
        <div className="space-y-3 px-3">
          {sidebarItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onTabChange(item.id)}
                className={`relative w-14 h-14 rounded-2xl transition-all duration-300 group ${
                  activeTab === item.id
                    ? 'bg-primary/20 text-primary shadow-lg glow-primary'
                    : 'hover:bg-white/10 hover:scale-105'
                }`}
                title={item.tooltip}
              >
                <item.icon className="h-6 w-6" />
                
                {/* Active indicator */}
                {activeTab === item.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                {/* Tooltip */}
                <div className="absolute left-full ml-4 px-3 py-2 bg-black/90 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.tooltip}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-0 h-0 border-r-4 border-r-black/90 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </nav>
      
      {/* Settings & Logout */}
      <div className="border-t border-white/10 p-3 space-y-3">
        <Button
          variant="ghost"
          size="icon"
          className="w-14 h-14 rounded-2xl hover:bg-white/10 hover:scale-105 transition-all duration-300"
          title="Settings"
        >
          <Settings className="h-6 w-6" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="w-14 h-14 rounded-2xl hover:bg-red-500/20 hover:text-red-500 hover:scale-105 transition-all duration-300"
          title="Sign Out"
        >
          <LogOut className="h-6 w-6" />
        </Button>
      </div>
    </aside>
  );
}