'use client';

import Icon from '@/components/ui/AppIcon';

const MetricsOverview = () => {
  const metrics = [
    {
      id: 1,
      title: 'Active Members',
      value: '247',
      change: '+12%',
      trend: 'up',
      icon: 'UsersIcon',
      color: 'primary',
    },
    {
      id: 2,
      title: 'Monthly Revenue',
      value: '$18,450',
      change: '+8%',
      trend: 'up',
      icon: 'CurrencyPoundIcon',
      color: 'success',
    },
    {
      id: 3,
      title: 'Pending Bookings',
      value: '23',
      change: '+5',
      trend: 'up',
      icon: 'CalendarIcon',
      color: 'warning',
    },
    {
      id: 4,
      title: 'Course Completions',
      value: '89',
      change: '+15%',
      trend: 'up',
      icon: 'AcademicCapIcon',
      color: 'accent',
    },
  ];

  const recentActivity = [
    { id: 1, type: 'member', message: 'New member joined: Sarah Johnson', time: '5 minutes ago' },
    { id: 2, type: 'booking', message: 'Deep Dive Reading booked by Emma Wilson', time: '12 minutes ago' },
    { id: 3, type: 'payment', message: 'Payment received: $150 from Michael Brown', time: '1 hour ago' },
    { id: 4, type: 'course', message: 'Module 4 completed by Lisa Anderson', time: '2 hours ago' },
    { id: 5, type: 'member', message: 'Subscription renewed: David Thompson', time: '3 hours ago' },
  ];

  const subscriptionBreakdown = [
    { tier: 'Platinum', count: 45, percentage: 18, color: 'bg-primary' },
    { tier: 'Gold', count: 98, percentage: 40, color: 'bg-accent' },
    { tier: 'Silver', count: 104, percentage: 42, color: 'bg-secondary' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.id} className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all duration-250">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center justify-center w-12 h-12 bg-${metric.color}/10 rounded-lg`}>
                <Icon name={metric.icon as any} size={24} className={`text-${metric.color}`} />
              </div>
              <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-success' : 'text-error'}`}>
                {metric.change}
              </span>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">{metric.title}</h3>
            <p className="text-3xl font-bold text-foreground">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Icon name="ClockIcon" size={24} className="text-primary" />
            <span>Recent Activity</span>
          </h2>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-all duration-250">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full flex-shrink-0 mt-0.5">
                  <Icon
                    name={
                      activity.type === 'member' ?'UserPlusIcon'
                        : activity.type === 'booking' ?'CalendarIcon'
                        : activity.type === 'payment' ?'CurrencyPoundIcon' :'AcademicCapIcon'
                    }
                    size={16}
                    className="text-primary"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Icon name="ChartPieIcon" size={24} className="text-primary" />
            <span>Subscription Breakdown</span>
          </h2>
          <div className="space-y-4">
            {subscriptionBreakdown.map((tier) => (
              <div key={tier.tier}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{tier.tier}</span>
                  <span className="text-sm text-muted-foreground">{tier.count} members ({tier.percentage}%)</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${tier.color} transition-all duration-500`} style={{ width: `${tier.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-primary/5 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Total Active Subscriptions</span>
              <span className="text-2xl font-bold text-primary">247</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsOverview;