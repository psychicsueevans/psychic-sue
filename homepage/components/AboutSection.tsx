
import Icon from '@/components/ui/AppIcon';

const AboutSection = () => {
  const credentials = [
    {
      icon: 'AcademicCapIcon',
      title: '50+ Years Experience',
      description: 'Reading professionally since 1974'
    },
    {
      icon: 'UserGroupIcon',
      title: '5000+ Happy Clients',
      description: 'Trusted advisor across the UK and beyond'
    }
  ];

  const mediaLogos = [
    'BBC Featured',
    'Channel 4',
    'ITV',
    'Amazon Prime'
  ];

  return (
    <section className="relative bg-[#FFF8F0] py-16 lg:py-24">
      <div className="mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative w-full max-w-md mx-auto lg:max-w-none">
              {/* Simple Clean Photo Card */}
              <div className="relative bg-white rounded-2xl shadow-md p-2">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#FFF8F0] flex items-center justify-center">
                  <div className="text-center p-8">
                    <Icon
                      name="PhotoIcon"
                      size={64}
                      className="text-primary/40 mx-auto mb-4"
                    />
                    <p className="text-muted-foreground font-caption text-sm">
                      Sue's Photo
                      <br />
                      (Upload your real photo here)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 order-1 lg:order-2">
            <div>
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-caption text-sm font-medium mb-4">
                <Icon name="UserIcon" size={16} />
                <span>About Sue</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                I'm Sue. I've been doing this for 50 years.
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Started seeing spirit as a child. Been reading professionally since 1974. You might've seen me on the telly - BBC, Channel 4, Paul O'Grady's show.
                </p>
                <p>
                  But what matters is what I can see for you. I don't do fluffy. I tell you what's coming, when it'll happen, and what you need to do about it.
                </p>
              </div>
            </div>

            {/* Simple Stats Cards */}
            <div className="grid sm:grid-cols-2 gap-6">
              {credentials.map((credential, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-md"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Icon
                      name={credential.icon as any}
                      size={24}
                      className="text-primary"
                    />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">
                    {credential.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-caption">
                    {credential.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Simple Media Badges */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <p className="text-sm text-muted-foreground font-caption mb-3">
                As Seen On:
              </p>
              <div className="flex flex-wrap items-center gap-4">
                {mediaLogos.map((logo, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-[#FFF8F0] rounded-lg text-foreground font-semibold text-sm"
                  >
                    {logo}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;