import Link from 'next/link';

interface FinalCTASectionProps {
  onBookReading: () => void;
  onJoinCircle: () => void;
}

const FinalCTASection = ({ onBookReading, onJoinCircle }: FinalCTASectionProps) => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      {/* Purple Gradient Background - Matching Hero */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800"></div>
      
      <div className="relative mx-auto px-6 w-full">
        <div className="max-w-4xl mx-auto text-center">
          {/* Heading */}
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-serif text-white leading-tight mb-6">
            Ready to Know What's Coming?
          </h2>
          
          {/* Subtext */}
          <p className="text-xl lg:text-2xl text-purple-100 mb-10">
            Stop wondering. Start knowing.
          </p>
          
          {/* Two Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Primary Button - Book a Reading */}
            <Link
              href="/services-booking"
              onClick={onBookReading}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-purple-900 font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Book a Reading
            </Link>
            
            {/* Secondary Button - Join The Circle */}
            <Link
              href="/the-psychic-circle-sales"
              onClick={onJoinCircle}
              className="w-full sm:w-auto bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold text-lg px-8 py-4 rounded-full transition-all duration-300"
            >
              Join The Circle
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;