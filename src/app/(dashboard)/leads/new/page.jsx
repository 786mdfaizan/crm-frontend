// app/(dashboard)/leads/new/page.jsx
'use client';

import { useRouter } from 'next/navigation';
import LeadForm from '@/components/LeadForm'; // ← use import, not require

export default function NewLeadPage() {
  const router = useRouter();

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Create New Lead</h1>
      <div className="max-w-2xl bg-white p-8 rounded-xl shadow border">
        <LeadForm onSuccess={() => router.push('/leads')} />
      </div>
    </div>
  );
}