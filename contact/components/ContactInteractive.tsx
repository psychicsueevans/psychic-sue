'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
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
    
    // Simulate sending email
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 5000);
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen">
        <div className="relative overflow-hidden py-20 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(139,92,246,0.4),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.4),transparent_50%)]" />
          </div>
          <div className="relative mx-auto px-6 max-w-4xl text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-white/20 rounded w-1/2 mx-auto"></div>
              <div className="h-6 bg-white/20 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden py-20 lg:py-24">
        {/* Mystical Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(139,92,246,0.4),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.4),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(168,85,247,0.3),transparent_50%)]" />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/85 via-indigo-900/80 to-purple-800/85"></div>
        </div>

        {/* Header Content */}
        <div className="relative mx-auto px-6 max-w-4xl text-center">
          <h1 className="text-5xl lg:text-6xl font-serif text-white leading-tight mb-4">
            Get In Touch
          </h1>
          <p className="text-xl text-purple-100 leading-relaxed">
            We'd love to hear from you
          </p>
        </div>
      </section>

      {/* Email Card Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="mx-auto px-6 max-w-2xl">
          <div className="bg-white rounded-2xl p-8 lg:p-10 border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              {/* Envelope Icon */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mb-6 shadow-lg">
                <Icon name="EnvelopeIcon" size={32} className="text-white" variant="solid" />
              </div>
              
              {/* Email Address */}
              <h3 className="text-2xl font-bold text-purple-900 mb-3">
                Email Us
              </h3>
              <a 
                href="mailto:psychicsueevans@gmail.com"
                className="text-lg text-purple-600 hover:text-purple-700 font-medium mb-6 transition-colors duration-200"
              >
                psychicsueevans@gmail.com
              </a>
              
              {/* Response Time */}
              <div className="flex items-center space-x-2 text-gray-600">
                <Icon name="ClockIcon" size={20} />
                <span className="text-sm">
                  We typically respond within 24-48 hours
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="mx-auto px-6 max-w-2xl">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 lg:p-10 border border-purple-200 shadow-lg">
            {/* Success Message */}
            {submitSuccess && (
              <div className="mb-8 p-5 bg-green-50 border-2 border-green-400 rounded-xl flex items-start space-x-3">
                <Icon name="CheckCircleIcon" size={24} className="text-green-600 flex-shrink-0 mt-0.5" variant="solid" />
                <div>
                  <h4 className="font-semibold text-green-800 mb-1">Message Sent Successfully!</h4>
                  <p className="text-sm text-green-700">
                    Thank you for reaching out. We'll get back to you within 24-48 hours.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-purple-900 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
                  placeholder="Your full name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-purple-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Subject Dropdown */}
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-purple-900 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Enquiry</option>
                  <option value="reading">Reading Question</option>
                  <option value="membership">Membership Support</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Message Textarea */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-purple-900 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
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
    </div>
  );
};

export default ContactInteractive;