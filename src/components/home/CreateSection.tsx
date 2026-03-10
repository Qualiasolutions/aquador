'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/Section';
import { AnimatedSection, AnimatedSectionItem } from '@/components/ui/AnimatedSection';

const stages = [
  {
    title: 'Top Notes',
    description: 'Citrus, fruity, or spicy opening notes that create the first impression.',
    image: 'https://i.ibb.co/HfY2jbSH/1.jpg',
  },
  {
    title: 'Heart Notes',
    description: 'Floral, green, or woody middle notes that form the core.',
    image: 'https://i.ibb.co/xSqkdDL6/image-Cap-Cut-Commerce-Pro-202502202047.jpg',
  },
  {
    title: 'Base Notes',
    description: 'Warm, rich foundation notes that provide lasting depth.',
    image: 'https://i.ibb.co/M5PhxzZm/image-Cap-Cut-Commerce-Pro-202502202047-1.jpg',
  },
];

export default function CreateSection() {
  return (
    <section className="section bg-gold-ambient-dark relative overflow-hidden">
      <div className="container-wide relative z-10">
        <AnimatedSection variant="fadeInUp">
          <SectionHeader
            title="Create Your Signature"
            titleVariant="gold"
            subtitle="Design a perfume that's uniquely yours. Select from our premium notes and craft your personal masterpiece."
          />
        </AnimatedSection>

        {/* Stages grid */}
        <AnimatedSection variant="stagger" staggerDelay={0.12} className="mb-12 md:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {stages.map((stage, index) => (
              <AnimatedSectionItem key={stage.title}>
                <div className="group relative overflow-hidden bg-dark-lighter border border-gold/10 hover:border-gold/30 transition-all duration-500">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={stage.image}
                      alt={stage.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-lighter via-dark-lighter/50 to-transparent" />

                    {/* Step indicator */}
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 border border-gold/40 flex items-center justify-center backdrop-blur-sm">
                      <span className="text-gold text-sm font-medium">{index + 1}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-playfair text-black mb-2">
                      {stage.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                </div>
              </AnimatedSectionItem>
            ))}
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection variant="fadeInUp" delay={0.2} className="text-center">
          <Link href="/create-perfume">
            <Button size="lg" className="min-w-[180px]">
              Start Creating
            </Button>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
