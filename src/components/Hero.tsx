
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AnimatedTextCycle from '@/components/ui/animated-text-cycle';

export function Hero() {
  return (
    <div className="max-container px-4 sm:px-6 section-padding flex flex-col items-center text-center">
      <h1 className="heading-1 max-w-4xl animate-fade-in">
        <AnimatedTextCycle 
          words={["AI-Powered", "Smart", "Secure", "Quantum-Safe"]}
          interval={3000}
          className="text-primary"
        /> Document Review & Signing
      </h1>
      <p className="mt-4 md:mt-6 max-w-2xl text-base md:text-lg lg:text-xl text-tertiary animate-slide-up">
        Review contracts with AI assistance, generate custom signatures, and send secure
        signed documents—all in one platform.
      </p>
      <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 animate-slide-up w-full sm:w-auto" style={{ animationDelay: '200ms' }}>
        <Link to="/signup" className="w-full sm:w-auto">
          <Button size="lg" className="group w-full sm:w-auto">
            Get Started 
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
        <Link to="/demo" className="w-full sm:w-auto">
          <Button size="lg" variant="outline" className="w-full sm:w-auto">
            Watch Demo
          </Button>
        </Link>
      </div>
      <div className="mt-12 md:mt-16 w-full max-w-5xl bg-white rounded-xl shadow-xl overflow-hidden animate-slide-up" style={{ animationDelay: '400ms' }}>
        <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur p-4 sm:p-6 rounded-xl shadow-lg max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-primary"></div>
                <span className="font-medium text-secondary text-sm sm:text-base">AI Contract Assistant</span>
              </div>
              <div className="text-xs text-tertiary hidden sm:block">Analyzing document...</div>
            </div>
            <div className="space-y-3">
              <div className="bg-primary-100 p-3 rounded-lg text-xs sm:text-sm text-secondary">
                The current document contains a 14-day cancellation clause in section 3.2 that may be unfavorable. Would you like me to suggest an alternative?
              </div>
              <div className="bg-secondary-100 p-3 rounded-lg text-xs sm:text-sm text-secondary">
                Yes, please suggest an alternative to this clause.
              </div>
              <div className="bg-primary-100 p-3 rounded-lg text-xs sm:text-sm text-secondary animate-pulse">
                Generating alternatives based on standard industry practices...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
