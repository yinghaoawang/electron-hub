export default function useFetch() {
  const authenticatedFetch = async (input: RequestInfo, init?: RequestInit) => {
    return fetch(input, {
      // headers: { Authorization: `Bearer ${await getToken()}` },s
      ...init
    }).then((res) => res.json());
  };
  return authenticatedFetch;
}
