import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/66bb69d3-ad50-4670-ae60-4503fdb06edc.png" 
                alt="SignThatDoc Logo" 
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-4 text-tertiary max-w-md">
              An AI-powered document review and signing platform that makes contract handling simple, fast, and intelligent.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link to="/features" className="text-tertiary hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="text-tertiary hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link to="/docs" className="text-tertiary hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link to="/guides" className="text-tertiary hover:text-primary transition-colors">Guides</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-tertiary hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="text-tertiary hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-tertiary hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/blog" className="text-tertiary hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-tertiary text-sm">© 2025 SignThatDoc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="text-tertiary hover:text-primary text-sm transition-colors">Terms</Link>
            <Link to="/privacy" className="text-tertiary hover:text-primary text-sm transition-colors">Privacy</Link>
            <Link to="/cookies" className="text-tertiary hover:text-primary text-sm transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
