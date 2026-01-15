'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Member {
  id: string;
  name: string;
  email: string;
  tier: 'Platinum' | 'Gold' | 'Silver';
  status: 'Active' | 'Expired' | 'Pending';
  joinDate: string;
  renewalDate: string;
  totalSpent: string;
}

const MemberManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const members: Member[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      tier: 'Platinum',
      status: 'Active',
      joinDate: '15/03/2025',
      renewalDate: '15/03/2026',
      totalSpent: '$1,850',
    },
    {
      id: '2',
      name: 'Emma Wilson',
      email: 'emma.w@example.com',
      tier: 'Gold',
      status: 'Active',
      joinDate: '22/04/2025',
      renewalDate: '22/04/2026',
      totalSpent: '$980',
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'michael.b@example.com',
      tier: 'Silver',
      status: 'Active',
      joinDate: '10/05/2025',
      renewalDate: '10/05/2026',
      totalSpent: '$540',
    },
    {
      id: '4',
      name: 'Lisa Anderson',
      email: 'lisa.a@example.com',
      tier: 'Platinum',
      status: 'Active',
      joinDate: '05/02/2025',
      renewalDate: '05/02/2026',
      totalSpent: '$2,100',
    },
    {
      id: '5',
      name: 'David Thompson',
      email: 'david.t@example.com',
      tier: 'Gold',
      status: 'Expired',
      joinDate: '18/01/2025',
      renewalDate: '18/01/2026',
      totalSpent: '$750',
    },
  ];

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = filterTier === 'all' || member.tier === filterTier;
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesTier && matchesStatus;
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Gold':
        return 'bg-accent/10 text-accent-foreground border-accent/20';
      case 'Silver':
        return 'bg-secondary/10 text-secondary-foreground border-secondary/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-success/10 text-success border-success/20';
      case 'Expired':
        return 'bg-error/10 text-error border-error/20';
      case 'Pending':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Member Directory</h2>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-muted-foreground">{filteredMembers.length} members</span>
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-250 active:scale-95">
              <Icon name="UserPlusIcon" size={18} />
              <span>Add Member</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Icon name="MagnifyingGlassIcon" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Tiers</option>
            <option value="Platinum">Platinum</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Member</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Tier</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Renewal Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Total Spent</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} className="border-b border-border hover:bg-muted/50 transition-all duration-250">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-foreground">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTierColor(member.tier)}`}>
                      {member.tier}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-foreground">{member.renewalDate}</td>
                  <td className="py-4 px-4 text-sm font-medium text-foreground">{member.totalSpent}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all duration-250">
                        <Icon name="PencilIcon" size={18} />
                      </button>
                      <button className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-all duration-250">
                        <Icon name="EyeIcon" size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MemberManagement;