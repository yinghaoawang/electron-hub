import { useAuth } from '../contexts/AuthContext';

export default function useFetch() {
  const { authToken } = useAuth();
  const authenticatedFetch = async (input: RequestInfo, init?: RequestInit) => {
    return fetch(input, {
      headers: { Authorization: `Bearer ${await authToken}` },
      ...init
    }).then((res) => res.json());
  };
  return authenticatedFetch;
}
