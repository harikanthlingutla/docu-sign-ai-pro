
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizonal, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'sita';
  timestamp: Date;
}

export function SitaChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m Sita, your AI document assistant. I can help you analyze contracts, suggest edits, extract key information, and answer questions about your document. How can I assist you today?',
      sender: 'sita',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I've analyzed the key terms in your document. The most important clauses to review are in sections 3.2, 7.1, and 9.4. Would you like me to explain any of these in detail?",
        "Based on the document structure, I notice this appears to be a service agreement. I can help you verify that all standard clauses are present and properly structured.",
        "I found 2 potential areas that might need attention: the liability limitation clause and the termination conditions. Should I highlight these sections for you?",
        "This document looks well-structured overall. I can help you add signature fields, date stamps, or any other elements you need before finalizing.",
        "I can see there are payment terms mentioned. Would you like me to summarize the payment schedule and key financial obligations?",
      ];
      
      const sitaResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'sita',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, sitaResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card className="h-full flex flex-col professional-card border-slate-200">
      {/* Header */}
      <div className="flex items-center space-x-3 p-4 border-b border-slate-200 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-full">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Sita AI Assistant</h3>
          <p className="text-sm text-slate-600">Document Analysis & Support</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] gap-3 ${
                message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-primary text-white'
                    : 'bg-gradient-to-br from-primary to-accent text-white'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                
                <div
                  className={`rounded-xl p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 border border-slate-200'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <div className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-primary-100' : 'text-slate-500'
                  }`}>
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
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                
                <div className="max-w-[85%] rounded-xl p-3 bg-slate-100 border border-slate-200">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <p className="text-sm text-slate-600">Sita is analyzing...</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Input */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
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
            placeholder="Ask Sita about your document..."
            className="flex-1 border-slate-300 focus:border-primary focus:ring-primary"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="professional-button"
          >
            <SendHorizonal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
