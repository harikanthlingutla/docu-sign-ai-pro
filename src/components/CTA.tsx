
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function CTA() {
  return (
    <div className="bg-primary-600 text-white section-padding">
      <div className="max-container">
        <div className="flex flex-col items-center text-center">
          <h2 className="heading-2 text-white max-w-2xl">Ready to Transform Your Document Workflow?</h2>
          <p className="mt-4 max-w-2xl text-primary-100 text-lg">
            Join thousands of professionals who are saving time and gaining insights with SignThatDoc.
          </p>
          <div className="mt-8">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-primary-100">
                Start Your Free Trial
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-primary-200 text-sm">
            No credit card required. 14-day free trial.
          </p>
        </div>
      </div>
    </div>
  );
}
