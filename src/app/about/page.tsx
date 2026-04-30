'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { PageHero } from '@/components/ui/Section';
import { AnimatedSection, AnimatedSectionItem } from '@/components/ui/AnimatedSection';
import { Heart, Leaf, Award, Users } from 'lucide-react';
import { fadeInLeft, fadeInRight, fadeInUp } from '@/lib/animations/scroll-animations';

const values = [
  {
    icon: <Heart className="w-5 h-5 text-gold" />,
    title: 'Passion',
    description: 'Every fragrance is infused with expertise and a deep love for the art of perfumery.',
  },
  {
    icon: <Leaf className="w-5 h-5 text-gold" />,
    title: 'Quality',
    description: 'We source only the finest ingredients from around the world.',
  },
  {
    icon: <Award className="w-5 h-5 text-gold" />,
    title: 'Craftsmanship',
    description: 'Our perfumers blend tradition with innovation to create unique fragrances.',
  },
  {
    icon: <Users className="w-5 h-5 text-gold" />,
    title: 'Service',
    description: 'Every customer deserves a personalized experience.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gold-ambient-subtle">
      <PageHero
        title="Our Story"
        subtitle="Aquad'or was born from a deep passion for the art of perfumery and a desire to bring the world's finest fragrances to Cyprus."
        backgroundImage="https://images.unsplash.com/photo-1541643600914-78b084683601?w=1920&q=80"
        eyebrow="Est. 2024 — Nicosia, Cyprus"
      />

      {/* Story Section — editorial asymmetric layout */}
      <section className="section-lg relative">
        {/* Ambient glow */}
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 pointer-events-none opacity-40"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.05) 0%, transparent 60%)',
            filter: 'blur(60px)',
          }}
        />
        
        <div className="container-wide relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-center">
            {/* Text — takes 5 cols */}
            <motion.div
              className="lg:col-span-5"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInLeft}
            >
              <div className="flex items-center gap-3 mb-6">
                <p className="eyebrow text-gold/50">Who We Are</p>
                <span className="flex-1 h-px bg-gradient-to-r from-gold/20 to-transparent" />
              </div>
              <h2 className="font-playfair text-3xl md:text-4xl lg:text-[2.75rem] text-black mb-7 leading-[1.1]">
                Where Luxury Meets{' '}
                <span className="text-gradient-gold">Distinction</span>
              </h2>
              <div className="flex items-center gap-2 mb-10">
                <div className="w-8 h-px bg-gradient-to-r from-gold/50 to-gold/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-gold/40" />
              </div>
              <div className="space-y-5 text-gray-600 text-[15px] leading-[1.85]">
                <p>
                  Founded in the heart of Nicosia, Aquad&apos;or has established itself as Cyprus&apos;s premier destination for luxury fragrances. Our curated collection features high-end and niche perfumes from globally recognized brands.
                </p>
                <p>
                  We believe that fragrance is more than just a scent — it&apos;s an expression of identity, a memory captured in a bottle, and a journey of the senses.
                </p>
              </div>

              {/* Pull quote */}
              <blockquote className="mt-10 border-l-2 border-gold/40 pl-6">
                <p className="font-playfair italic text-xl text-gold/80 leading-relaxed">
                  &ldquo;Fragrance is the most intimate form of self-expression.&rdquo;
                </p>
              </blockquote>

              <p className="mt-8 text-gray-600 text-[15px] leading-[1.85]">
                Our commitment to excellence extends beyond our products. We offer personalized consultations to help you discover fragrances that resonate with your unique personality and style.
              </p>
            </motion.div>

            {/* Image — takes 7 cols, full-bleed editorial */}
            <motion.div
              className="lg:col-span-7 relative"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInRight}
            >
              {/* Decorative frame accent */}
              <div className="absolute -top-4 -right-4 w-32 h-32 pointer-events-none hidden lg:block">
                <div className="absolute top-0 right-4 w-20 h-px bg-gradient-to-l from-gold/40 to-transparent" />
                <div className="absolute top-4 right-0 w-px h-20 bg-gradient-to-b from-gold/40 to-transparent" />
              </div>
              
              <div className="relative aspect-[4/3] lg:aspect-[16/11] overflow-hidden">
                <Image
                  src="https://i.ibb.co/xSqkdDL6/image-Cap-Cut-Commerce-Pro-202502202047.jpg"
                  alt="Aquad'or luxury perfumes"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
              </div>

              {/* Floating stat card - Enhanced */}
              <motion.div
                className="absolute -bottom-8 -left-8 hidden lg:block bg-white border border-gold/15 p-6 w-52"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ boxShadow: 'var(--shadow-elevated)' }}
              >
                <p className="font-playfair text-4xl text-gradient-gold font-normal">100+</p>
                <p className="text-gray-500 text-[11px] mt-2 tracking-wide leading-relaxed">Curated fragrances from around the world</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values — refined editorial treatment */}
      <section className="section-lg bg-gold-ambient-dark relative overflow-hidden">
        {/* Subtle gold top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

        <div className="container-wide">
          <AnimatedSection variant="fadeInUp" className="text-center mb-16 md:mb-24">
            <p className="eyebrow text-gold/50 mb-5">What Drives Us</p>
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-black mb-6 leading-tight">Our Values</h2>
            <div className="flex items-center justify-center gap-4">
              <div className="w-10 h-px bg-gradient-to-r from-transparent to-gold/30" />
              <div className="w-1.5 h-1.5 rounded-full bg-gold/50" />
              <div className="w-16 h-px bg-gradient-to-r from-gold/50 via-gold to-gold/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-gold/50" />
              <div className="w-10 h-px bg-gradient-to-l from-transparent to-gold/30" />
            </div>
          </AnimatedSection>

          <AnimatedSection variant="stagger" staggerDelay={0.12}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-gold/10">
              {values.map((value, index) => (
                <AnimatedSectionItem key={value.title}>
                  <div className="group relative p-8 md:p-10 lg:p-12 border-b border-r border-gold/10 hover:bg-white transition-all duration-500 overflow-hidden">
                    {/* Subtle hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Number indicator */}
                    <span className="absolute top-4 right-4 text-[10px] text-gold/20 font-light">0{index + 1}</span>
                    
                    <div className="relative w-12 h-12 border border-gold/15 bg-gold/5 flex items-center justify-center mb-6 group-hover:border-gold/30 group-hover:bg-gold/10 transition-all duration-500">
                      {value.icon}
                    </div>
                    <h3 className="relative font-playfair text-xl text-black mb-4">{value.title}</h3>
                    <p className="relative text-gray-500 text-sm leading-relaxed">{value.description}</p>
                  </div>
                </AnimatedSectionItem>
              ))}
            </div>
          </AnimatedSection>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
      </section>

      {/* CTA — clean centered */}
      <section className="section-lg">
        <div className="container-wide">
          <motion.div
            className="max-w-xl mx-auto text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <p className="eyebrow text-gold/60 mb-4">Visit Us</p>
            <h2 className="font-playfair text-3xl md:text-4xl text-black mb-5 leading-tight">
              Experience the Difference
            </h2>
            <div className="flex items-center justify-center gap-3 mb-7">
              <div className="w-8 h-px bg-gold/30" />
              <div className="w-12 h-px bg-gold" />
              <div className="w-8 h-px bg-gold/30" />
            </div>
            <p className="text-gray-500 text-sm md:text-base mb-10 leading-relaxed">
              Visit our boutique in Nicosia or explore our collection online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button size="md">Explore Collection</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="md">Contact Us</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
