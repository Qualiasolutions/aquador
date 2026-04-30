'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { CartIcon } from '@/components/cart';
import { SearchBar } from '@/components/search';

const navLinks = [
  { label: 'Dubai Shop', href: '/shop' },
  { label: 'Lattafa Originals', href: '/shop/lattafa' },
  { label: 'Create Your Own', href: '/create-perfume' },
  { label: 'Re-Order', href: '/reorder' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

const leftLinks = navLinks.slice(0, 3);
const rightLinks = navLinks.slice(3);

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const ticking = useRef(false);

  const isScrolled = scrollY > 60;
  // Transition zone: 0–120px — gradual blur/background transition
  const blurIntensity = Math.min(1, scrollY / 120);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  useEffect(() => {
    setIsMobileOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const isHome = pathname === '/';
  const useLightText = isHome && !isScrolled;

  const checkActive = (href: string) => {
    if (href === '/shop') return pathname === '/shop' || (pathname.startsWith('/shop/') && pathname !== '/shop/lattafa' && !pathname.startsWith('/shop/lattafa/'));
    return pathname === href || (href !== '/' && pathname.startsWith(href));
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-0 right-0 z-50 top-0 pt-1"
        style={{
          background: isHome && !isScrolled
            ? `rgba(0, 0, 0, ${blurIntensity * 0.3})`
            : 'rgba(250, 250, 248, 0.96)',
          backdropFilter: isScrolled || !isHome ? `blur(${20 + blurIntensity * 4}px) saturate(180%)` : `blur(${blurIntensity * 8}px)`,
          WebkitBackdropFilter: isScrolled || !isHome ? `blur(${20 + blurIntensity * 4}px) saturate(180%)` : `blur(${blurIntensity * 8}px)`,
          boxShadow: isScrolled ? '0 1px 0 rgba(212,175,55,0.08), 0 4px 24px rgba(0,0,0,0.04)' : 'none',
          transition: 'background 0.5s ease, box-shadow 0.5s ease',
        }}
      >
        <nav className="container-wide">
          {/* Taller nav for more spacious feel */}
          <div className="relative flex items-center justify-between h-[60px] md:h-[70px]">

            {/* Left: Hamburger (mobile) + Left nav links (desktop) */}
            <div className="flex items-center h-full">
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className={`xl:hidden min-h-[44px] min-w-[44px] flex items-center justify-center hover:text-gold transition-colors duration-300 -ml-3 ${useLightText ? 'text-white' : 'text-black/80'}`}
                aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileOpen}
              >
                <div className="w-[20px] h-3.5 flex flex-col justify-between">
                  <span className={`block h-px bg-current transition-all duration-500 origin-center ${
                    isMobileOpen ? 'rotate-45 translate-y-[6px]' : ''
                  }`} />
                  <span className={`block h-px bg-current transition-all duration-300 ${
                    isMobileOpen ? 'opacity-0 scale-x-0' : ''
                  }`} />
                  <span className={`block h-px bg-current transition-all duration-500 origin-center ${
                    isMobileOpen ? '-rotate-45 -translate-y-[6px]' : ''
                  }`} />
                </div>
              </button>

              <div className="hidden xl:flex items-center h-full">
                {leftLinks.map((link) => (
                  <NavLink key={link.href} {...link} active={checkActive(link.href)} lightText={useLightText} />
                ))}
              </div>
            </div>

            {/* Center: Logo */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 z-10"
            >
              <Image
                src="/aquador.webp"
                alt="Aquad'or"
                width={400}
                height={120}
                className="h-[120px] sm:h-[144px] xl:h-[132px] 2xl:h-[156px] w-auto object-contain transition-opacity duration-300"
                priority
              />
            </Link>

            {/* Right: Right nav links (desktop) + Icons */}
            <div className="flex items-center h-full">
              <div className="hidden xl:flex items-center h-full">
                {rightLinks.map((link) => (
                  <NavLink key={link.href} {...link} active={checkActive(link.href)} lightText={useLightText} />
                ))}
              </div>

              {/* Separator — desktop only */}
              <div className={`hidden xl:block w-px h-5 mx-4 ${useLightText ? 'bg-white/15' : 'bg-black/[0.07]'}`} />

              {/* Search toggle */}
              <button
                onClick={() => setIsSearchOpen(prev => !prev)}
                className={`min-h-[44px] min-w-[44px] flex items-center justify-center hover:text-gold transition-colors duration-300 ${useLightText ? 'text-white/80' : 'text-black/70'}`}
                aria-label={isSearchOpen ? 'Close search' : 'Open search'}
              >
                <AnimatePresence mode="wait">
                  {isSearchOpen ? (
                    <motion.div key="x" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.15 }}>
                      <X className="w-[17px] h-[17px]" />
                    </motion.div>
                  ) : (
                    <motion.div key="s" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.15 }}>
                      <Search className="w-[17px] h-[17px]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              <CartIcon className={useLightText ? 'text-white/80' : 'text-black/70'} />
            </div>
          </div>
        </nav>

        {/* Search panel */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-gold/10"
              style={{ background: 'rgba(250, 250, 248, 0.97)', backdropFilter: 'blur(24px)' }}
            >
              <div className="container-wide py-5">
                <div className="max-w-lg mx-auto">
                  <SearchBar variant="navbar" placeholder="Search our collection..." />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gold bottom border */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px z-0 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.25) 50%, transparent 100%)',
            opacity: isScrolled ? 1 : isHome ? blurIntensity * 0.6 : 1,
          }}
        />
      </motion.header>

      {/* Mobile full-screen overlay - Premium Edition */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 xl:hidden"
          >
            {/* Sophisticated layered background */}
            <div className="absolute inset-0 bg-[#FAFAF8]">
              {/* Gold ambient glow - top */}
              <motion.div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, transparent 70%)',
                  filter: 'blur(60px)',
                }}
              />
              {/* Subtle grid pattern overlay */}
              <div 
                className="absolute inset-0 opacity-[0.02]"
                style={{
                  backgroundImage: `linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)`,
                  backgroundSize: '60px 60px',
                }}
              />
            </div>

            <div className="relative h-full flex flex-col pt-[90px] pb-10 px-8 sm:px-12 overflow-y-auto">
              {/* Search with refined styling */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mb-12"
              >
                <SearchBar variant="shop" placeholder="Search fragrances..." />
              </motion.div>

              {/* Editorial Navigation */}
              <nav className="flex-1">
                <ul className="space-y-0">
                  {navLinks.map((link, i) => (
                    <motion.li
                      key={link.label}
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.12 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`group relative flex items-center gap-5 py-4 transition-all duration-500 ${
                          checkActive(link.href) ? 'text-gold' : 'text-black/50 active:text-gold'
                        }`}
                      >
                        {/* Animated indicator line */}
                        <motion.span 
                          className={`h-[1.5px] flex-shrink-0 transition-all duration-500 ${
                            checkActive(link.href) 
                              ? 'w-8 bg-gradient-to-r from-gold to-gold/50' 
                              : 'w-4 bg-black/10 group-active:w-8 group-active:bg-gold/50'
                          }`}
                        />
                        {/* Link text with hover effect */}
                        <span className="font-playfair text-[22px] sm:text-[26px] tracking-[0.04em] transition-all duration-300 group-active:translate-x-1">
                          {link.label}
                        </span>
                        {/* Subtle number index */}
                        <span className="ml-auto text-[9px] text-black/15 tracking-widest font-light">
                          0{i + 1}
                        </span>
                      </Link>
                      {/* Divider line */}
                      {i < navLinks.length - 1 && (
                        <motion.div 
                          className="h-px bg-gradient-to-r from-black/[0.04] via-black/[0.06] to-transparent"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.2 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                          style={{ transformOrigin: 'left' }}
                        />
                      )}
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Footer tagline with refined animation */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-auto pt-10 flex items-center gap-3"
              >
                <span className="w-8 h-px bg-gradient-to-r from-gold/40 to-transparent" />
                <p className="text-[8px] uppercase tracking-[0.4em] text-black/30 font-light">
                  Where Luxury Meets Distinction
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ label, href, active, lightText }: { label: string; href: string; active: boolean; lightText: boolean }) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!linkRef.current) return;
    const rect = linkRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
    setHoverPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setHoverPosition({ x: 0, y: 0 });
    setIsHovering(false);
  };

  return (
    <Link 
      ref={linkRef}
      href={href} 
      className="relative h-full flex items-center justify-center px-4 xl:px-5 group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.span 
        className={`text-[10.5px] xl:text-[11px] uppercase tracking-[0.16em] font-light transition-colors duration-300 whitespace-nowrap leading-none ${
          active ? 'text-gold' : lightText ? 'text-white/75 group-hover:text-white' : 'text-black/65 group-hover:text-black'
        }`}
        animate={{ 
          x: hoverPosition.x, 
          y: hoverPosition.y,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {label}
      </motion.span>
      {active ? (
        <motion.span
          layoutId="navActive"
          className="absolute bottom-0 left-4 right-4 xl:left-5 xl:right-5 h-[1.5px] bg-gradient-to-r from-gold/60 via-gold to-gold/60"
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        />
      ) : (
        <>
          <span className="absolute bottom-0 left-4 right-4 xl:left-5 xl:right-5 h-[1.5px] bg-gold/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] origin-left" />
          {/* Subtle gold glow on hover */}
          <motion.span 
            className="absolute inset-0 rounded-sm pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isHovering ? 1 : 0,
              background: lightText 
                ? 'radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, transparent 70%)'
                : 'radial-gradient(ellipse at center, rgba(212,175,55,0.04) 0%, transparent 70%)'
            }}
            transition={{ duration: 0.3 }}
          />
        </>
      )}
    </Link>
  );
}
