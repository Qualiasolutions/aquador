'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Shield, Award } from 'lucide-react';
import Button from '@/components/ui/Button';
import { AnimatedSection, AnimatedSectionItem } from '@/components/ui/AnimatedSection';
import { ParallaxSection } from '@/components/ui/ParallaxSection';

const features = [
  {
    icon: Sparkles,
    title: 'Personal Service',
    description: 'Tailored consultations',
  },
  {
    icon: Shield,
    title: 'Expert Guidance',
    description: 'Professional advice',
  },
  {
    icon: Award,
    title: 'Exclusive Scents',
    description: 'Rare collections',
  },
];

export default function CTASection() {
  return (
    <section className="relative section-lg overflow-hidden">
      {/* Background — parallax perfume bottle with charcoal and smoke */}
      <ParallaxSection speed={0.3} className="absolute inset-0">
        <Image
          src="/images/aquadour1.jpg"
          alt=""
          fill
          className="object-cover brightness-[0.4] saturate-[0.7]"
          sizes="100vw"
          loading="lazy"
        />
      </ParallaxSection>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Gold accent lines */}
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 container-wide">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection variant="fadeInUp">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair text-gradient-gold mb-5">
              Experience Aquad&apos;or
            </h2>
            <p className="text-base md:text-lg text-gray-400 mb-10 max-w-xl mx-auto">
              Book a personal consultation and discover your perfect scent with our fragrance experts.
            </p>
          </AnimatedSection>

          {/* Features */}
          <AnimatedSection variant="stagger" staggerDelay={0.1} className="mb-10">
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              {features.map((feature) => (
                <AnimatedSectionItem key={feature.title}>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center mb-3">
                      <feature.icon className="w-5 h-5 text-gold" />
                    </div>
                    <h3 className="text-white text-sm font-medium mb-0.5">{feature.title}</h3>
                    <p className="text-gray-300 text-xs">{feature.description}</p>
                  </div>
                </AnimatedSectionItem>
              ))}
            </div>
          </AnimatedSection>

          {/* CTA Button */}
          <AnimatedSection variant="fadeInUp" delay={0.3}>
            <Link href="/contact">
              <Button size="lg" className="min-w-[200px]">
                Book Your Experience
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
