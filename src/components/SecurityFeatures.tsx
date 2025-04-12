
import React from 'react';
import { Shield, Lock, File, Users } from 'lucide-react';

export function SecurityFeatures() {
  return (
    <div className="bg-secondary-100 section-padding">
      <div className="max-container">
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-4">Post-Quantum Security</h2>
          <p className="text-tertiary max-w-2xl mx-auto">
            SignThatDoc uses NIST-standard quantum-resistant cryptography to ensure your documents remain secure even against quantum computing threats.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <SecurityCard 
            icon={<Shield className="h-10 w-10" />}
            title="CRYSTALS-Dilithium2"
            description="Industry-standard post-quantum digital signatures that protect against future quantum computing attacks."
          />
          
          <SecurityCard 
            icon={<Lock className="h-10 w-10" />}
            title="CRYSTALS-Kyber"
            description="Quantum-resistant key exchange for secure document sharing and transmission."
          />
          
          <SecurityCard 
            icon={<File className="h-10 w-10" />}
            title="Document Integrity"
            description="SHA3-256 hashing and tamper detection ensure documents remain unaltered after signing."
          />
          
          <SecurityCard 
            icon={<Users className="h-10 w-10" />}
            title="Audit Trails"
            description="Comprehensive, cryptographically secured record of all document actions and signatures."
          />
        </div>
      </div>
    </div>
  );
}

interface SecurityCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function SecurityCard({ icon, title, description }: SecurityCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
      <div className="text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-tertiary text-sm">{description}</p>
    </div>
  );
}
