// app/(dashboard)/leads/[id]/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import LeadForm from '@/components/LeadForm';
import { ArrowLeft, AlertCircle, Loader2, User, Clock, Calendar, Tag, Shield, Sparkles, CheckCircle2 } from 'lucide-react';

export default function EditLeadPage() {
  const router = useRouter();
  const params = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLead = async () => {
      try {
        console.log('Fetching lead with ID:', params.id);
        const res = await api.get(`/leads/${params.id}`);
        console.log('Lead data received:', res.data);
        setInitialData(res.data);
      } catch (err) {
        console.error('Fetch lead error:', err);
        setError(err.response?.data?.message || 'Lead not found or access denied');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchLead();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 md:p-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Loading Lead Details</h2>
              <p className="text-slate-600 mb-4">Fetching the latest information...</p>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-6 md:p-8 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <button
            onClick={() => router.push('/leads')}
            className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-slate-700 hover:text-slate-900 rounded-xl mb-8 transition-all hover:shadow-lg border border-slate-200/50"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back to Leads</span>
          </button>
          
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-red-100/50 p-10 md:p-16">
            <div className="flex flex-col items-center text-center max-w-xl mx-auto">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                  <AlertCircle className="w-12 h-12 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Unable to Load Lead</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">{error}</p>
              <div className="flex gap-3 flex-wrap justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl hover:border-slate-400 transition-all font-semibold hover:shadow-lg"
                >
                  Try Again
                </button>
                <button
                  onClick={() => router.push('/leads')}
                  className="px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-xl hover:shadow-xl transition-all font-semibold"
                >
                  Return to Leads
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 p-10 md:p-16">
            <div className="flex flex-col items-center text-center max-w-xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mb-6 shadow-xl">
                <User className="w-12 h-12 text-slate-500" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Lead Not Found</h2>
              <p className="text-lg text-slate-600 mb-8">The lead you're looking for doesn't exist or has been removed.</p>
              <button
                onClick={() => router.push('/leads')}
                className="px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-xl hover:shadow-xl transition-all font-semibold"
              >
                Return to Leads
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 md:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/leads')}
            className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-slate-700 hover:text-slate-900 rounded-xl mb-6 transition-all hover:shadow-lg border border-slate-200/50"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back to Leads</span>
          </button>
          
          <div className="flex items-start gap-4 bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-50"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-2">
                Edit Lead
              </h1>
              <p className="text-slate-600 text-lg">Update and manage lead information with ease</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Card */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <User className="w-6 h-6" />
                  Lead Information
                </h2>
                <p className="text-blue-100 mt-1">Complete the form below to update the lead</p>
              </div>
              
              <div className="p-8 md:p-10">
                <LeadForm
                  initialData={initialData}
                  onSuccess={() => router.push('/leads')}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-slate-900">Quick Tips</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>All changes are saved when you submit the form</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Review your changes before saving</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Required fields are marked with an asterisk</span>
                </li>
              </ul>
            </div>

            {/* Status Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5" />
                <h3 className="font-bold">Data Security</h3>
              </div>
              <p className="text-sm text-indigo-100">Your lead data is encrypted and securely stored. All changes are tracked and can be audited.</p>
            </div>

            {/* Metadata Card */}
            {initialData && (
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-purple-600" />
                  Lead Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-medium text-slate-500">ID:</span>
                    <span className="font-mono text-slate-700">{params.id}</span>
                  </div>
                  {initialData.createdAt && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-medium text-slate-500">Created:</span>
                      <span className="text-slate-700">{new Date(initialData.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Info Banner */}
        <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-5 flex items-start gap-4 shadow-xl">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold mb-1">Need Help?</p>
            <p className="text-blue-100 text-sm">Contact support if you encounter any issues or need assistance with updating this lead.</p>
          </div>
        </div>
      </div>
    </div>
  );
}