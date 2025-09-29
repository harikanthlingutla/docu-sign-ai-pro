import { motion } from "framer-motion";
import { CheckCircle, Circle, Upload } from "lucide-react";

interface ProgressStep {
  label: string;
  completed: boolean;
  current?: boolean;
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
  className?: string;
}

export function ProgressIndicator({ steps, className = "" }: ProgressIndicatorProps) {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center space-x-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative"
          >
            {step.completed ? (
              <CheckCircle className="h-6 w-6 text-emerald-500" />
            ) : step.current ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Upload className="h-6 w-6 text-primary" />
              </motion.div>
            ) : (
              <Circle className="h-6 w-6 text-muted-foreground" />
            )}
          </motion.div>
          
          <span className={`text-sm font-medium ${
            step.completed 
              ? "text-emerald-600 dark:text-emerald-400" 
              : step.current 
                ? "text-primary" 
                : "text-muted-foreground"
          }`}>
            {step.label}
          </span>
          
          {index < steps.length - 1 && (
            <div className="w-8 h-px bg-border" />
          )}
        </div>
      ))}
    </div>
  );
}