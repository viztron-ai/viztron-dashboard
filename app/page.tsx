import { getUser } from '@/utils/supabase/queries';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function Dashboard() {
  const supabase = createClient();
  const [user] = await Promise.all([getUser(await supabase)]);

  console.log('Line----9 page.tsx', user)
  if (!user) {
    return redirect('/dashboard/signin');
  } else if(user.user_metadata?.isOnboarding) {
    return redirect('/dashboard/signin/onboarding');
  } else {
    redirect('/dashboard/main');
  }
}
