import DefaultAuth from '@/components/auth';
import AuthUI from '@/components/auth/AuthUI';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import {
  getAuthTypes,
  getViewTypes,
  getDefaultSignInView,
  getRedirectMethod
} from '@/utils/auth-helpers/settings';

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ disable_button: boolean }>;

export default async function SignIn({
  params,
  searchParams
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const { disable_button } = await searchParams;
  const { allowOauth, allowEmail, allowPassword } = getAuthTypes();
  const viewTypes = getViewTypes();
  const redirectMethod = getRedirectMethod();

  // Declare 'viewProp' and initialize with the default value
  let viewProp: string;

  // Assign url id to 'viewProp' if it's a valid string and ViewTypes includes it
  if (typeof id === 'string' && viewTypes.includes(id)) {
    viewProp = id;
  } else {
    const preferredSignInView =
      (await cookies()).get('preferredSignInView')?.value || null;
    viewProp = getDefaultSignInView(preferredSignInView);
    return redirect(`/dashboard/signin/${viewProp}`);
  }

  // Check if the user is already logged in and redirect to the account page if so
  const supabase = createClient();

  const {
    data: { user }
  } = await (await supabase).auth.getUser();

  if (user) {
    if (user.user_metadata?.isOnboarding) {
      if (viewProp !== 'onboarding') {
        return redirect('/dashboard/signin/onboarding');
      }
    } else if (viewProp !== 'update_password') {
      return redirect('/dashboard/main');
    }
  } else {
    return redirect('/dashboard/signin');
  }

  return (
    <DefaultAuth viewProp={viewProp}>
      <div>
        <AuthUI
          viewProp={viewProp}
          user={user}
          allowPassword={allowPassword}
          allowEmail={allowEmail}
          redirectMethod={redirectMethod}
          disableButton={disable_button}
          allowOauth={allowOauth}
        />
      </div>
    </DefaultAuth>
  );
}
