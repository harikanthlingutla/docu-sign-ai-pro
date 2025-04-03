
import React from 'react';
import { StarIcon } from '@/components/StarIcon';

const testimonials = [
  {
    quote: "SignThatDoc has transformed how our legal team handles contracts. The AI assistant has saved us countless hours of review time.",
    author: "Sarah Johnson",
    title: "Legal Director, TechCorp",
    rating: 5
  },
  {
    quote: "The signature feature is intuitive and the document AI actually understands our complex agreements. Game changer for our small business.",
    author: "Michael Chen",
    title: "CEO, Innovative Solutions",
    rating: 5
  },
  {
    quote: "As a freelancer, I need to review contracts quickly. This platform gives me confidence that I'm not missing important details.",
    author: "Alex Rodriguez",
    title: "Independent Consultant",
    rating: 5
  }
];

export function Testimonials() {
  return (
    <div className="section-padding">
      <div className="max-container">
        <div className="text-center mb-16">
          <h2 className="heading-2">What Our Users Say</h2>
          <p className="mt-4 max-w-2xl mx-auto text-tertiary text-lg">
            Trusted by professionals and businesses of all sizes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                ))}
              </div>
              <p className="text-secondary text-lg italic mb-6 flex-grow">{testimonial.quote}</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-tertiary text-sm">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
