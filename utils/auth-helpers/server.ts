'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getURL, getErrorRedirect, getStatusRedirect } from '@/utils/helpers';
import { getAuthTypes } from '@/utils/auth-helpers/settings';
import type { Database } from '@/types/types_db';

function isValidEmail(email: string) {
  var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

export async function redirectToPath(path: string) {
  return redirect(path);
}

export async function SignOut(formData: FormData) {
  const pathName = String(formData.get('pathName')).trim();

  const supabase = createClient();
  const { error } = await (await supabase).auth.signOut();

  if (error) {
    return getErrorRedirect(
      'https://viztron.ai/dashboard/settings',
      'Hmm... Something went wrong.',
      'You could not be signed out.'
    );
  }

  return '/dashboard/signin';
}

export async function signInWithEmail(formData: FormData) {
  const cookieStore = cookies();
  const callbackURL = getURL('/auth/callback');

  const email = String(formData.get('email')).trim();
  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect(
      '/dashboard/signin/email_signin',
      'Invalid email address.',
      'Please try again.'
    );
  }

  const supabase = createClient();
  let options = {
    emailRedirectTo: callbackURL,
    shouldCreateUser: true
  };

  // If allowPassword is false, do not create a new user
  const { allowPassword } = getAuthTypes();
  if (allowPassword) options.shouldCreateUser = false;
  const { data, error } = await (await supabase).auth.signInWithOtp({
    email,
    options: options
  });

  if (error) {
    redirectPath = getErrorRedirect(
      '/dashboard/signin/email_signin',
      'You could not be signed in.',
      error.message
    );
  } else if (data) {
    (await cookieStore).set('preferredSignInView', 'email_signin', { path: '/' });
    redirectPath = getStatusRedirect(
      '/dashboard/signin/email_signin',
      'Success!',
      'Please check your email for a magic link. You may now close this tab.',
      true
    );
  } else {
    redirectPath = getErrorRedirect(
      '/dashboard/signin/email_signin',
      'Hmm... Something went wrong.',
      'You could not be signed in.'
    );
  }

  return redirectPath;
}

export async function requestPasswordUpdate(formData: FormData) {
  const callbackURL = getURL('/auth/reset_password');

  // Get form data
  const email = String(formData.get('email')).trim();
  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect(
      '/dashboard/signin/forgot_password',
      'Invalid email address.',
      'Please try again.'
    );
  }

  const supabase = createClient();

  const { data, error } = await (await supabase).auth.resetPasswordForEmail(email, {
    redirectTo: callbackURL
  });

  if (error) {
    redirectPath = getErrorRedirect(
      '/dashboard/signin/forgot_password',
      error.message,
      'Please try again.'
    );
  } else if (data) {
    redirectPath = getStatusRedirect(
      '/dashboard/signin/forgot_password',
      'Success!',
      'Please check your email for a password reset link. You may now close this tab.',
      true
    );
  } else {
    redirectPath = getErrorRedirect(
      '/dashboard/signin/forgot_password',
      'Hmm... Something went wrong.',
      'Password reset email could not be sent.'
    );
  }

  return redirectPath;
}

export async function signInWithPassword(formData: FormData) {
  const cookieStore = cookies();
  const email = String(formData.get('email')).trim();
  const password = String(formData.get('password')).trim();
  let redirectPath: string;

  const supabase = createClient();
  const { error, data } = await (await supabase).auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirectPath = getErrorRedirect(
      '/dashboard/signin/password_signin',
      'Sign in failed.',
      error.message
    );
  } else if (data.user) {
    (await cookieStore).set('preferredSignInView', 'password_signin', { path: '/' });
    if (data.user.user_metadata?.isOnboarding) {
      (await cookieStore).set('preferredSignInView', 'onboarding', { path: '/' });
      redirectPath = getStatusRedirect('/dashboard/signin/onboarding', 'Success!', 'Complete your profile to access the account');
    } else redirectPath = getStatusRedirect('/', 'Success!', 'You are now signed in.');
  } else {
    redirectPath = getErrorRedirect(
      '/dashboard/signin/password_signin',
      'Hmm... Something went wrong.',
      'You could not be signed in.'
    );
  }

  return redirectPath;
}

export async function signUp(formData: FormData) {
  const callbackURL = getURL('dashboard/signin/onboarding');

  const email = String(formData.get('email')).trim();
  const password = String(formData.get('password')).trim();
  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect(
      '/dashboard/signin/signup',
      'Invalid email address.',
      'Please try again.'
    );
  }

  const supabase = createClient();
  const { error, data } = await (await supabase).auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callbackURL,
      data: {
        isOnboarding: true
      },
    },
  });

  if (error) {
    redirectPath = getErrorRedirect(
      '/dashboard/signin/signup',
      'Sign up failed.',
      error.message
    );
  } else if (data.session) {
    redirectPath = getStatusRedirect('/', 'Success!', 'You are now signed in.');
  } else if (
    data.user &&
    data.user.identities &&
    data.user.identities.length == 0
  ) {
    redirectPath = getErrorRedirect(
      '/dashboard/signin/signup',
      'Sign up failed.',
      'There is already an account associated with this email address. Try resetting your password.'
    );
  } else if (data.user) {
    // const userId = data.user.id

    // const supabaseAdmin = createClient<Database>(
    //   process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    //   process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    // );

    // const {error} = await (await supabaseAdmin).from('users').insert({
    //   email,
    //   'first_name': firstName,
    //   'last_name': lastName,
    //   'user_id': userId
    // })
    // console.log('Line----226 server.ts userId===', userId)
    // console.log('Line----208 server.ts', error)
    // // Step 2: Add roles to the user for each location
    // for (const item of rolesWithLocations) {
    //   const { data, error } = await (await supabaseAdmin).rpc(
    //     'create_user_role_location_mapping_2',
    //     {
    //       in_user_id: userId,
    //       in_role_name: item.role,
    //       in_location_name: item.location.name,
    //       in_location_address: item.location.address || null
    //     }
    //   );
    //   console.log('Line----220 server.ts', error)
    //   console.log('Line----233 server.ts', data)
    // }

    redirectPath = getStatusRedirect(
      '/',
      'Success!',
      'Please check your email for a confirmation link. You may now close this tab.'
    );
  } else {
    redirectPath = getErrorRedirect(
      '/dashboard/signin/signup',
      'Hmm... Something went wrong.',
      'You could not be signed up.'
    );
  }

  return redirectPath;
}

