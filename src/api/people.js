import useSWRImmutable from 'swr/immutable';
import ENDPOINT from './endpoint';

export default function usePeople(id, bearerAuth) {
  const authToken = bearerAuth || localStorage.getItem('accessToken');
  const { data, error, isLoading } = useSWRImmutable(
    `${ENDPOINT}/people/${id}`,
    (...args) => fetch(...args, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then(
      async (res) => {
        if (res.status === 200) {
          return res.json();
        } if (res.status === 429) {
          throw new Error(`${await res.text()} (Code: ${res.status})`);
        } else if (res.status === 400 || res.status === 401 || res.status === 404) {
          throw new Error(`${(await res.json()).message} (Code: ${res.status})`);
        } else {
          throw new Error(`Unexpected error. (Code: ${res.status})`);
        }
      },
    ),
  );

  return {
    data,
    isLoading,
    isError: error,
  };
}
