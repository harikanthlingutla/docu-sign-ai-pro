
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { Pricing } from '@/components/Pricing';
import { Testimonials } from '@/components/Testimonials';
import { SecurityFeatures } from '@/components/SecurityFeatures';
import { CTA } from '@/components/CTA';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <SecurityFeatures />
        <Pricing />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
