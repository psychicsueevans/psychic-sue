'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FormData {
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  preferredContact: string;
  message: string;
}

interface InquiryType {
  value: string;
  label: string;
}

interface ContactFormSectionProps {
  inquiryTypes: InquiryType[];
}

const ContactFormSection = ({ inquiryTypes }: ContactFormSectionProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    preferredContact: 'email',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!isHydrated) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isHydrated) return;
    
    setIsSubmitting(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      inquiryType: '',
      preferredContact: 'email',
      message: '',
    });
    
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 5000);
  };

  if (!isHydrated) {
    return (
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="mx-auto px-6 max-w-4xl">
          <div className="bg-card rounded-xl p-8 lg:p-12 border border-border shadow-sm">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
              <div className="space-y-4">
                <div className="h-12 bg-muted rounded"></div>
                <div className="h-12 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-16 bg-muted/30">
      <div className="mx-auto px-6 max-w-4xl">
        <div className="bg-card rounded-xl p-8 lg:p-12 border border-border shadow-sm">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Send a Message
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Fill out the form below and I'll get back to you within 24 hours
            </p>
          </div>

          {submitSuccess && (
            <div className="mb-8 p-4 bg-success/10 border border-success rounded-lg flex items-start space-x-3">
              <Icon name="CheckCircleIcon" size={24} className="text-success flex-shrink-0 mt-0.5" variant="solid" />
              <div>
                <h4 className="font-semibold text-success mb-1">Message Sent Successfully!</h4>
                <p className="text-sm text-success/80">
                  Thank you for reaching out. I'll respond to your inquiry within 24 hours.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block caption font-medium text-foreground mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-250"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block caption font-medium text-foreground mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-250"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block caption font-medium text-foreground mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-250"
                  placeholder="+44 7XXX XXXXXX"
                />
              </div>

              <div>
                <label htmlFor="inquiryType" className="block caption font-medium text-foreground mb-2">
                  Inquiry Type *
                </label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-250"
                >
                  <option value="">Select inquiry type</option>
                  {inquiryTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block caption font-medium text-foreground mb-3">
                Preferred Contact Method *
              </label>
              <div className="flex flex-wrap gap-4">
                {['email', 'phone', 'whatsapp'].map((method) => (
                  <label
                    key={method}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="preferredContact"
                      value={method}
                      checked={formData.preferredContact === method}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary focus:ring-2 focus:ring-ring"
                    />
                    <span className="text-foreground capitalize">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block caption font-medium text-foreground mb-2">
                Your Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-250 resize-none"
                placeholder="Tell me about your inquiry or what guidance you're seeking..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-250 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Icon name="PaperAirplaneIcon" size={20} />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;