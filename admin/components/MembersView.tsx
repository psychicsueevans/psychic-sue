'use client';

import React, { useState, useEffect } from 'react';
import { memberService } from '@/services/memberService';
import type { Member, MembershipTier, InsertMember, UpdateMember } from '@/types/admin.types';

export default function MembersView() {
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, circle: 0, vip: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterTier, setFilterTier] = useState<MembershipTier | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const [memberForm, setMemberForm] = useState<InsertMember>({
    full_name: '',
    email: '',
    membership_tier: 'circle_member',
    membership_start_date: new Date().toISOString().slice(0, 10),
    membership_end_date: '',
    is_active: true
  });

  useEffect(() => {
    loadMembers();
    loadStats();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    const { data, error: err } = await memberService.getAllMembers();
    if (err) {
      setError(err.message);
    } else {
      setMembers(data || []);
    }
    setLoading(false);
  };

  const loadStats = async () => {
    const { data, error: err } = await memberService.getMemberStats();
    if (err) {
      setError(err.message);
    } else if (data) {
      setStats(data);
    }
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error: err } = await memberService.createMember(memberForm);
    if (err) {
      setError(err.message);
    } else {
      setShowMemberForm(false);
      resetForm();
      loadMembers();
      loadStats();
    }
  };

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    
    const updates: UpdateMember = {
      full_name: memberForm.full_name,
      email: memberForm.email,
      membership_tier: memberForm.membership_tier,
      membership_start_date: memberForm.membership_start_date,
      membership_end_date: memberForm.membership_end_date,
      is_active: memberForm.is_active
    };

    const { error: err } = await memberService.updateMember(editingMember.id, updates);
    if (err) {
      setError(err.message);
    } else {
      setEditingMember(null);
      setShowMemberForm(false);
      resetForm();
      loadMembers();
      loadStats();
    }
  };

  const startEditMember = (member: Member) => {
    setEditingMember(member);
    setMemberForm({
      full_name: member.full_name,
      email: member.email,
      membership_tier: member.membership_tier,
      membership_start_date: member.membership_start_date || new Date().toISOString().slice(0, 10),
      membership_end_date: member.membership_end_date || '',
      is_active: member.is_active
    });
    setShowMemberForm(true);
  };

  const resetForm = () => {
    setMemberForm({
      full_name: '',
      email: '',
      membership_tier: 'circle_member',
      membership_start_date: new Date().toISOString().slice(0, 10),
      membership_end_date: '',
      is_active: true
    });
  };

  const handleAddMemberClick = () => {
    console.log('🔵 Add Member button clicked');
    console.log('🔵 Current showMemberForm state:', showMemberForm);
    
    setEditingMember(null);
    resetForm();
    
    // Use functional update to ensure React detects the change
    setShowMemberForm((prev) => {
      console.log('🔵 Setting showMemberForm from', prev, 'to true');
      return true;
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getTierBadgeColor = (tier: MembershipTier) => {
    return tier === 'vip' ? 'bg-yellow-100 text-yellow-800' : 'bg-purple-100 text-purple-800';
  };

  const getTierLabel = (tier: MembershipTier) => {
    return tier === 'vip' ? 'VIP' : 'Circle Member';
  };

  const filteredMembers = members?.filter((member) => {
    const tierMatch = filterTier === 'all' || member.membership_tier === filterTier;
    const statusMatch =
      filterStatus === 'all' ||
      (filterStatus === 'active' && member.is_active) ||
      (filterStatus === 'inactive' && !member.is_active);
    return tierMatch && statusMatch;
  });

  if (loading) {
    return <div className="text-center py-12">Loading members...</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
          <button onClick={() => setError(null)} className="float-right font-bold">&times;</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Members</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Members</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.active}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Circle Members</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">{stats.circle}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">VIP Members</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.vip}</p>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Members Directory</h2>
            <button
              onClick={handleAddMemberClick}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Add Member
            </button>
          </div>

          {/* Member Form */}
          {showMemberForm && (
            <form onSubmit={editingMember ? handleUpdateMember : handleCreateMember} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
              <h3 className="text-lg font-semibold">{editingMember ? 'Edit Member' : 'New Member'}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={memberForm.full_name}
                    onChange={(e) => setMemberForm({ ...memberForm, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={memberForm.email}
                    onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Membership Tier *</label>
                  <select
                    value={memberForm.membership_tier}
                    onChange={(e) => setMemberForm({ ...memberForm, membership_tier: e.target.value as MembershipTier })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="circle_member">Circle Member</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={memberForm.membership_start_date}
                    onChange={(e) => setMemberForm({ ...memberForm, membership_start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={memberForm.membership_end_date}
                    onChange={(e) => setMemberForm({ ...memberForm, membership_end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={memberForm.is_active}
                    onChange={(e) => setMemberForm({ ...memberForm, is_active: e.target.checked })}
                    className="rounded mr-2"
                  />
                  <label className="text-sm text-gray-700">Active Member</label>
                </div>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  {editingMember ? 'Update' : 'Create'} Member
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMemberForm(false);
                    setEditingMember(null);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Filters */}
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Tier</label>
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value as MembershipTier | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Tiers</option>
                <option value="circle_member">Circle Members</option>
                <option value="vip">VIP Members</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembers?.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{member.full_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{member.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getTierBadgeColor(member.membership_tier)}`}>
                      {getTierLabel(member.membership_tier)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        member.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {member.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(member.membership_start_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(member.membership_end_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => startEditMember(member)}
                      className="text-purple-600 hover:text-purple-800"
                      title="Edit Member"
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredMembers?.length === 0 && (
            <div className="text-center py-8 text-gray-500">No members found matching the selected filters.</div>
          )}
        </div>
      </div>
    </div>
  );
}