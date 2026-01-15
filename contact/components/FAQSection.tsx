'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

const FAQSection = ({ faqs }: FAQSectionProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const toggleFAQ = (id: string) => {
    if (!isHydrated) return;
    setOpenFAQ(openFAQ === id ? null : id);
  };

  if (!isHydrated) {
    return (
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="mx-auto px-6 max-w-4xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3 mx-auto"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-card rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-16 bg-muted/30">
      <div className="mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Quick answers to common inquiries about services and bookings
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-card rounded-lg border border-border overflow-hidden transition-all duration-250 hover:shadow-md"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-5 flex items-center justify-between text-left transition-all duration-250 hover:bg-muted/50"
              >
                <div className="flex-1 pr-4">
                  <span className="caption text-primary font-medium mb-1 block">
                    {faq.category}
                  </span>
                  <h3 className="font-semibold text-foreground">
                    {faq.question}
                  </h3>
                </div>
                <Icon
                  name="ChevronDownIcon"
                  size={24}
                  className={`text-muted-foreground flex-shrink-0 transition-transform duration-250 ${
                    openFAQ === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-250 ${
                  openFAQ === faq.id ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 bg-primary/5 border border-primary/20 rounded-lg text-center">
          <h3 className="font-bold text-foreground mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-4">
            Don't hesitate to reach out directly. I'm here to help with any inquiries.
          </p>
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-250 active:scale-95 inline-flex items-center space-x-2">
            <Icon name="ChatBubbleLeftRightIcon" size={20} />
            <span>Ask a Question</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;