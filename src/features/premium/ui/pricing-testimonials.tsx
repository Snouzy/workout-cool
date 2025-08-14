"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, TrendingUp, Users } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  location: string;
  image: string;
  result?: string;
  metric?: string;
}

// TODO: Add testimonials
export function PricingTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials: Testimonial[] = [
    {
      quote:
        "I gained 15kg on bench press in 3 months with Workout.cool's detailed tracking. The GitHub-style history kept me motivated to stay consistent.",
      author: "Marcus T.",
      role: "Powerlifter",
      location: "Berlin, Germany",
      image: "/images/placeholders/coach-avatar.png",
      result: "+15kg bench press",
      metric: "3 months",
    },
    {
      quote: "Finally an app that truly understands strength training! The open-source approach gives me confidence in my data privacy.",
      author: "Sarah L.",
      role: "CrossFit Athlete",
      location: "London, UK",
      image: "/images/placeholders/coach-avatar.png",
      result: "40% more consistent",
      metric: "6 months",
    },
    {
      quote: "The equipment → muscles → exercises stepper is genius. Perfect for learning proper technique as a beginner.",
      author: "Alex R.",
      role: "Fitness Beginner",
      location: "Paris, France",
      image: "/images/placeholders/coach-avatar.png",
      result: "Perfect form",
      metric: "From day 1",
    },
    {
      quote: "Thanks to the detailed progress tracking, I finally broke my deadlift plateau. The analytics are incredibly motivating!",
      author: "Emma K.",
      role: "Bodybuilder",
      location: "Stockholm, Sweden",
      image: "/images/placeholders/coach-avatar.png",
      result: "Broke plateau",
      metric: "2 weeks",
    },
    {
      quote: "I can train anywhere - gym, home, park. The video tutorials are crystal clear and the community is amazing.",
      author: "David M.",
      role: "Fitness Enthusiast",
      location: "Madrid, Spain",
      image: "/images/placeholders/coach-avatar.png",
      result: "Train anywhere",
      metric: "Any time",
    },
    {
      quote: "The transparency and mission-driven approach convinced me to become a supporter. It's not just an app, it's a movement.",
      author: "Lisa B.",
      role: "Personal Trainer",
      location: "Amsterdam, Netherlands",
      image: "/images/placeholders/coach-avatar.png",
      result: "Supporting mission",
      metric: "1 year",
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const getVisibleTestimonials = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      result.push({ ...testimonials[index], index });
    }
    return result;
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Real Results from Real Athletes</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join thousands of fitness enthusiasts who&apos;ve transformed their training with Workout.cool
          </p>

          {/* Rating */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star className="w-5 h-5 text-[#F59E0B] fill-current" key={i} />
              ))}
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">4.9</span>
            <span className="text-gray-600 dark:text-gray-400">from 2,500+ coolers !</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Mobile Carousel */}
          <div className="md:hidden">
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4 mb-4">
                <Image
                  alt={testimonials[currentIndex].author}
                  className="w-16 h-16 rounded-full object-cover"
                  height={64}
                  src={testimonials[currentIndex].image}
                  width={64}
                />
                <div className="flex-1 flex">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonials[currentIndex].author}</h4>
                    {testimonials[currentIndex].result && (
                      <div className="px-2 py-1 bg-[#22C55E]/10 rounded-full">
                        <span className="text-xs font-medium text-[#22C55E]">{testimonials[currentIndex].result}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonials[currentIndex].role} • {testimonials[currentIndex].location}
                  </p>
                </div>
              </div>

              <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed">
                &quot;{testimonials[currentIndex].quote}&quot;
              </blockquote>
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            {getVisibleTestimonials().map((testimonial, i) => (
              <div
                className={`bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg transition-all duration-300 ${
                  i === 1 ? "transform scale-105 ring-2 ring-[#FF6B35]/20" : ""
                }`}
                key={testimonial.index}
              >
                <div className="flex items-start gap-4 mb-4">
                  <Image
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                    height={48}
                    src={testimonial.image}
                    width={48}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-col">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{testimonial.author}</h4>
                      {testimonial.result && (
                        <div className="px-2 py-0.5 bg-[#22C55E]/10 rounded-full">
                          <span className="text-xs font-medium text-[#22C55E]">{testimonial.result}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{testimonial.location}</p>
                  </div>
                </div>

                <blockquote className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  &quot;{testimonial.quote}&quot;
                </blockquote>

                {testimonial.metric && (
                  <div className="mt-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#00D4AA]" />
                    <span className="text-xs font-medium text-[#00D4AA]">{testimonial.metric}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button className="p-2 rounded-full bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-shadow" onClick={goToPrev}>
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? "bg-[#FF6B35]" : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                  }`}
                  key={index}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>

            <button className="p-2 rounded-full bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-shadow" onClick={goToNext}>
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Community Stats */}
          <div className="mt-12 bg-gradient-to-r from-[#FF6B35]/10 to-[#00D4AA]/10 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-5 h-5 text-[#FF6B35]" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">2,500+</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Happy members</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#00D4AA]" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">89%</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Reach their goals</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Star className="w-5 h-5 text-[#F59E0B]" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">4.9/5</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
