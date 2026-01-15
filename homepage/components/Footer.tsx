'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const footerLinks = {
    services: [
      { label: 'Quick Insight Reading', path: '/services-booking' },
      { label: 'In-Depth Reading', path: '/services-booking' },
      { label: 'Premium Life Reading', path: '/services-booking' },
      { label: 'The Psychic Circle', path: '/the-psychic-circle-sales' },
    ],
    company: [
      { label: 'About Sue', path: '/homepage' },
      { label: 'Testimonials', path: '/homepage' },
      { label: 'Contact', path: '/contact' },
      { label: 'Member Dashboard', path: '/member-dashboard' },
    ],
    legal: [
      { label: 'Privacy Policy', path: '/homepage' },
      { label: 'Terms of Service', path: '/homepage' },
      { label: 'Cookie Policy', path: '/homepage' },
      { label: 'GDPR Compliance', path: '/homepage' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: 'ShareIcon', url: '#' },
    { name: 'Instagram', icon: 'CameraIcon', url: '#' },
    { name: 'Twitter', icon: 'ChatBubbleLeftIcon', url: '#' },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="mx-auto px-6 py-12 lg:py-16 max-w-7xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <svg
                width="120"
                height="32"
                viewBox="0 0 120 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="16" cy="16" r="14" fill="var(--color-primary)" opacity="0.1" />
                <circle cx="16" cy="16" r="9" fill="var(--color-primary)" opacity="0.2" />
                <circle cx="16" cy="16" r="5" fill="var(--color-primary)" />
                <path
                  d="M16 6L18 12H24L19 16L21 22L16 18L11 22L13 16L8 12H14L16 6Z"
                  fill="var(--color-accent)"
                />
                <text
                  x="36"
                  y="21"
                  fontFamily="Crimson Text, serif"
                  fontSize="16"
                  fontWeight="600"
                  fill="var(--color-primary)"
                >
                  PsychicSue
                </text>
              </svg>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Over 50 years of spiritual guidance and tarot expertise. Featured on BBC and Channel 4.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-250"
                  aria-label={social.name}
                >
                  <Icon name={social.icon as any} size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors duration-250 font-caption"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors duration-250 font-caption"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors duration-250 font-caption"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm font-caption">
              {currentYear !== null ? `© ${currentYear}` : '©'} PsychicSue. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="ShieldCheckIcon" size={16} className="text-success" />
                <span className="font-caption">SSL Secured</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="LockClosedIcon" size={16} className="text-success" />
                <span className="font-caption">GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;