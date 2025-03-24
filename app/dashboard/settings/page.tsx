import Settings from '@/components/dashboard/settings';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getUserDetails, getUser } from '@/utils/supabase/queries';

export default async function SettingsPage() {
  const supabase = createClient();
  const [user, userDetails] = await Promise.all([
    getUser(await supabase),
    getUserDetails(await supabase)
  ]);
  if (!user) {
    return redirect('/dashboard/signin');
  }

  return <Settings userDetails={userDetails} user={user} />;
}
