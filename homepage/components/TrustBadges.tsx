import Icon from '@/components/ui/AppIcon';

const TrustBadges = () => {
  const testimonialSnippets = [
    {
      text: 'A very detailed reading; she addresses the questions very precisely and comprehensively. Thank you again for this wonderful reading!',
      author: 'Petra',
      rating: 5,
    },
    {
      text: 'I appreciate Sue\'s thoughtful and detailed reading. This was my second one from her over the course of the year and I will definitely reach out again.',
      author: 'Jackie',
      rating: 5,
    },
    {
      text: 'Worth the wait! The future is never guaranteed but Sue always gives enough insight that you know she\'s connected to you well and is sharing the truth in this moment. Don\'t take for granted the advice she shares! A repeat customer for a reason.',
      author: 'zeejay04',
      rating: 5,
    },
    {
      text: 'She is so amazing and helpful. You can tell right away she has a wonderful and kind spirit and I felt connected to her right away. She\'s a fantastic reader I\'m definitely going to be a repeat customer.',
      author: 'kaylee630',
      rating: 5,
    },
  ];

  return (
    <section className="bg-card border-y border-border py-12 lg:py-16">
      <div className="mx-auto px-6 max-w-7xl">
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8 lg:p-12">
          <h3 className="text-2xl lg:text-3xl font-bold text-center text-foreground mb-8">
            What My Clients Say
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonialSnippets?.map((testimonial, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 shadow-sm border border-border flex flex-col h-full"
              >
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(testimonial?.rating)]?.map((_, i) => (
                    <Icon
                      key={i}
                      name="StarIcon"
                      size={18}
                      variant="solid"
                      className="text-warning"
                    />
                  ))}
                </div>
                <p className="text-foreground mb-4 leading-relaxed flex-grow">
                  "{testimonial?.text}"
                </p>
                <p className="text-sm font-semibold text-primary font-caption">
                  — {testimonial?.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;