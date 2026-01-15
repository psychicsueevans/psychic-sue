import type { Metadata } from 'next';
import AuthNavigation from '@/components/common/AuthNavigation';
import MobileNavToggle from '@/components/common/MobileNavToggle';
import HomepageInteractive from './components/HomepageInteractive';

export const metadata: Metadata = {
  title: 'Psychic Sue - 50+ Years of Spiritual Guidance | Professional Tarot Readings',
  description: 'Trusted psychic advisor featured on BBC and Channel 4. Experience profound tarot readings with over 50 years of expertise. Join The Psychic Circle exclusive membership launching January 15th, 2026.',
};

export default function Homepage() {
  return (
    <AuthNavigation isAuthenticated={false}>
      <HomepageInteractive />
      <MobileNavToggle isAuthenticated={false} />
    </AuthNavigation>
  );
}