export async function completeOnboarding(formData: FormData) {
  const first_name = String(formData.get('first_name')).trim();
  const last_name = String(formData.get('last_name')).trim();
  const rolesWithLocations = formData.get('selectedRoles') ? JSON.parse(formData.get('selectedRoles') as any) : [];

  const supabase = createClient();
  let redirectPath: string;

  const { data: { user } } = await (await supabase).auth.getUser();

  if (user) {
    const userId = user.id;

    const { error } = await (await supabase).from('users').insert({
      email: user.email,
      first_name,
      last_name,
      'user_id': userId
    }).select().single();

    if (error) {
      redirectPath = getErrorRedirect(
        '/dashboard/signin/onboarding',
        'Onboarding failed.',
        error.message
      );
    } else {
      let createdRoles = [];
      for (const item of rolesWithLocations) {
        const {data} = await (await supabase).rpc(
          'create_user_role_location_mapping',
          {
            in_user_id: userId,
            in_role_name: item.role,
            in_location_name: item.location.name,
            in_location_address: item.location.address || null
          }
        );
        createdRoles = [data, ...createdRoles];
      }

      const { error: userError } = await (await supabase).auth.updateUser({
        data: { isOnboarding: false }
      })

      if(userError) {
        const {data} = await (await supabase).from('user_role_location_mapping').delete().in('id', createdRoles.map(role => role.user_role_mapping_id).filter(role => role));
        console.log('Line----309 server.ts', data)

        redirectPath = getErrorRedirect(
          '/dashboard/signin/onboarding',
          'User update failed.',
          error.message
        );
      } else {
        redirectPath = getStatusRedirect(
          '/',
          'Success!',
          'Welcome onboard'
        );
      }
    }
  }

  return redirectPath;
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get('password')).trim();
  const passwordConfirm = String(formData.get('passwordConfirm')).trim();
  let redirectPath: string;

  // Check that the password and confirmation match
  if (password !== passwordConfirm) {
    redirectPath = getErrorRedirect(
      '/dashboard/signin/update_password',
      'Your password could not be updated.',
      'Passwords do not match.'
    );
  }

  const supabase = createClient();
  const { error, data } = await (await supabase).auth.updateUser({
    password
  });

  if (error) {
    redirectPath = getErrorRedirect(
      '/dashboard/signin/update_password',
      'Your password could not be updated.',
      error.message
    );
  } else if (data.user) {
    redirectPath = getStatusRedirect(
      '/',
      'Success!',
      'Your password has been updated.'
    );
  } else {
    redirectPath = getErrorRedirect(
      '/dashboard/signin/update_password',
      'Hmm... Something went wrong.',
      'Your password could not be updated.'
    );
  }

  return redirectPath;
}

export async function updateEmail(formData: FormData) {
  // Get form data
  const newEmail = String(formData.get('newEmail')).trim();

  // Check that the email is valid
  if (!isValidEmail(newEmail)) {
    return getErrorRedirect(
      '/dashboard/settings',
      'Your email could not be updated.',
      'Invalid email address.'
    );
  }

  const supabase = createClient();

  const callbackUrl = getURL(
    getStatusRedirect(
      '/dashboard/settings',
      'Success!',
      `Your email has been updated.`
    )
  );

  const { error } = await (await supabase).auth.updateUser(
    { email: newEmail },
    {
      emailRedirectTo: callbackUrl
    }
  );

  if (error) {
    return getErrorRedirect(
      '/dashboard/settings',
      'Your email could not be updated.',
      error.message
    );
  } else {
    return getStatusRedirect(
      '/dashboard/settings',
      'Confirmation emails sent.',
      `You will need to confirm the update by clicking the links sent to both the old and new email addresses.`
    );
  }
}

export async function updateName(formData: FormData) {
  // Get form data
  const fullName = String(formData.get('fullName')).trim();

  const supabase = createClient();
  const { error, data } = await (await supabase).auth.updateUser({
    data: { full_name: fullName }
  });

  if (error) {
    return getErrorRedirect(
      '/dashboard/settings',
      'Your name could not be updated.',
      error.message
    );
  } else if (data.user) {
    return getStatusRedirect(
      '/dashboard/settings',
      'Success!',
      'Your name has been updated.'
    );
  } else {
    return getErrorRedirect(
      '/dashboard/settings',
      'Hmm... Something went wrong.',
      'Your name could not be updated.'
    );
  }
}