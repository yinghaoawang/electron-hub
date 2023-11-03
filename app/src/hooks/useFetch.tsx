import { useAuth } from '@clerk/clerk-react';

export default function useFetch() {
  const { getToken } = useAuth();

  const authenticatedFetch = async (input: RequestInfo, init?: RequestInit) => {
    return fetch(input, {
      headers: { Authorization: `Bearer ${await getToken()}` },
      ...init
    }).then((res) => res.json());
  };
  return authenticatedFetch;
}
