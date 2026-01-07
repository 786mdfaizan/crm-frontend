// src/components/LeadForm.jsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import api from '@/lib/api';
import { 
  User, 
  Mail, 
  GraduationCap, 
  CheckCircle2, 
  Clock,
  FileText,
  CreditCard,
  Loader2,
  Save,
  UserPlus,
  Sparkles,
  AlertCircle,
  Phone
} from 'lucide-react';

// Updated schema with mobileNumber
const formSchema = z.object({
  studentName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  mobileNumber: z.string()
    .min(10, 'Mobile number must be at least 10 digits')
    .max(15, 'Mobile number is too long')
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid mobile number format'),
  collegePreference: z.string().min(1, 'College preference is required'),
  remark: z.enum([
    'Followup',
    'Application Pending',
    'Application Done',
    'Payment Done',
  ]),
});

export default function LeadForm({ onSuccess, initialData }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      remark: 'Followup',
    },
  });

  const onSubmit = async (data) => {
    console.log('Submitting lead data:', data);
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      let response;
      if (initialData && initialData._id) {
        response = await api.put(`/leads/${initialData._id}`, data);
      } else {
        response = await api.post('/leads', data);
      }

      console.log('Backend response:', response.data);
      setSubmitSuccess(true);
      
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err) {
      console.error('Lead creation/update error:', err);

      if (err.response) {
        const msg = err.response.data?.message || 'Unknown server error';
        alert(`Error ${err.response.status}: ${msg}`);
      } else if (err.request) {
        alert('Network error: Cannot reach backend. Is server running?');
      } else {
        alert('Unexpected error: ' + err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusConfig = {
    'Followup': {
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200'
    },
    'Application Pending': {
      icon: FileText,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200'
    },
    'Application Done': {
      icon: CheckCircle2,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    },
    'Payment Done': {
      icon: CreditCard,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200'
    }
  };

  const currentStatus = watch('remark');
  const StatusIcon = statusConfig[currentStatus]?.icon || Clock;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(onSubmit)(e);
  };

  return (
    <div onSubmit={handleFormSubmit}>
      <div className="space-y-6">
        {/* Student Name */}
        <div className="group">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-md flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            Student Name
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input 
              {...register('studentName')} 
              placeholder="Enter student's full name"
              className={`pl-11 h-12 border-2 transition-all duration-200 ${
                errors.studentName 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-slate-200 focus:border-blue-500 hover:border-slate-300'
              } rounded-xl`}
            />
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          {errors.studentName && (
            <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <p>{errors.studentName.message}</p>
            </div>
          )}
        </div>

        {/* Email */}
        <div className="group">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md flex items-center justify-center">
              <Mail className="w-3 h-3 text-white" />
            </div>
            Email Address
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input 
              type="email" 
              {...register('email')} 
              placeholder="student@example.com"
              className={`pl-11 h-12 border-2 transition-all duration-200 ${
                errors.email 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-slate-200 focus:border-purple-500 hover:border-slate-300'
              } rounded-xl`}
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          {errors.email && (
            <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <p>{errors.email.message}</p>
            </div>
          )}
        </div>

        {/* Mobile Number - NEW FIELD */}
        <div className="group">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-teal-500 rounded-md flex items-center justify-center">
              <Phone className="w-3 h-3 text-white" />
            </div>
            Mobile Number
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input 
              {...register('mobileNumber')} 
              placeholder="+91 9876543210"
              className={`pl-11 h-12 border-2 transition-all duration-200 ${
                errors.mobileNumber 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-slate-200 focus:border-green-500 hover:border-slate-300'
              } rounded-xl`}
            />
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          {errors.mobileNumber && (
            <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <p>{errors.mobileNumber.message}</p>
            </div>
          )}
        </div>

        {/* College Preference */}
        <div className="group">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-md flex items-center justify-center">
              <GraduationCap className="w-3 h-3 text-white" />
            </div>
            College Preference
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input 
              {...register('collegePreference')} 
              placeholder="Enter preferred college or university"
              className={`pl-11 h-12 border-2 transition-all duration-200 ${
                errors.collegePreference 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-slate-200 focus:border-green-500 hover:border-slate-300'
              } rounded-xl`}
            />
            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          {errors.collegePreference && (
            <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <p>{errors.collegePreference.message}</p>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="group">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <div className={`w-5 h-5 bg-gradient-to-br ${statusConfig[currentStatus]?.color} rounded-md flex items-center justify-center`}>
              <StatusIcon className="w-3 h-3 text-white" />
            </div>
            Application Status
            <span className="text-red-500">*</span>
          </label>
          <Select
            value={watch('remark')}
            onValueChange={(val) => setValue('remark', val)}
          >
            <SelectTrigger className="h-12 border-2 border-slate-200 hover:border-slate-300 focus:border-orange-500 rounded-xl transition-all duration-200">
              <SelectValue placeholder="Select application status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-2">
              {Object.entries(statusConfig).map(([status, config]) => {
                const Icon = config.icon;
                return (
                  <SelectItem 
                    key={status} 
                    value={status}
                    className="rounded-lg my-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 bg-gradient-to-br ${config.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">{status}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          
          {/* Status Info Card */}
          <div className={`mt-3 ${statusConfig[currentStatus]?.bgColor} ${statusConfig[currentStatus]?.borderColor} border-2 rounded-xl p-3 flex items-start gap-3 transition-all duration-200`}>
            <StatusIcon className={`w-5 h-5 ${statusConfig[currentStatus]?.textColor} flex-shrink-0 mt-0.5`} />
            <div>
              <p className={`text-sm font-semibold ${statusConfig[currentStatus]?.textColor} mb-1`}>
                Current Status: {currentStatus}
              </p>
              <p className="text-xs text-slate-600">
                {currentStatus === 'Followup' && 'Initial contact stage - follow up with the student'}
                {currentStatus === 'Application Pending' && 'Application in progress - waiting for submission'}
                {currentStatus === 'Application Done' && 'Application submitted - awaiting payment'}
                {currentStatus === 'Payment Done' && 'Payment completed - process finalized'}
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button 
            type="button"
            onClick={handleFormSubmit}
            disabled={isSubmitting || submitSuccess}
            className="w-full h-14 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : submitSuccess ? (
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5" />
                <span>Success!</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {initialData ? (
                  <>
                    <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Update Lead</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Create Lead</span>
                  </>
                )}
                <Sparkles className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </Button>
        </div>

        {/* Helper Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-1">Form Guidelines</p>
            <p className="text-xs text-blue-700">
              All fields marked with <span className="text-red-500 font-bold">*</span> are required. 
              Make sure to provide accurate information for proper lead tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
