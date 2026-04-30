'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { track } from '@vercel/analytics';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { LocationMap } from '@/components/ui/location-map';
import { PageHero } from '@/components/ui/Section';
import { fadeInLeft, fadeInRight, fadeInUp } from '@/lib/animations/scroll-animations';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  honeypot: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: <MapPin className="w-4 h-4 text-gold" />,
    title: 'Visit Us',
    details: ['Ledra 145, 1011', 'Nicosia, Cyprus'],
  },
  {
    icon: <Phone className="w-4 h-4 text-gold" />,
    title: 'Call Us',
    details: ['+357 99 980809'],
  },
  {
    icon: <Mail className="w-4 h-4 text-gold" />,
    title: 'Email Us',
    details: ['info@aquadorcy.com'],
  },
  {
    icon: <Clock className="w-4 h-4 text-gold" />,
    title: 'Hours',
    details: ['Mon–Sat: 10:00–20:00', 'Sun: 12:00–18:00'],
  },
];

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      track('contact_submitted', { subject: data.subject });

      setIsSubmitted(true);
      reset();
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gold-ambient-subtle">
      <PageHero
        title="Contact Us"
        subtitle="We'd love to hear from you. Get in touch with our team for consultations, orders, or any inquiries."
        eyebrow="Get In Touch"
      />

      <section className="section-lg">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-20">
            {/* Contact Form — takes 7 cols */}
            <motion.div
              className="lg:col-span-7"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInLeft}
            >
              <div className="relative bg-white border border-gold/10 p-8 md:p-10 lg:p-12 overflow-hidden">
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none">
                  <div className="absolute top-6 right-0 w-16 h-px bg-gradient-to-l from-gold/30 to-transparent" />
                  <div className="absolute top-0 right-6 w-px h-16 bg-gradient-to-b from-gold/30 to-transparent" />
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <p className="eyebrow text-gold/50">Send a Message</p>
                  <span className="flex-1 h-px bg-gradient-to-r from-gold/15 to-transparent" />
                </div>
                <h2 className="font-playfair text-2xl md:text-3xl text-black mb-10">How Can We Help?</h2>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <div className="w-16 h-16 bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-5">
                      <CheckCircle className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="font-playfair text-2xl text-black mb-3">Message Sent</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">We&apos;ll get back to you as soon as possible.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Honeypot field */}
                    <input
                      {...register('honeypot')}
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      className="absolute -left-[9999px] opacity-0 h-0 w-0"
                      aria-hidden="true"
                    />

                    {submitError && (
                      <div className="p-4 bg-red-50 border border-red-200">
                        <p className="text-red-600 text-sm">{submitError}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="contact-name" className="label-micro mb-2.5 block">Name *</label>
                        <input
                          {...register('name')}
                          id="contact-name"
                          type="text"
                          autoComplete="name"
                          className={`input-base py-3.5 ${errors.name ? 'border-red-400' : ''}`}
                          placeholder="Your name"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="label-micro mb-2.5 block">Email *</label>
                        <input
                          {...register('email')}
                          id="contact-email"
                          type="email"
                          autoComplete="email"
                          inputMode="email"
                          className={`input-base py-3.5 ${errors.email ? 'border-red-400' : ''}`}
                          placeholder="your@email.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-phone" className="label-micro mb-2.5 block">Phone (Optional)</label>
                      <input
                        {...register('phone')}
                        id="contact-phone"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        className="input-base py-3.5"
                        placeholder="+357 99 000000"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-subject" className="label-micro mb-2.5 block">Subject *</label>
                      <input
                        {...register('subject')}
                        id="contact-subject"
                        type="text"
                        className={`input-base py-3.5 ${errors.subject ? 'border-red-400' : ''}`}
                        placeholder="How can we help?"
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-xs mt-1.5">{errors.subject.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="label-micro mb-2.5 block">Message *</label>
                      <textarea
                        {...register('message')}
                        id="contact-message"
                        rows={6}
                        className={`input-base resize-none py-3.5 ${errors.message ? 'border-red-400' : ''}`}
                        placeholder="Tell us more about what you're looking for..."
                      />
                      {errors.message && (
                        <p className="text-red-500 text-xs mt-1.5">{errors.message.message}</p>
                      )}
                    </div>

                    <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Contact Info — takes 5 cols */}
            <motion.div
              className="lg:col-span-5 space-y-12"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInRight}
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <p className="eyebrow text-gold/50">Details</p>
                  <span className="flex-1 h-px bg-gradient-to-r from-gold/15 to-transparent" />
                </div>
                <h2 className="font-playfair text-2xl md:text-3xl text-black mb-8">Get in Touch</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  {contactInfo.map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true, margin: '-30px' }}
                      variants={fadeInUp}
                      transition={{ delay: index * 0.08 }}
                      className="group relative flex items-start gap-5 p-5 bg-white border border-gold/8 hover:border-gold/20 transition-all duration-500 overflow-hidden"
                    >
                      {/* Subtle hover glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-gold/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative w-10 h-10 flex-shrink-0 bg-gold/5 border border-gold/15 flex items-center justify-center group-hover:border-gold/30 transition-all duration-500">
                        {item.icon}
                      </div>
                      <div className="relative">
                        <h3 className="text-black font-medium text-sm mb-1.5 tracking-wide">{item.title}</h3>
                        {item.details.map((detail, i) => (
                          <p key={i} className="text-gray-500 text-[13px] leading-relaxed">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Map */}
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: '-30px' }}
                variants={fadeInUp}
                transition={{ delay: 0.35 }}
                className="flex items-center justify-center py-6"
              >
                <LocationMap
                  location="Nicosia, Cyprus"
                  coordinates="35.1753° N, 33.3619° E"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
