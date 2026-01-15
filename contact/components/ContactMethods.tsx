import Icon from '@/components/ui/AppIcon';

interface ContactMethod {
  id: string;
  icon: string;
  title: string;
  description: string;
  value: string;
  action: string;
  availability: string;
  isPrimary: boolean;
}

interface ContactMethodsProps {
  methods: ContactMethod[];
}

const ContactMethods = ({ methods }: ContactMethodsProps) => {
  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto px-6 max-w-7xl">
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-center mb-12">
          Contact Methods
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {methods.map((method) => (
            <div
              key={method.id}
              className={`bg-card rounded-xl p-8 border transition-all duration-250 hover:shadow-lg hover:-translate-y-1 ${
                method.isPrimary
                  ? 'border-primary shadow-md'
                  : 'border-border'
              }`}
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-6 ${
                method.isPrimary
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}>
                <Icon name={method.icon as any} size={28} variant="solid" />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3">
                {method.title}
              </h3>
              
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {method.description}
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2 text-foreground font-medium">
                  <Icon name="CheckCircleIcon" size={20} className="text-success" />
                  <span className="data-text text-sm">{method.value}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-muted-foreground caption">
                  <Icon name="ClockIcon" size={18} />
                  <span>{method.availability}</span>
                </div>
              </div>
              
              <button className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-250 hover:shadow-md active:scale-95 ${
                method.isPrimary
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
              }`}>
                {method.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactMethods;