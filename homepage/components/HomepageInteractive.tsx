'use client';

import { useRouter } from 'next/navigation';
import HeroSection from './HeroSection';
import HowICanHelpSection from './HowICanHelpSection';
import TrustBadges from './TrustBadges';
import ServicesShowcase from './ServicesShowcase';
import AboutSection from './AboutSection';
import PsychicCircleSection from './PsychicCircleSection';
import FinalCTASection from './FinalCTASection';
import Footer from './Footer';

const HomepageInteractive = () => {
  const router = useRouter();

  const handleJoinCircle = () => {
    router.push('/the-psychic-circle-sales');
  };

  const handleBookReading = () => {
    router.push('/services-booking');
  };

  const handleBookService = (serviceId: number) => {
    router.push(`/services-booking?service=${serviceId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        onJoinCircle={handleJoinCircle}
        onBookReading={handleBookReading}
      />
      <HowICanHelpSection />
      <ServicesShowcase onBookService={handleBookService} />
      <AboutSection />
      <TrustBadges />
      <PsychicCircleSection onJoinCircle={handleJoinCircle} />
      <FinalCTASection 
        onBookReading={handleBookReading}
        onJoinCircle={handleJoinCircle}
      />
      <Footer />
    </div>
  );
};

export default HomepageInteractive;