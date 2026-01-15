import Icon from '@/components/ui/AppIcon';

interface ContactHeroProps {
  responseTime: string;
}

const ContactHero = ({ responseTime }: ContactHeroProps) => {
  return (
    <section className="bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5 py-16 lg:py-20">
      <div className="mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Icon name="ClockIcon" size={20} variant="solid" />
            <span className="caption font-medium">Response within {responseTime}</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Get in Touch with Sue
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            Whether you're seeking guidance, have questions about services, or wish to book a reading, I'm here to help. Choose your preferred method of contact below.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;