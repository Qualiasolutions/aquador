'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { categories } from '@/lib/categories';
import { hoverVariants, tapVariants } from '@/lib/animations/micro-interactions';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { AnimatedSection, AnimatedSectionItem } from '@/components/ui/AnimatedSection';

// Asymmetric editorial layout:
//  - Mobile: single column stack
//  - Tablet: 2-col grid
//  - Desktop: feature tile (large) + 3 smaller tiles in a 2x2 with hero on left
//
//  Layout schema (desktop):
//  [ FEATURE (tall, col 1)  ] [ TOP-RIGHT    ]
//                             [ BOTTOM-LEFT  ]  [ BOTTOM-RIGHT ]
//
//  Implemented as CSS grid: 5fr 3fr 3fr across 3 cols, 2 rows

export default function Categories() {
  const reducedMotion = useReducedMotion();

  const cardHover = reducedMotion ? { scale: 1.01 } : hoverVariants.lift;
  const cardTap = reducedMotion ? { scale: 0.98 } : tapVariants.shrink;

  const [feature, ...rest] = categories;

  return (
    <section className="bg-gold-ambient-subtle overflow-hidden">
      <div className="container-wide py-0">
        <AnimatedSection variant="stagger" staggerDelay={0.08}>
          {/* Desktop: asymmetric editorial grid */}
          <div className="hidden md:grid gap-1" style={{ gridTemplateColumns: '5fr 3fr 3fr', gridTemplateRows: 'auto' }}>
            {/* Feature tile — tall, left */}
            <AnimatedSectionItem>
              <motion.div
                whileHover={cardHover}
                whileTap={cardTap}
                style={{ gridRow: '1 / 3' }}
                className="row-span-2"
              >
                <Link
                  href={`/shop/${feature.slug}`}
                  className="group block relative overflow-hidden bg-gray-200"
                  style={{ height: '100%', minHeight: '600px' }}
                >
                  <div className={`absolute inset-0 ${feature.contain ? 'bg-[#1a1a1a]' : ''}`}>
                    <Image
                      src={feature.image}
                      alt={feature.name}
                      fill
                      className={`transition-all duration-1000 group-hover:scale-105 filter grayscale-[15%] brightness-[0.65] group-hover:grayscale-0 group-hover:brightness-80 ${feature.contain ? 'object-contain p-10' : 'object-cover'}`}
                      sizes="(max-width: 1024px) 50vw, 40vw"
                      priority
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-all duration-700 group-hover:from-black/75" />

                  {/* Editorial label top */}
                  <div className="absolute top-6 left-6 z-10">
                    <span className="text-[9px] uppercase tracking-[0.25em] text-gold/60 font-light">Featured</span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-7 md:p-8 z-10">
                    <h3 className="font-playfair text-2xl md:text-3xl lg:text-4xl text-white mb-2 leading-tight">
                      {feature.name}
                    </h3>
                    <p className="text-xs text-gray-400 tracking-wide mb-6 transition-colors duration-300 group-hover:text-gray-300">
                      {feature.description}
                    </p>
                    <span className="inline-flex items-center gap-2.5 text-gold text-[10px] uppercase tracking-[0.2em] border-b border-gold/0 group-hover:border-gold/40 pb-1 transition-all duration-500">
                      Explore Collection
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                  <div className="absolute inset-0 border border-gold/0 transition-all duration-700 group-hover:border-gold/20" />
                </Link>
              </motion.div>
            </AnimatedSectionItem>

            {/* Smaller tiles — right columns */}
            {rest.map((category, index) => (
              <AnimatedSectionItem key={category.id}>
                <motion.div whileHover={cardHover} whileTap={cardTap}>
                  <Link
                    href={`/shop/${category.slug}`}
                    className="group block relative aspect-[4/3] overflow-hidden bg-gray-200"
                  >
                    <div className={`absolute inset-0 ${category.contain ? 'bg-[#1a1a1a]' : ''}`}>
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className={`transition-all duration-700 group-hover:scale-108 filter grayscale-[20%] brightness-[0.65] group-hover:grayscale-0 group-hover:brightness-80 ${category.contain ? 'object-contain p-6' : 'object-cover'}`}
                        sizes="(max-width: 1024px) 50vw, 30vw"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent transition-all duration-500 group-hover:from-black/75" />

                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-10">
                      <h3 className="font-playfair text-lg md:text-xl text-white mb-1">
                        {category.name}
                      </h3>
                      <p className="text-[11px] text-gray-400 tracking-wide mb-3 transition-colors duration-300 group-hover:text-gray-300 line-clamp-1">
                        {category.description}
                      </p>
                      <span className="inline-flex items-center gap-2 text-gold text-[9px] uppercase tracking-[0.15em] opacity-50 md:opacity-0 md:-translate-x-1 transition-all duration-300 md:group-hover:opacity-100 md:group-hover:translate-x-0">
                        Explore
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                    <div className="absolute inset-0 border border-gold/0 transition-all duration-500 group-hover:border-gold/25" />
                  </Link>
                </motion.div>
              </AnimatedSectionItem>
            ))}
          </div>

          {/* Mobile: single column stack, uniform aspect */}
          <div className="md:hidden grid grid-cols-2 gap-0.5">
            {categories.map((category) => (
              <AnimatedSectionItem key={category.id}>
                <motion.div whileHover={cardHover} whileTap={cardTap}>
                  <Link
                    href={`/shop/${category.slug}`}
                    className="group block relative aspect-[3/4] overflow-hidden bg-gray-200"
                  >
                    <div className={`absolute inset-0 ${category.contain ? 'bg-[#1a1a1a]' : ''}`}>
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className={`transition-all duration-700 group-hover:scale-110 filter grayscale-[20%] brightness-[0.65] group-hover:brightness-80 ${category.contain ? 'object-contain p-6' : 'object-cover'}`}
                        sizes="50vw"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                      <h3 className="font-playfair text-base text-white mb-0.5 line-clamp-1">
                        {category.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 tracking-wide line-clamp-1">
                        {category.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              </AnimatedSectionItem>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
