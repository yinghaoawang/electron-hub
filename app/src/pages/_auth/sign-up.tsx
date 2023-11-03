import { SignUp } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';

export default function SignUpPage() {
  const location = useLocation();
  return (
    <SignUp
      redirectUrl={location.pathname}
      signInUrl='/sign-in'
      routing='path'
      path='/sign-up'
    />
  );
}
