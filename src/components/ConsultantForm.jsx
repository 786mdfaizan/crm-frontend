'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Eye, EyeOff, Check, X, AlertCircle, CheckCircle2, Lock, User, Shield } from 'lucide-react';
import api from '@/lib/api';

const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, - and _ allowed'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function ConsultantForm({ onSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const password = watch('password', '');
  const username = watch('username', '');

  const onSubmit = async (data) => {
    console.log('Sending to backend:', data);
    setIsSubmitting(true);
    setNotification(null);

    try {
      const response = await api.post('/users', data);

      if (response.status === 201) {
        setNotification({ type: 'success', message: 'Consultant created successfully!' });
        reset();
        if (onSuccess) onSuccess();
        setTimeout(() => setNotification(null), 5000);
      }
    } catch (err) {
      let errorMessage = 'An unexpected error occurred';
      
      if (err.response) {
        errorMessage = err.response.data?.message || `Error ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'Network error: Backend not responding';
      } else {
        errorMessage = err.message;
      }
      
      setNotification({ type: 'error', message: errorMessage });
      console.error('Creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = (pwd) => {
    if (pwd.length === 0) return null;
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    
    if (strength >= 4) return { level: 'strong', text: 'Strong', color: 'green', width: 'w-full' };
    if (strength >= 2) return { level: 'medium', text: 'Medium', color: 'yellow', width: 'w-2/3' };
    return { level: 'weak', text: 'Weak', color: 'red', width: 'w-1/3' };
  };

  const passwordStrength = getPasswordStrength(password);

  const passwordRequirements = [
    { met: password.length >= 6, text: 'At least 6 characters' },
    { met: password.length >= 8, text: '8+ characters (recommended)' },
    { met: /[A-Z]/.test(password) && /[a-z]/.test(password), text: 'Mixed case letters' },
    { met: /\d/.test(password), text: 'Contains number' },
    { met: /[^a-zA-Z0-9]/.test(password), text: 'Special character' },
  ];

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
              <UserPlus className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Create Consultant</h2>
              <p className="text-blue-100 text-sm">Add a new team member</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Notification */}
          {notification && (
            <div
              className={`mb-6 p-4 rounded-xl border backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300 ${
                notification.type === 'success'
                  ? 'bg-green-50 border-green-300 shadow-green-100'
                  : 'bg-red-50 border-red-300 shadow-red-100'
              } shadow-lg`}
            >
              <div
                className={`flex items-start gap-3 ${
                  notification.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {notification.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className="font-semibold text-sm">
                    {notification.type === 'success' ? 'Success!' : 'Error'}
                  </p>
                  <p className="text-sm mt-0.5">{notification.message}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                Username
              </label>
              <div className="relative group">
                <Input
                  {...register('username')}
                  placeholder="e.g., john_doe"
                  className={`h-12 pl-4 pr-10 text-base transition-all duration-200 ${
                    errors.username
                      ? 'border-red-400 focus:ring-red-500 bg-red-50'
                      : touchedFields.username && username.length >= 3
                      ? 'border-green-400 focus:ring-green-500 bg-green-50'
                      : 'border-gray-300 focus:border-blue-500 hover:border-gray-400'
                  }`}
                />
                {touchedFields.username && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {errors.username ? (
                      <X className="w-5 h-5 text-red-500" />
                    ) : username.length >= 3 ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : null}
                  </div>
                )}
              </div>
              {errors.username && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-4 h-4" />
                  {errors.username.message}
                </p>
              )}
              {username.length >= 3 && !errors.username && (
                <p className="text-green-600 text-sm mt-2 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                  <CheckCircle2 className="w-4 h-4" />
                  Username is available
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-500" />
                Password
              </label>
              <div className="relative group">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="Enter a secure password"
                  className={`h-12 pl-4 pr-12 text-base transition-all duration-200 ${
                    errors.password
                      ? 'border-red-400 focus:ring-red-500 bg-red-50'
                      : password.length >= 6
                      ? 'border-green-400 focus:ring-green-500 bg-green-50'
                      : 'border-gray-300 focus:border-blue-500 hover:border-gray-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-all hover:scale-110 active:scale-95"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {errors.password && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password.message}
                </p>
              )}

              {/* Password Strength Indicator */}
              {password.length > 0 && !errors.password && passwordStrength && (
                <div className="mt-3 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ease-out ${passwordStrength.width} ${
                          passwordStrength.color === 'green'
                            ? 'bg-gradient-to-r from-green-400 to-green-600'
                            : passwordStrength.color === 'yellow'
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                            : 'bg-gradient-to-r from-red-400 to-red-600'
                        }`}
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Shield className={`w-4 h-4 ${
                        passwordStrength.color === 'green'
                          ? 'text-green-600'
                          : passwordStrength.color === 'yellow'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`} />
                      <span
                        className={`text-xs font-bold ${
                          passwordStrength.color === 'green'
                            ? 'text-green-600'
                            : passwordStrength.color === 'yellow'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {passwordStrength.text}
                      </span>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Password Requirements:</p>
                    <div className="grid grid-cols-1 gap-1.5">
                      {passwordRequirements.map((req, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                            req.met ? 'text-green-700' : 'text-gray-500'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            req.met ? 'bg-green-100' : 'bg-gray-200'
                          }`}>
                            {req.met ? (
                              <Check className="w-3 h-3 text-green-600" />
                            ) : (
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                            )}
                          </div>
                          <span className={req.met ? 'font-medium' : ''}>{req.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || Object.keys(errors).length > 0}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98] disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  <span>Create Consultant Account</span>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            All accounts are secured with industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  );
}