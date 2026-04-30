'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { ParallaxSection } from '@/components/ui/ParallaxSection';
import { cinematicVariants, revealVariants } from '@/lib/animations/cinematic';
import { useAnimationBudget } from '@/lib/performance/animation-budget';
import { useState, useRef } from 'react';

export default function Hero() {
  const [videoError, setVideoError] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.1 });
  const { shouldUseSimplifiedAnimations } = useAnimationBudget();
  
  // Scroll-based parallax for content
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <motion.section
      className="relative min-h-screen flex flex-col overflow-hidden"
      variants={shouldUseSimplifiedAnimations ? cinematicVariants.simpleFade : cinematicVariants.heroEntry}
      initial="initial"
      animate="animate"
    >
      {/* Main Hero Content */}
      <div ref={sectionRef} className="relative flex-1 flex items-center justify-center pt-24">
        {/* Video Background with enhanced treatment */}
        <ParallaxSection speed={0.25} className="absolute inset-0 z-0">
          {!videoError ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              poster="/images/aquadour1.jpg"
              className="absolute w-full h-full object-cover"
              style={{ filter: 'brightness(0.22) saturate(0.65) contrast(1.15)' }}
              onError={() => setVideoError(true)}
            >
              <source
                src="https://static1.squarespace.com/static/66901f0f8865462c0ac066ba/t/6899a19131e4b55cddf56fb2/1754898858755/download+%2820%29.mp4"
                type="video/mp4"
              />
            </video>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0d0d0d] to-black" />
          )}

          {/* Multi-layer gradient for cinematic depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)',
            }}
          />
          {/* Subtle film grain overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </ParallaxSection>

        {/* Ambient gold glow — slow-breathing center light */}
        <ParallaxSection speed={0.45} className="absolute inset-0 z-0 pointer-events-none gpu-accelerated">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.05) 0%, rgba(212,175,55,0.02) 40%, transparent 70%)',
              filter: 'blur(50px)',
            }}
            animate={isInView ? {
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.9, 0.5],
            } : { scale: 1, opacity: 0.5 }}
            transition={isInView ? {
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            } : { duration: 0 }}
          />
          {/* Secondary floating orb */}
          <motion.div
            className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255,215,0,0.03) 0%, transparent 60%)',
              filter: 'blur(40px)',
            }}
            animate={isInView ? {
              y: [0, -30, 0],
              x: [0, 20, 0],
              opacity: [0.3, 0.6, 0.3],
            } : { y: 0, opacity: 0.3 }}
            transition={isInView ? {
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            } : { duration: 0 }}
          />
        </ParallaxSection>

        {/* Content — centered with generous vertical breathing room */}
        <motion.div
          className="relative z-10 text-center container-wide py-20 md:py-32 lg:py-40"
          variants={revealVariants.fadeInSequence}
          initial="initial"
          animate="animate"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          {/* Eyebrow label with refined animation */}
          <motion.p
            className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-gold/40 mb-10 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-3">
              <span className="w-6 h-px bg-gradient-to-r from-transparent to-gold/40" />
              Luxury Fragrances
              <span className="w-6 h-px bg-gradient-to-l from-transparent to-gold/40" />
            </span>
          </motion.p>

          {/* Brand name — cinematic scale with enhanced gradient */}
          <motion.h1
            className="font-playfair font-normal mb-0 tracking-[0.15em] sm:tracking-[0.2em] py-2"
            aria-label="Aquad'or"
            style={{
              fontSize: 'clamp(3.2rem, 10vw, 7rem)',
              lineHeight: 1.1,
              background: 'linear-gradient(180deg, #FFFAEB 0%, #FFE566 20%, #FFD700 40%, #D4AF37 65%, #B8960C 85%, #8B7500 100%)',
              backgroundSize: '100% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 4px 80px rgba(212, 175, 55, 0.3))',
            }}
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            AQUAD&apos;OR
          </motion.h1>

          {/* Refined separator with animated lines */}
          <motion.div
            className="relative flex items-center justify-center gap-4 my-10 md:my-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <motion.div 
              className="w-16 h-px bg-gradient-to-r from-transparent via-gold/30 to-gold/50"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'right' }}
            />
            <motion.div 
              className="w-1.5 h-1.5 rounded-full bg-gold/60"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 1.2 }}
            />
            <motion.div 
              className="w-28 h-px bg-gradient-to-r from-gold/50 via-gold/80 to-gold/50"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div 
              className="w-1.5 h-1.5 rounded-full bg-gold/60"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 1.2 }}
            />
            <motion.div 
              className="w-16 h-px bg-gradient-to-l from-transparent via-gold/30 to-gold/50"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'left' }}
            />
          </motion.div>

          {/* Tagline — refined hierarchy */}
          <motion.p
            className="text-[10px] sm:text-[11px] md:text-xs text-white/40 tracking-[0.3em] uppercase font-light mb-16 md:mb-24"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
          >
            Where Luxury Meets Distinction
          </motion.p>

          {/* CTA Buttons with staggered animation */}
          <motion.div
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="/shop">
              <Button size="lg" className="min-w-[220px]">
                Explore Collection
              </Button>
            </Link>
            <Link href="/create-perfume">
              <Button variant="outline" size="lg" className="min-w-[220px]">
                Create Your Own
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <span className="text-[8px] uppercase tracking-[0.3em] text-white/30">Scroll</span>
          <motion.div
            className="w-px h-8 bg-gradient-to-b from-gold/50 to-transparent"
            animate={{ scaleY: [1, 0.5, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>

      {/* Bottom vignette edge - enhanced */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/50 to-transparent z-[1]" />
    </motion.section>
  );
}
