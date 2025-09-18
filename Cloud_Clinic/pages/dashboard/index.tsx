import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Profile } from '@/lib/types';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.replace('/');
        return;
      }
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(data);
    });
  }, [router]);

  if (!profile) return <div>Loading...</div>;

  return (
    <DashboardLayout role={profile.role}>
      <h1 className="text-2xl font-semibold">Welcome, {profile.full_name || profile.role}</h1>
      {/* Add dashboard widgets here */}
    </DashboardLayout>
  );
}