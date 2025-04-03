
import React from 'react';
import { FileText, MessageSquare, Pencil, Send, ShieldCheck, Zap } from 'lucide-react';

const features = [
  {
    icon: <FileText className="h-6 w-6 text-primary" />,
    title: "Document Upload & Storage",
    description: "Securely upload and store your documents. All files are encrypted and safely stored."
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-primary" />,
    title: "AI Contract Assistant",
    description: "Chat with your documents to summarize, find key clauses, and get answers to specific questions."
  },
  {
    icon: <Pencil className="h-6 w-6 text-primary" />,
    title: "Custom Signatures",
    description: "Create and save personalized signatures that reflect your style and brand."
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    title: "Secure Document Signing",
    description: "Sign documents with legally binding electronic signatures that are compliant with regulations."
  },
  {
    icon: <Send className="h-6 w-6 text-primary" />,
    title: "Email Integration",
    description: "Send signed documents directly via email without leaving the platform."
  },
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: "Fast & Automated",
    description: "Save time with automated workflows that streamline the entire document handling process."
  }
];

export function Features() {
  return (
    <div className="bg-secondary-100 section-padding">
      <div className="max-container">
        <div className="text-center mb-16">
          <h2 className="heading-2">Powerful Features</h2>
          <p className="mt-4 max-w-2xl mx-auto text-tertiary text-lg">
            Everything you need to manage, understand, and sign your documents intelligently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-tertiary">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
