import type { Metadata } from 'next';
import AuthNavigation from '@/components/common/AuthNavigation';
import MobileNavToggle from '@/components/common/MobileNavToggle';
import ContactInteractive from './components/ContactInteractive';

export const metadata: Metadata = {
  title: 'Contact - PsychicSue',
  description: 'Get in touch with Psychic Sue for spiritual guidance, book a reading, or inquire about The Psychic Circle membership.',
};

export default function ContactPage() {
  return (
    <AuthNavigation isAuthenticated={false}>
      <main className="min-h-screen bg-background pb-20 md:pb-0">
        <ContactInteractive />
      </main>
      <MobileNavToggle isAuthenticated={false} />
    </AuthNavigation>
  );
}