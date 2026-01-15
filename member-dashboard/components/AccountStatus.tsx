'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Benefit {
  id: number;
  title: string;
  description: string;
  icon: string;
  active: boolean;
}

interface AccountStatusProps {
  membershipTier: string;
  renewalDate: string;
  paymentMethod: string;
  benefits: Benefit[];
}

const AccountStatus = ({ membershipTier, renewalDate, paymentMethod, benefits }: AccountStatusProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
        <h2 className="text-2xl font-bold text-foreground mb-4">Account Status</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <h2 className="text-2xl font-bold text-foreground mb-6">Account Status</h2>

      <div className="space-y-6">
        <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Current Plan</h3>
              <p className="text-2xl font-bold text-primary">{membershipTier} Membership</p>
            </div>
            <Icon name="StarIcon" size={32} className="text-primary" variant="solid" />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Renewal Date</p>
              <p className="font-medium text-foreground">{renewalDate}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Payment Method</p>
              <p className="font-medium text-foreground">{paymentMethod}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-3">Your Benefits</h3>
          <div className="space-y-2">
            {benefits.map((benefit) => (
              <div
                key={benefit.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-250 ${
                  benefit.active
                    ? 'bg-success/10 border-success/20' :'bg-muted/50 border-border opacity-60'
                }`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
                    benefit.active ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <Icon name={benefit.icon as any} size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground text-sm">{benefit.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{benefit.description}</p>
                </div>
                {benefit.active && (
                  <Icon name="CheckCircleIcon" size={20} className="text-success flex-shrink-0" variant="solid" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:shadow-md hover:-translate-y-0.5 transition-all duration-250 active:scale-95">
            View Payment History
          </button>
          <button className="flex-1 px-4 py-3 border border-border rounded-lg font-medium text-foreground hover:bg-muted hover:border-primary/30 transition-all duration-250">
            Manage Subscription
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountStatus;