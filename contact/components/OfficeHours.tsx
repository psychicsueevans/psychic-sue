import Icon from '@/components/ui/AppIcon';

interface OfficeDay {
  day: string;
  hours: string;
  isToday: boolean;
}

interface OfficeHoursProps {
  schedule: OfficeDay[];
  timezone: string;
  emergencyNote: string;
}

const OfficeHours = ({ schedule, timezone, emergencyNote }: OfficeHoursProps) => {
  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto px-6 max-w-4xl">
        <div className="bg-card rounded-xl p-8 lg:p-10 border border-border shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Office Hours
            </h2>
            <p className="text-muted-foreground flex items-center justify-center space-x-2">
              <Icon name="ClockIcon" size={20} />
              <span>All times in {timezone}</span>
            </p>
          </div>

          <div className="space-y-3 mb-8">
            {schedule.map((item) => (
              <div
                key={item.day}
                className={`flex items-center justify-between p-4 rounded-lg transition-all duration-250 ${
                  item.isToday
                    ? 'bg-primary/10 border border-primary/20' :'bg-muted/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.isToday && (
                    <Icon name="CheckCircleIcon" size={20} className="text-primary" variant="solid" />
                  )}
                  <span className={`font-medium ${item.isToday ? 'text-primary' : 'text-foreground'}`}>
                    {item.day}
                  </span>
                </div>
                <span className={`data-text ${item.isToday ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                  {item.hours}
                </span>
              </div>
            ))}
          </div>

          <div className="p-5 bg-warning/10 border border-warning/30 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="ExclamationTriangleIcon" size={24} className="text-warning flex-shrink-0 mt-0.5" variant="solid" />
              <div>
                <h4 className="font-semibold text-warning mb-2">Emergency Inquiries</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {emergencyNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfficeHours;