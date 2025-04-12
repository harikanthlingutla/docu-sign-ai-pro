
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function CTA() {
  return (
    <div className="bg-primary-600 text-white section-padding">
      <div className="max-container">
        <div className="flex flex-col items-center text-center">
          <h2 className="heading-2 text-white max-w-2xl">Secure Your Documents for the Quantum Era</h2>
          <p className="mt-4 max-w-2xl text-primary-100 text-lg">
            Join law firms, enterprises, and government institutions who trust SignThatDoc for legally-binding, quantum-resistant document signing.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-primary-100">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/enterprise">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-primary-500">
                Enterprise Solutions
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-primary-200 text-sm">
            NIST-compliant post-quantum cryptography • No credit card required for trial
          </p>
        </div>
      </div>
    </div>
  );
}
