
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Shield, Users, FileText, Lock } from 'lucide-react';

const Enterprise = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-secondary-600 text-white py-12 md:py-20">
          <div className="max-container px-4 sm:px-6">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Enterprise-Grade Document Security</h1>
              <p className="text-lg md:text-xl text-primary-100 mb-8">
                Protect your organization's sensitive documents with NIST-standard post-quantum cryptography and intelligent AI analysis.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-white text-secondary hover:bg-primary-100">
                  Request Demo
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-secondary-500">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="section-padding">
          <div className="max-container">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <FeatureCard 
                icon={<Shield className="h-10 w-10 md:h-12 md:w-12" />}
                title="Post-Quantum Cryptography"
                description="Ensure your documents remain secure against future quantum computing threats with NIST-approved CRYSTALS-Dilithium2 signatures."
              />
              
              <FeatureCard 
                icon={<Users className="h-10 w-10 md:h-12 md:w-12" />}
                title="Multi-Party Signing Workflows"
                description="Design advanced signing workflows with sequential or concurrent signatures, full audit trails, and role-based permissions."
              />
              
              <FeatureCard 
                icon={<FileText className="h-10 w-10 md:h-12 md:w-12" />}
                title="AI Document Analysis"
                description="Let your legal teams work faster with AI-powered contract analysis, clause extraction, and intelligent document summaries."
              />
              
              <FeatureCard 
                icon={<Lock className="h-10 w-10 md:h-12 md:w-12" />}
                title="Compliance & Security"
                description="Meet the strictest security requirements with detailed audit trails, document integrity verification, and access controls."
              />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary-600 text-white py-12 md:py-16">
          <div className="max-container text-center px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to Upgrade Your Document Security?</h2>
            <p className="text-base md:text-lg mb-8 max-w-2xl mx-auto">
              Join leading enterprises, law firms, and government institutions that trust SignThatDoc for secure document signing.
            </p>
            <Button size="lg" className="bg-white text-primary-600 hover:bg-primary-100">
              Schedule a Consultation
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="text-primary mb-5 md:mb-6">
        {icon}
      </div>
      <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">{title}</h3>
      <p className="text-tertiary text-sm md:text-base">{description}</p>
    </div>
  );
}

export default Enterprise;
