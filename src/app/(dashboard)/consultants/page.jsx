'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import ConsultantForm from '@/components/ConsultantForm';
import { UserPlus, X, Users, Shield, User, Search, Filter, ChevronDown, Loader2 } from 'lucide-react';

export default function ConsultantsPage() {
  const router = useRouter();
  const [consultants, setConsultants] = useState([]);
  const [filteredConsultants, setFilteredConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role);

    if (user.role !== 'admin') {
      alert('Access denied: Only admins can view this page.');
      router.replace('/');
      return;
    }

    const fetchConsultants = async () => {
      try {
        const res = await api.get('/users');
        setConsultants(res.data);
        setFilteredConsultants(res.data);
      } catch (err) {
        console.error('Fetch error:', err);
        if (err.response?.status === 403) {
          alert('403 Forbidden: Admin access only');
          router.replace('/');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchConsultants();
  }, [router]);

  useEffect(() => {
    let filtered = consultants;

    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(c => c.role === roleFilter);
    }

    setFilteredConsultants(filtered);
  }, [searchQuery, roleFilter, consultants]);

  const handleCreate = () => {
    setShowForm(false);
    api.get('/users').then(res => {
      setConsultants(res.data);
      setFilteredConsultants(res.data);
    }).catch(console.error);
  };

  const getRoleBadgeStyle = (role) => {
    switch(role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'consultant':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleIcon = (role) => {
    return role === 'admin' ? Shield : User;
  };

  const uniqueRoles = ['all', ...new Set(consultants.map(c => c.role))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading consultants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Consultants Management</h1>
                <p className="text-gray-500 mt-1">Manage your team members and their roles</p>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              {showForm ? (
                <div className="flex items-center gap-2">
                  <X className="w-5 h-5" />
                  Cancel
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Add Consultant
                </div>
              )}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Users</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{consultants.length}</p>
                </div>
                <Users className="w-10 h-10 text-blue-400" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Admins</p>
                  <p className="text-2xl font-bold text-purple-900 mt-1">
                    {consultants.filter(c => c.role === 'admin').length}
                  </p>
                </div>
                <Shield className="w-10 h-10 text-purple-400" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Consultants</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">
                    {consultants.filter(c => c.role === 'consultant').length}
                  </p>
                </div>
                <User className="w-10 h-10 text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <ConsultantForm onSuccess={handleCreate} />
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="relative md:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white cursor-pointer"
              >
                {uniqueRoles.map(role => (
                  <option key={role} value={role}>
                    {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {filteredConsultants.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery || roleFilter !== 'all' ? 'No results found' : 'No consultants yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || roleFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by adding your first consultant'
                }
              </p>
              {!showForm && consultants.length === 0 && (
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 h-11 rounded-xl"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Add Your First Consultant
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredConsultants.map((user, index) => {
                    const RoleIcon = getRoleIcon(user.role);
                    return (
                      <tr 
                        key={user._id} 
                        className="hover:bg-gray-50 transition-colors duration-150 animate-in fade-in slide-in-from-bottom-2"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{user.username}</p>
                              <p className="text-xs text-gray-500">@{user.username.toLowerCase()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getRoleBadgeStyle(user.role)}`}>
                            <RoleIcon className="w-3.5 h-3.5" />
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            Active
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Info */}
        {filteredConsultants.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600 text-center">
              Showing <span className="font-semibold text-gray-900">{filteredConsultants.length}</span> of <span className="font-semibold text-gray-900">{consultants.length}</span> consultants
            </p>
          </div>
        )}
      </div>
    </div>
  );
}