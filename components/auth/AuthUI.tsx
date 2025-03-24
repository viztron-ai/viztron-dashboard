'use client';

import PasswordSignIn from '@/components/auth-ui/PasswordSignIn';
import ForgotPassword from '@/components/auth-ui/ForgotPassword';
import UpdatePassword from '@/components/auth-ui/UpdatePassword';
import SignUp from '@/components/auth-ui/Signup';
import Onboarding from '../auth-ui/Onboarding';

export default function AuthUI(props: any) {
  return (
    <div className="my-auto mb-auto max-md:mt-8 flex flex-col md:max-w-full xl:max-w-[420px]">
      <p className="text-[32px] font-bold text-zinc-950 dark:text-white">
        {props.viewProp === 'signup'
          ? 'Sign Up'
          : props.viewProp === 'forgot_password'
            ? 'Forgot Password'
            : props.viewProp === 'update_password'
              ? 'Update Password'
              : props.viewProp === 'email_signin'
                ? 'Email Sign In'
                : props.viewProp === 'onboarding' ? 'Onboarding' : 'Sign In'}
      </p>
      <p className="mb-2.5 mt-2.5 font-normal text-zinc-950 dark:text-zinc-400">
        {props.viewProp === 'signup'
          ? 'Enter your email and password to sign up!'
          : props.viewProp === 'forgot_password'
            ? 'Enter your email to get a passoword reset link!'
            : props.viewProp === 'update_password'
              ? 'Choose a new password for your account!'
              : props.viewProp === 'email_signin'
                ? 'Enter your email to get a magic link!'
                : props.viewProp === 'onboarding' ? 'Fill up your detail to complete profile!' : 'Enter your email and password to sign in!'}
      </p>

      {props.viewProp === 'password_signin' && (
        <PasswordSignIn redirectMethod={props.redirectMethod} />
      )}

      {props.viewProp === 'forgot_password' && (
        <ForgotPassword
          redirectMethod={props.redirectMethod}
          disableButton={props.disableButton}
        />
      )}
      {props.viewProp === 'update_password' && (
        <UpdatePassword redirectMethod={props.redirectMethod} />
      )}
      {props.viewProp === 'signup' && (
        <SignUp redirectMethod={props.redirectMethod} />
      )}
      {props.viewProp === 'onboarding' && <Onboarding redirectMethod={props.redirectMethod}/>}
    </div>
  );
}
