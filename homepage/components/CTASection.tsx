import Icon from '@/components/ui/AppIcon';

interface CTASectionProps {
  onJoinCircle: () => void;
}

const CTASection = ({ onJoinCircle }: CTASectionProps) => {
  return (
    <section className="bg-gradient-to-br from-primary via-primary to-accent py-16 lg:py-24">
      <div className="mx-auto px-6 max-w-4xl text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-primary-foreground/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon
              name="SparklesIcon"
              size={40}
              variant="solid"
              className="text-primary-foreground"
            />
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-primary-foreground mb-6">
            Join The Psychic Circle Today
          </h2>
          <p className="text-xl text-primary-foreground/90 leading-relaxed max-w-2xl mx-auto mb-4">
            Become part of an exclusive community receiving monthly readings, spiritual courses, and direct access to Sue's guidance.
          </p>
          <p className="text-lg text-primary-foreground/80 font-caption">
            Limited spaces available — Launching January 15th, 2026
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={onJoinCircle}
            className="group flex items-center justify-center space-x-2 bg-primary-foreground text-primary px-10 py-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-250 active:scale-95"
          >
            <span>Secure Your Spot Now</span>
            <Icon
              name="ArrowRightIcon"
              size={24}
              className="group-hover:translate-x-1 transition-transform duration-250"
            />
          </button>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/20">
            <div className="text-3xl font-bold text-primary-foreground mb-2">
              $29.99
            </div>
            <p className="text-primary-foreground/80 font-caption">
              Monthly Membership
            </p>
          </div>
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/20">
            <div className="text-3xl font-bold text-primary-foreground mb-2">
              8 Modules
            </div>
            <p className="text-primary-foreground/80 font-caption">
              Spiritual Course Access
            </p>
          </div>
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/20">
            <div className="text-3xl font-bold text-primary-foreground mb-2">
              Priority
            </div>
            <p className="text-primary-foreground/80 font-caption">
              Booking Access
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;