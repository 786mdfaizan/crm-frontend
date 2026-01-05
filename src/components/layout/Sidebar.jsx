'use client';

import { useRouter, usePathname } from 'next/navigation';
import { LogOut, Users, ListPlus, Home, Sparkles, GraduationCap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Sidebar({ role }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const navItems = [
    {
      label: 'Dashboard',
      icon: Home,
      path: '/',
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      hoverBg: 'hover:bg-blue-50'
    },
    {
      label: 'Leads',
      icon: ListPlus,
      path: '/leads',
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      hoverBg: 'hover:bg-purple-50'
    },
    ...(role === 'admin' ? [{
      label: 'Consultants',
      icon: Users,
      path: '/consultants',
      gradient: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      hoverBg: 'hover:bg-emerald-50'
    }] : [])
  ];

  return (
    <aside className="w-72 border-r border-slate-200 bg-gradient-to-b from-white to-slate-50 flex flex-col h-screen">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push('/')}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Career Aashram
            </h1>
            <p className="text-xs text-slate-500 font-medium">Education CRM</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`
                  w-full group relative rounded-xl transition-all duration-200
                  ${active 
                    ? `${item.bgColor} shadow-lg` 
                    : 'hover:bg-slate-100'
                  }
                `}
              >
                {active && (
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b ${item.gradient} rounded-r-full`}></div>
                )}
                
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center transition-all
                    ${active 
                      ? `bg-gradient-to-br ${item.gradient} shadow-md` 
                      : 'bg-slate-100 group-hover:bg-slate-200'
                    }
                  `}>
                    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-600'}`} />
                  </div>
                  
                  <span className={`
                    flex-1 text-left font-semibold transition-colors
                    ${active ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}
                  `}>
                    {item.label}
                  </span>
                  
                  {active && (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* User Info & Logout Section */}
      <div className="p-4 border-t border-slate-200 bg-white space-y-3">
        {/* User Role Badge */}
        <div className="px-4 py-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Logged in as</p>
              <p className="text-sm font-bold text-slate-900 capitalize">{role || 'User'}</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full group relative rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="relative flex items-center gap-3 px-4 py-3 bg-red-50 group-hover:bg-transparent transition-colors">
            <div className="w-10 h-10 bg-red-100 group-hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
              <LogOut className="w-5 h-5 text-red-600 group-hover:text-white transition-colors" />
            </div>
            <span className="flex-1 text-left font-semibold text-red-600 group-hover:text-white transition-colors">
              Logout
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
}