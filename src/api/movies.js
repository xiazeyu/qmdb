import useSWRImmutable from 'swr/immutable';
import useSWR from 'swr';
import ENDPOINT from './endpoint';
import { mutate } from "swr"

export function genMoviesQueryUrl(inputParams){
  if (!inputParams){
    return `${ENDPOINT}/movies/search/`;
  }
  const { title, year, page } = inputParams;
  let params = '';
  if (title) {
    params = `${params}&title=${title}`;
  }
  if (year) {
    params = `${params}&year=${year}`;
  }
  if (page) {
    params = `${params}&page=${page}`;
  }
  return `${ENDPOINT}/movies/search/?${params}`;
}

export function useMovies(url) {
  const { data, error, isLoading } = useSWR(url,
    (...args) => fetch(...args).then(
      async (res) => {
        if (res.status === 200) {
          const result = await res.json()
          return result;
        } if (res.status === 429) {
          throw new Error(`${await res.text()} (Code: ${res.status})`);
        } else if (res.status === 400) {
          throw new Error(`${(await res.json()).message} (Code: ${res.status})`);
        } else {
          throw new Error(`Unexpected error. (Code: ${res.status})`);
        }
      },
    ),{keepPreviousData: true}
  );

  return {
    data,
    isLoading,
    isError: error,
  };
}

export function useMovie(id) {
  const { data, error, isLoading } = useSWRImmutable(
    `${ENDPOINT}/movies/data/${id}`,
    (...args) => fetch(...args).then(
      async (res) => {
        if (res.status === 200) {
          return res.json();
        } if (res.status === 429) {
          throw new Error(`${await res.text()} (Code: ${res.status})`);
        } else if (res.status === 400 || res.status === 404) {
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
