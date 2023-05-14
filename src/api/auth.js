import ENDPOINT from './endpoint';

class ErrorNeedsRelogin extends Error {
  constructor(message) {
    super(message);
    this.name = 'ErrorNeedsRelogin';
  }
}

export async function postRegister(email, password) {
  const url = `${ENDPOINT}/user/register`;
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  }).then(
    async (res) => {
      if (res.status === 201) {
        return {
          data: (await res.json()).message,
          isError: false,
        };
      } if (res.status === 429) {
        throw new Error(`${await res.text()} (Code: ${res.status})`);
      } else if (res.status === 400 || res.status === 409) {
        throw new Error(`${(await res.json()).message} (Code: ${res.status})`);
      } else {
        throw new Error(`Unexpected error. (Code: ${res.status})`);
      }
    },
  ).catch((error) => ({
    data: error.message,
    isError: true,
  }));
}

export async function postLogin(email, password, longExpiry) {
  const url = `${ENDPOINT}/user/login`;
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      longExpiry,
    }),
  }).then(
    async (res) => {
      if (res.status === 200) {
        return {
          data: await res.json(),
          isError: false,
        };
      } if (res.status === 429) {
        throw new Error(`${await res.text()} (Code: ${res.status})`);
      } else if (res.status === 400 || res.status === 401) {
        throw new Error(`${(await res.json()).message} (Code: ${res.status})`);
      } else {
        throw new Error(`Unexpected error. (Code: ${res.status})`);
      }
    },
  ).catch((error) => ({
    data: error.message,
    isError: true,
  }));
}

export async function postRefresh(refreshToken) {
  const url = `${ENDPOINT}/user/refresh`;
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refreshToken,
    }),
  }).then(
    async (res) => {
      if (res.status === 200) {
        return {
          data: await res.json(),
          isError: false,
        };
      } if (res.status === 429) {
        throw new Error(`${await res.text()} (Code: ${res.status})`);
      } else if (res.status === 400) {
        throw new Error(`${(await res.json()).message} (Code: ${res.status})`);
      } else if (res.status === 401) {
        throw new ErrorNeedsRelogin(`${(await res.json()).message} (Code: ${res.status})`);
      } else {
        throw new Error(`Unexpected error. (Code: ${res.status})`);
      }
    },
  ).catch((error) => {
    if (error instanceof ErrorNeedsRelogin) {
      return {
        data: error.message,
        isError: true,
        needsRelogin: true,
      };
    }
    return {
      data: error.message,
      isError: true,
    };
  });
}

export async function postLogout(refreshToken) {
  const url = `${ENDPOINT}/user/logout`;
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refreshToken,
    }),
  }).then(
    async (res) => {
      if (res.status === 200) {
        return {
          data: await res.json(),
          isError: false,
        };
      } if (res.status === 429) {
        throw new Error(`${await res.text()} (Code: ${res.status})`);
      } else if (res.status === 400 || res.status === 401) {
        throw new Error(`${(await res.json()).message} (Code: ${res.status})`);
      } else {
        throw new Error(`Unexpected error. (Code: ${res.status})`);
      }
    },
  ).catch((error) => ({
    data: error.message,
    isError: true,
  }));
}
