import { Navigate } from 'react-router-dom';
export default function RedirectToSignIn() {
  return <Navigate replace to='/sign-in' />;
}
