import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

interface TarotCard {
  id: number;
  romanNumeral: string;
  title: string;
  subtitle: string;
  price: string;
  priceSubtext?: string;
  buttonText: string;
  buttonLink: string;
  featured: boolean;
}

const ServicesShowcase = () => {
  const tarotCards: TarotCard[] = [
    {
      id: 1,
      romanNumeral: 'XVII',
      title: 'THE STAR',
      subtitle: 'Personal tarot readings for clarity and guidance on your path',
      price: 'From $20',
      buttonText: 'View Readings',
      buttonLink: '/services-booking',
      featured: false,
    },
    {
      id: 2,
      romanNumeral: 'III',
      title: 'THE EMPRESS',
      subtitle: 'Join the Circle for monthly guidance & spiritual growth',
      price: 'From $35',
      priceSubtext: '/month',
      buttonText: 'Join The Circle',
      buttonLink: '/the-psychic-circle-sales',
      featured: true,
    },
    {
      id: 3,
      romanNumeral: 'II',
      title: 'HIGH PRIESTESS',
      subtitle: 'Speak directly with Sue for in-depth personal guidance',
      price: 'From $100',
      buttonText: 'Book A Call',
      buttonLink: '/services-booking',
      featured: false,
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-[#1a0b2e] via-[#2d1b4e] to-[#1a0b2e] py-20 lg:py-28">
      {/* Mystical background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)'
        }} />
      </div>

      <div className="relative mx-auto px-6 max-w-7xl">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#f5f1e8] mb-4">
            Choose Your Path
          </h2>
        </div>

        {/* Tarot Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {tarotCards.map((card) => (
            <div
              key={card.id}
              className={`relative bg-gradient-to-b from-[#1a0b2e] to-[#0f0520] rounded-lg p-8 border-2 transition-all duration-300 hover:shadow-2xl hover:shadow-[#d4af37]/20 hover:-translate-y-2 ${
                card.featured
                  ? 'border-[#d4af37] shadow-xl shadow-[#d4af37]/30 scale-105'
                  : 'border-[#d4af37]/40 hover:border-[#d4af37]'
              }`}
              style={{
                boxShadow: card.featured ? '0 0 40px rgba(212, 175, 55, 0.3)' : 'none'
              }}
            >
              {/* Most Popular Badge */}
              {card.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-[#d4af37] text-[#1a0b2e] px-6 py-2 rounded-full font-bold text-sm shadow-lg uppercase tracking-wide">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Roman Numeral */}
              <div className="text-center mb-6">
                <div className="text-[#d4af37] text-2xl font-serif font-bold tracking-widest mb-4">
                  {card.romanNumeral}
                </div>

                {/* Title with decorative stars */}
                <h3 className="text-2xl font-serif font-bold text-[#f5f1e8] mb-2 flex items-center justify-center gap-2">
                  <span className="text-[#d4af37] text-lg">✦</span>
                  {card.title}
                  <span className="text-[#d4af37] text-lg">✦</span>
                </h3>
              </div>

              {/* Subtitle */}
              <p className="text-[#f5f1e8]/80 text-center mb-8 leading-relaxed min-h-[60px]">
                {card.subtitle}
              </p>

              {/* Price */}
              <div className="text-center mb-8">
                <div className="text-4xl font-serif font-bold text-[#d4af37] mb-2">
                  {card.price}
                  {card.priceSubtext && (
                    <span className="text-lg text-[#f5f1e8]/60 ml-1">
                      {card.priceSubtext}
                    </span>
                  )}
                </div>
              </div>

              {/* Button */}
              <Link href={card.buttonLink}>
                <button
                  className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 active:scale-95 ${
                    card.featured
                      ? 'bg-[#d4af37] text-[#1a0b2e] hover:bg-[#f5d76e] hover:shadow-lg hover:shadow-[#d4af37]/50'
                      : 'bg-transparent text-[#d4af37] border-2 border-[#d4af37] hover:bg-[#d4af37] hover:text-[#1a0b2e]'
                  }`}
                >
                  {card.buttonText}
                </button>
              </Link>

              {/* Decorative corner elements */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#d4af37]/30" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#d4af37]/30" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#d4af37]/30" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#d4af37]/30" />
            </div>
          ))}
        </div>

        {/* View All Services Link */}
        <div className="text-center">
          <Link
            href="/services-booking"
            className="inline-flex items-center space-x-2 text-[#d4af37] font-semibold hover:text-[#f5d76e] transition-colors duration-300 text-lg group"
          >
            <span>View All Services</span>
            <Icon
              name="ArrowRightIcon"
              size={20}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesShowcase;