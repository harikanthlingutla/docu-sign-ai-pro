import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  X,
  Minimize2,
  Maximize2
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'summary' | 'risk' | 'suggestion';
}

interface AIAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  documentName?: string;
}

export function AIAssistantPanel({ isOpen, onClose, documentName }: AIAssistantPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: documentName 
        ? `I've analyzed "${documentName}". I can help you summarize key points, identify potential risks, suggest improvements, or answer any questions about the document.` 
        : "Hello! I'm your AI document assistant. Upload a document and I'll help you analyze it, identify risks, suggest improvements, and answer questions.",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response with document analysis
    setTimeout(() => {
      const responses = [
        {
          text: "I've identified 3 key areas that need attention: the liability clause in section 4.2 appears overly broad, the termination conditions lack specific timelines, and the payment terms could be more clearly defined.",
          type: 'risk' as const
        },
        {
          text: "This document appears to be well-structured overall. The main obligations are clearly outlined, and most standard protective clauses are present. I recommend reviewing the intellectual property section for completeness.",
          type: 'summary' as const
        },
        {
          text: "I suggest adding a force majeure clause, clarifying the dispute resolution process, and including specific performance metrics where applicable. These additions would strengthen the agreement significantly.",
          type: 'suggestion' as const
        },
        {
          text: "Based on my analysis, this contract follows industry best practices. The risk level is low to moderate. I've highlighted the key terms that require your attention in the document viewer.",
          type: 'summary' as const
        },
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse.text,
        sender: 'ai',
        timestamp: new Date(),
        type: randomResponse.type,
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'summary': return <FileText className="h-4 w-4" />;
      case 'risk': return <AlertTriangle className="h-4 w-4" />;
      case 'suggestion': return <CheckCircle className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  const getMessageTypeColor = (type?: string) => {
    switch (type) {
      case 'risk': return 'border-red-500/30 bg-red-500/10';
      case 'suggestion': return 'border-emerald-500/30 bg-emerald-500/10';
      case 'summary': return 'border-blue-500/30 bg-blue-500/10';
      default: return '';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed right-0 top-0 h-full z-50 glass-panel border-l ${
            isMinimized ? 'w-16' : 'w-96'
          } transition-all duration-300`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary to-primary-glow rounded-xl">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              {!isMinimized && (
                <div>
                  <h3 className="font-semibold">AI Assistant</h3>
                  <p className="text-xs text-muted-foreground">Document Analysis</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <ScrollArea className="flex-1 p-4 h-[calc(100vh-140px)]">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex max-w-[85%] gap-3 ${
                        message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}>
                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          message.sender === 'user' 
                            ? 'bg-primary text-white'
                            : 'bg-gradient-to-br from-primary to-primary-glow text-white'
                        }`}>
                          {message.sender === 'user' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            getMessageIcon(message.type)
                          )}
                        </div>
                        
                        <div
                          className={`rounded-2xl p-4 ${
                            message.sender === 'user'
                              ? 'bg-primary text-white'
                              : `glass-panel ${getMessageTypeColor(message.type)}`
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.text}</p>
                          <div className={`text-xs mt-2 ${
                            message.sender === 'user' ? 'text-primary-100' : 'text-muted-foreground'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        
                        <div className="glass-panel rounded-2xl p-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                            <p className="text-sm text-muted-foreground">Analyzing...</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask about the document..."
                    className="glass-panel border-white/10 bg-white/5 focus:border-primary/30"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                    className="btn-gradient shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}