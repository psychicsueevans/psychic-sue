import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

interface HeroSectionProps {
  onJoinCircle: () => void;
  onBookReading: () => void;
}

const HeroSection = ({ onJoinCircle, onBookReading }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden min-h-[700px] flex items-center">
      {/* Mystical Background with Gradient Pattern */}
      <div className="absolute inset-0">
        {/* Gradient background with mystical radial patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(139,92,246,0.4),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.4),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(168,85,247,0.3),transparent_50%)]" />
          </div>
        </div>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/85 via-indigo-900/80 to-purple-800/85"></div>
      </div>

      <div className="relative mx-auto px-6 py-20 lg:py-28 w-full">
        <div className="max-w-6xl mx-auto">
          {/* Main Content - Flex Layout: Text Left, Photo Right */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Side - Text Content */}
            <div className="flex-1 max-w-3xl">
              {/* Top Badge - Featured on BBC & Channel 4 */}
              <div className="inline-flex items-center space-x-2 border-2 border-amber-400 rounded-full px-4 py-2 mb-8">
                <Icon name="SparklesIcon" size={16} variant="solid" className="text-amber-400" />
                <span className="text-sm font-semibold text-amber-400 tracking-wide">
                  Featured on BBC & Channel 4
                </span>
              </div>

              {/* Headline - Large Serif Font */}
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-serif text-white leading-tight mb-6">
                Step Inside the World of Psychic Sue
              </h1>

              {/* Subtext */}
              <p className="text-lg lg:text-xl text-purple-100 leading-relaxed mb-10 max-w-2xl">
                Discover guidance, clarity, and spiritual connection from one of the UK's most experienced tarot readers.
              </p>

              {/* Two Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/services-booking"
                  className="group flex items-center justify-center space-x-2 bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-xl hover:shadow-2xl hover:bg-purple-700 transition-all duration-300"
                >
                  <span>Get A Reading</span>
                  <Icon
                    name="ArrowRightIcon"
                    size={20}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </Link>

                <Link
                  href="/the-psychic-circle-sales"
                  className="flex items-center justify-center space-x-2 bg-transparent text-white border-2 border-amber-400 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-400 hover:text-purple-900 transition-all duration-300"
                >
                  <span>Enter The Psychic Circle</span>
                </Link>
              </div>
            </div>

            {/* Right Side - Circular Photo Placeholder */}
            <div className="flex-shrink-0 hidden lg:block">
              <div className="relative">
                {/* Circular Photo Container */}
                <div className="w-[280px] h-[280px] rounded-full border-4 border-amber-400/60 shadow-2xl flex items-center justify-center bg-gradient-to-br from-purple-800/40 to-indigo-900/40 backdrop-blur-sm">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl"></div>
                  
                  {/* Placeholder Content */}
                  <div className="relative z-10 flex flex-col items-center justify-center text-center">
                    <Icon name="UserCircleIcon" size={80} className="text-amber-400/70 mb-3" />
                    <span className="text-white/90 font-semibold text-lg">Sue's Photo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Review Card - Bottom Right */}
          <div className="absolute bottom-8 right-8 hidden lg:block">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-xs">
              <div className="text-center mb-3">
                <div className="text-5xl font-bold text-purple-900 mb-1">5,000+</div>
                <div className="text-lg font-semibold text-gray-700">Five-Star Reviews</div>
              </div>
              
              {/* Gold Stars */}
              <div className="flex justify-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icon
                    key={star}
                    name="StarIcon"
                    size={24}
                    variant="solid"
                    className="text-amber-400"
                  />
                ))}
              </div>

              {/* As Seen On */}
              <div className="border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-600 text-center mb-2">As seen on:</div>
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-lg font-bold text-gray-800">BBC</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-lg font-bold text-gray-800">Channel 4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;