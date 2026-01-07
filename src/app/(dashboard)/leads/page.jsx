'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { 
  Users, Plus, Search, Filter, ChevronDown, Edit3, Mail, GraduationCap,
  Loader2, TrendingUp, CheckCircle2, Clock, AlertCircle, Download,
  RefreshCw, ArrowUpDown, FileText, Phone
} from 'lucide-react';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIsAdmin(user.role === 'admin');
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get('/leads');
      setLeads(res.data);
      setFilteredLeads(res.data);
    } catch (err) {
      console.error('Leads fetch error:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let filtered = leads;
    if (searchQuery) {
      filtered = filtered.filter(lead =>
        lead.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.mobileNumber || '').includes(searchQuery) ||          // Added mobile search
        lead.collegePreference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.consultant?.username || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.remark === statusFilter);
    }
    filtered.sort((a, b) => {
      let aVal = sortConfig.key === 'consultant' ? (a.consultant?.username || '') :
                 sortConfig.key === 'mobileNumber' ? (a.mobileNumber || '') :   // Added mobile sort
                 a[sortConfig.key];
      let bVal = sortConfig.key === 'consultant' ? (b.consultant?.username || '') :
                 sortConfig.key === 'mobileNumber' ? (b.mobileNumber || '') :
                 b[sortConfig.key];
      if (sortConfig.key === 'createdAt' || sortConfig.key === 'mobileNumber') {
        aVal = aVal || '';
        bVal = bVal || '';
      }
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredLeads(filtered);
  }, [searchQuery, statusFilter, leads, sortConfig]);

  const getStatusStyle = (remark) => {
    const styles = {
      'Payment Done': 'bg-emerald-100 text-emerald-700 border-emerald-300',
      'Application Done': 'bg-blue-100 text-blue-700 border-blue-300',
      'Application Pending': 'bg-amber-100 text-amber-700 border-amber-300',
    };
    return styles[remark] || 'bg-slate-100 text-slate-700 border-slate-300';
  };

  const getStatusIcon = (remark) => {
    const icons = {
      'Payment Done': CheckCircle2,
      'Application Done': TrendingUp,
      'Application Pending': Clock,
    };
    return icons[remark] || AlertCircle;
  };

  const stats = {
    total: leads.length,
    paymentDone: leads.filter(l => l.remark === 'Payment Done').length,
    applicationDone: leads.filter(l => l.remark === 'Application Done').length,
    pending: leads.filter(l => l.remark === 'Application Pending').length,
  };

  const conversionRate = stats.total > 0 ? ((stats.paymentDone / stats.total) * 100).toFixed(1) : 0;
  const uniqueStatuses = ['all', ...new Set(leads.map(l => l.remark))];

  const exportToCSV = () => {
    const headers = isAdmin 
      ? ['Consultant', 'Student Name', 'Email', 'Mobile', 'College', 'Status', 'Created Date']  // Added Mobile
      : ['Student Name', 'Email', 'Mobile', 'College', 'Status', 'Created Date'];             // Added Mobile
    const rows = filteredLeads.map(lead => {
      const row = isAdmin 
        ? [lead.consultant?.username || 'N/A', lead.studentName, lead.email, lead.mobileNumber || 'N/A', lead.collegePreference, lead.remark, new Date(lead.createdAt).toLocaleDateString()]
        : [lead.studentName, lead.email, lead.mobileNumber || 'N/A', lead.collegePreference, lead.remark, new Date(lead.createdAt).toLocaleDateString()];
      return row.join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-blue-600 absolute top-3 left-3 sm:top-4 sm:left-4" />
          </div>
          <p className="text-gray-600 font-semibold mt-6 text-base sm:text-lg">Loading your leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-full mx-auto space-y-4 sm:space-y-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 p-4 sm:p-6 md:p-8">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl blur-lg opacity-50"></div>
                  <div className="relative p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-xl">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent truncate">
                    {isAdmin ? 'All Leads' : 'My Leads'}
                  </h1>
                  <p className="text-gray-500 mt-1 text-xs sm:text-sm line-clamp-2">
                    {isAdmin ? 'Overview of all student applications' : 'Track your student applications'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Button onClick={() => { setRefreshing(true); fetchLeads(); }} disabled={refreshing} className="flex-1 sm:flex-none bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 font-semibold px-3 sm:px-4 h-10 rounded-xl text-sm">
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="ml-2 hidden xs:inline">Refresh</span>
              </Button>
              <Button onClick={exportToCSV} className="flex-1 sm:flex-none bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 font-semibold px-3 sm:px-4 h-10 rounded-xl text-sm">
                <Download className="w-4 h-4" />
                <span className="ml-2 hidden xs:inline">Export</span>
              </Button>
              {!isAdmin && (
                <Button onClick={() => router.push('/leads/new')} className="flex-1 sm:flex-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-4 h-10 rounded-xl text-sm">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Add Lead
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
              {[
                { label: 'Total', value: stats.total, icon: Users, color: 'blue', text: 'Apps' },
                { label: 'Paid', value: stats.paymentDone, icon: CheckCircle2, color: 'emerald', text: `${conversionRate}%` },
                { label: 'Complete', value: stats.applicationDone, icon: TrendingUp, color: 'indigo', text: 'Done' },
                { label: 'Pending', value: stats.pending, icon: Clock, color: 'amber', text: 'Wait' },
                { label: 'Success', value: `${conversionRate}%`, icon: TrendingUp, color: 'purple', text: 'Rate', span: 'col-span-2 lg:col-span-1' },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className={`relative group ${stat.span || ''}`}>
                    <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-400 to-${stat.color}-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                    <div className={`relative bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 rounded-xl p-3 sm:p-4 md:p-5 border-2 border-${stat.color}-200 hover:border-${stat.color}-300 transition-all shadow-md hover:shadow-lg`}>
                      <div className="flex items-start justify-between mb-1 sm:mb-2">
                        <p className={`text-[10px] sm:text-xs text-${stat.color}-600 font-bold uppercase tracking-wide`}>{stat.label}</p>
                        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-${stat.color}-400 flex-shrink-0`} />
                      </div>
                      <p className={`text-xl sm:text-2xl md:text-3xl font-black text-${stat.color}-900`}>{stat.value}</p>
                      <div className={`mt-1 sm:mt-2 text-[10px] sm:text-xs text-${stat.color}-600`}>
                        <span className="hidden sm:inline">{stat.text}</span>
                        <span className="sm:hidden">{stat.text.split(' ')[0]}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input type="text" placeholder="Search leads..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 sm:pl-12 pr-3 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm" />
            </div>
            <div className="relative sm:w-48 md:w-64">
              <Filter className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full pl-10 sm:pl-12 pr-8 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer shadow-sm">
                {uniqueStatuses.map(status => <option key={status} value={status}>{status === 'all' ? 'All Statuses' : status}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12 sm:py-16 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4 shadow-lg">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{searchQuery || statusFilter !== 'all' ? 'No leads found' : 'No leads yet'}</h3>
              <p className="text-sm text-gray-500 mb-6">{searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters' : !isAdmin ? 'Add your first lead' : 'No leads created'}</p>
              {!isAdmin && leads.length === 0 && (
                <Button onClick={() => router.push('/leads/new')} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 h-11 rounded-xl">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Lead
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto hidden sm:block">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100">
                    <tr>
                      {isAdmin && (
                        <th onClick={() => setSortConfig({ key: 'consultant', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })} className="px-3 md:px-6 py-3 md:py-5 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase cursor-pointer hover:bg-gray-200">
                          <div className="flex items-center gap-2"><span>Consultant</span><ArrowUpDown className="w-4 h-4" /></div>
                        </th>
                      )}
                      <th onClick={() => setSortConfig({ key: 'studentName', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })} className="px-3 md:px-6 py-3 md:py-5 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase cursor-pointer hover:bg-gray-200">
                        <div className="flex items-center gap-2"><span>Student</span><ArrowUpDown className="w-4 h-4" /></div>
                      </th>
                      <th onClick={() => setSortConfig({ key: 'mobileNumber', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })} className="px-3 md:px-6 py-3 md:py-5 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase cursor-pointer hover:bg-gray-200">
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4" /><span>Mobile</span><ArrowUpDown className="w-4 h-4" /></div>
                      </th>
                      <th className="px-3 md:px-6 py-3 md:py-5 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase hidden lg:table-cell">Email</th>
                      <th className="px-3 md:px-6 py-3 md:py-5 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase hidden md:table-cell">College</th>
                      <th className="px-3 md:px-6 py-3 md:py-5 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase">Status</th>
                      <th className="px-3 md:px-6 py-3 md:py-5 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredLeads.map((lead) => {
                      const StatusIcon = getStatusIcon(lead.remark);
                      return (
                        <tr key={lead._id} className="hover:bg-blue-50/50 transition-all">
                          {isAdmin && (
                            <td className="px-3 md:px-6 py-3 md:py-5">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                  {(lead.consultant?.username || 'N').charAt(0).toUpperCase()}
                                </div>
                                <span className="text-xs sm:text-sm font-semibold text-gray-900 hidden xl:inline">{lead.consultant?.username || 'N/A'}</span>
                              </div>
                            </td>
                          )}
                          <td className="px-3 md:px-6 py-3 md:py-5">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                                {lead.studentName.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">{lead.studentName}</p>
                                <p className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1 lg:hidden">
                                  <Mail className="w-3 h-3" />
                                  <span className="truncate">{lead.email}</span>
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-5">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Phone className="w-4 h-4 text-green-600" />
                              <span className="font-medium">{lead.mobileNumber || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-5 hidden lg:table-cell">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Mail className="w-4 h-4 text-blue-500" />
                              <span className="truncate">{lead.email}</span>
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-5 hidden md:table-cell">
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
                                <GraduationCap className="w-4 h-4 text-indigo-600" />
                              </div>
                              <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{lead.collegePreference}</span>
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-5">
                            <span className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold border-2 shadow-sm ${getStatusStyle(lead.remark)}`}>
                              <StatusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">{lead.remark}</span>
                              <span className="sm:hidden">{lead.remark.split(' ')[0]}</span>
                            </span>
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-5">
                            <Button onClick={() => router.push(`/leads/${lead._id}`)} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-3 sm:px-4 py-2 rounded-xl text-xs transition-all shadow-md active:scale-95">
                              <Edit3 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1.5" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="sm:hidden space-y-2 p-3">
                {filteredLeads.map((lead) => (
                  <div key={lead._id} className="bg-white rounded-xl border-2 border-gray-200 p-3 hover:border-blue-300 transition-all">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                          {lead.studentName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-gray-900 truncate">{lead.studentName}</p>
                          <p className="text-xs text-gray-500 truncate">{lead.email}</p>
                        </div>
                      </div>
                      <Button onClick={() => router.push(`/leads/${lead._id}`)} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-2 rounded-lg">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-gray-600">
                        <GraduationCap className="w-3 h-3" />
                        <span className="truncate">{lead.collegePreference}</span>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border ${getStatusStyle(lead.remark)}`}>
                        {lead.remark.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {filteredLeads.length > 0 && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-gray-600">
                Showing <span className="font-bold text-gray-900">{filteredLeads.length}</span> of <span className="font-bold text-gray-900">{leads.length}</span> leads
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
