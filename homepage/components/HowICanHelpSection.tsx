import Icon from '@/components/ui/AppIcon';

const HowICanHelpSection = () => {
  const helpCards = [
    {
      id: 1,
      icon: 'HeartIcon',
      title: 'LOVE & RELATIONSHIPS',
      description: 'Insight into their true feelings, intentions, and where the connection is heading.',
    },
    {
      id: 2,
      icon: 'SparklesIcon',
      title: 'FUTURE GUIDANCE',
      description: 'See what\'s coming next so you can move forward with confidence instead of fear.',
    },
    {
      id: 3,
      icon: 'MapIcon',
      title: 'LIFE PATH & PURPOSE',
      description: 'Find direction when you\'re feeling lost, stuck, or unsure which way to turn.',
    },
    {
      id: 4,
      icon: 'AcademicCapIcon',
      title: 'PSYCHIC DEVELOPMENT',
      description: 'Learn to read the cards, trust your intuition, and develop your natural abilities.',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif text-purple-900 mb-6">
            Guidance When You Need It Most
          </h2>
          <p className="text-lg lg:text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
            After 50 years of reading for people from all walks of life, I've learned that most of us come to tarot for the same reasons — we're looking for answers, for reassurance, or simply for someone who truly sees us.
          </p>
        </div>

        {/* Four Cards in a Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {helpCards?.map((card) => (
            <div
              key={card?.id}
              className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-shadow duration-300 border border-purple-100"
            >
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                  <Icon
                    name={card?.icon}
                    size={32}
                    variant="outline"
                    className="text-purple-600"
                  />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold tracking-wider text-purple-900 mb-4 text-center">
                {card?.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed text-center text-sm">
                {card?.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowICanHelpSection;