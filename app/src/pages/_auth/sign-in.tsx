import { SignIn } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';

export default function SignInPage() {
  const location = useLocation();
  return (
    <SignIn
      redirectUrl={location.pathname}
      signUpUrl='/sign-up'
      routing='path'
      path='/sign-in'
    />
  );
}
