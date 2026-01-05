// app/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { 
  Users, 
  ArrowRight, 
  UserPlus,
  Target,
  Clock,
  Loader2,
  AlertCircle,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function DashboardHome() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState('');
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const leadsRes = await api.get('/leads');
        const leads = leadsRes.data;
        
        const totalLeads = leads.length;
        const thisMonth = leads.filter(lead => {
          const createdDate = new Date(lead.createdAt);
          const now = new Date();
          return createdDate.getMonth() === now.getMonth() && 
                 createdDate.getFullYear() === now.getFullYear();
        }).length;
        
        const lastMonth = leads.filter(lead => {
          const createdDate = new Date(lead.createdAt);
          const now = new Date();
          const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
          return createdDate.getMonth() === lastMonthDate.getMonth() && 
                 createdDate.getFullYear() === lastMonthDate.getFullYear();
        }).length;
        
        const monthGrowth = lastMonth > 0 
          ? (((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1)
          : thisMonth > 0 ? '100' : '0';
        
        const recent = leads
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        
        setStats({
          totalLeads,
          thisMonth,
          monthGrowth: monthGrowth > 0 ? `+${monthGrowth}%` : `${monthGrowth}%`,
          recentCount: recent.length
        });
        
        setRecentLeads(recent);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickActions = [
    {
      title: 'View All Leads',
      description: 'Manage and track your leads',
      icon: Users,
      path: '/leads',
      color: 'blue'
    },
    {
      title: 'Add New Lead',
      description: 'Create a new lead entry',
      icon: UserPlus,
      path: '/leads/new',
      color: 'purple'
    },
    {
      title: 'Admin Panel',
      description: 'Manage system settings',
      icon: Target,
      path: '/admin',
      color: 'emerald'
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const colorClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
    emerald: 'bg-emerald-500 hover:bg-emerald-600',
    orange: 'bg-orange-500'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700 mb-2">Loading Dashboard</h2>
          <p className="text-slate-500">Fetching your latest data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                {getGreeting()}!
              </h1>
              <p className="text-slate-600">Welcome back to your dashboard</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
              <Clock className="w-4 h-4 text-slate-600" />
              <span className="text-slate-700 font-medium">{currentTime}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-1">Total Leads</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalLeads}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  stats.monthGrowth.startsWith('+') 
                    ? 'text-emerald-700 bg-emerald-100' 
                    : 'text-red-700 bg-red-100'
                }`}>
                  {stats.monthGrowth}
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-1">This Month</p>
              <p className="text-3xl font-bold text-slate-900">{stats.thisMonth}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-1">Recent Activity</p>
              <p className="text-3xl font-bold text-slate-900">{stats.recentCount}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => router.push(action.path)}
                    className="group bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-6 transition-all text-left"
                  >
                    <div className={`w-12 h-12 ${colorClasses[action.color]} rounded-lg flex items-center justify-center mb-4 transition-colors`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {action.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      {action.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Leads */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Leads</h2>
            <div className="space-y-4">
              {recentLeads.length > 0 ? (
                recentLeads.map((lead, index) => (
                  <button
                    key={lead._id || index}
                    onClick={() => router.push(`/leads/${lead._id}`)}
                    className="w-full flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <UserPlus className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {lead.studentName || 'Unnamed Lead'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{getTimeAgo(lead.createdAt)}</p>
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-slate-500 text-center py-8 text-sm">No recent leads</p>
              )}
            </div>
            {recentLeads.length > 0 && (
              <button 
                onClick={() => router.push('/leads')}
                className="w-full mt-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
              >
                View All Leads
              </button>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Getting Started</h3>
              <p className="text-sm text-blue-800">Use the sidebar to navigate between leads and admin features for a streamlined workflow.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}