
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendHorizonal, Loader2, Bot, User, FileText } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI document assistant. I can help analyze your contract, find important clauses, or answer specific questions about the document.',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "Based on my analysis, this contract has a standard 30-day termination clause in section 5.2.",
        "I've found 3 clauses that might need your attention: non-compete (section 2.1), liability limits (section 8.3), and auto-renewal (section 12.1).",
        "The payment terms in this agreement require payment within 14 days of invoice, with a 2% late fee applied daily after that period.",
        "This looks like a standard non-disclosure agreement with a 2-year confidentiality period after termination."
      ];
      
      const aiResponse: Message = {
        id: Date.now().toString(),
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[600px] overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        <div className="bg-secondary-100 rounded-md p-3 text-xs text-secondary mb-6">
          <div className="flex items-center gap-2 text-primary mb-2">
            <FileText className="h-4 w-4" />
            <span className="font-medium">System</span>
          </div>
          Document analyzer ready. Upload a document or ask questions about your current document.
        </div>
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div className={`flex max-w-[80%] gap-3 ${
              message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user' 
                  ? 'bg-primary text-white'
                  : 'bg-secondary-200 text-secondary'
              }`}>
                {message.sender === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              
              <div
                className={`rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary-100 border border-primary-200 text-secondary'
                    : 'bg-secondary-100 border border-secondary-200'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <div
                  className={`text-xs mt-1 text-tertiary`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-secondary-200 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-secondary" />
              </div>
              
              <div className="max-w-[80%] rounded-lg p-3 bg-secondary-100 border border-secondary-200">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <p className="text-sm text-tertiary">Analyzing document...</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t bg-secondary-100">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask about your document..."
            className="flex-1 bg-white"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="flex items-center"
          >
            <SendHorizonal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
