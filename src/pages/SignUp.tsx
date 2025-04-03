
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

const SignUp = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This is a placeholder for the actual Supabase integration
    toast({
      title: "Coming Soon",
      description: "User registration will be integrated with Supabase Auth",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Create Your Account</h1>
            <p className="text-tertiary mt-2">
              Start your journey with SignThatDoc
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className="input-field"
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="input-field"
                placeholder="Create a password"
                required
              />
              <p className="text-xs text-tertiary mt-1">
                Must be at least 8 characters
              </p>
            </div>
            
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-tertiary">
              Already have an account?{' '}
              <Link to="/signin" className="text-primary font-medium">
                Sign in
              </Link>
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-xs text-tertiary">
              By signing up, you agree to our{' '}
              <a href="/terms" className="text-primary">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUp;
