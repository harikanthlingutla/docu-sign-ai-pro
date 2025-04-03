
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm py-4 sticky top-0 z-50">
      <div className="max-container flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M10 13.5V10h-7v3.5a1.5 1.5 0 0 0 3 0V12a1 1 0 0 1 2 0v1.5a1.5 1.5 0 0 0 3 0Z" />
              <path d="M10 13.5V10h7v3.5a1.5 1.5 0 0 1-3 0V12a1 1 0 0 0-2 0v1.5a1.5 1.5 0 0 1-3 0Z" />
              <path d="M21 19H3" />
              <path d="M12 2v6" />
            </svg>
          </div>
          <span className="text-secondary font-display font-bold text-xl">SignThatDoc</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex space-x-6">
            <Link to="/features" className="text-secondary hover:text-primary font-medium transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="text-secondary hover:text-primary font-medium transition-colors">
              Pricing
            </Link>
            <Link to="/about" className="text-secondary hover:text-primary font-medium transition-colors">
              About
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link to="/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t mt-4">
          <div className="max-container py-4 space-y-4">
            <Link 
              to="/features" 
              className="block text-secondary hover:text-primary font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className="block text-secondary hover:text-primary font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/about" 
              className="block text-secondary hover:text-primary font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="flex flex-col space-y-2 pt-2 border-t">
              <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
