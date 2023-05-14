import React, {
  createContext, useState, useEffect,
} from 'react';
import { postRefresh, postLogout } from '../api/auth';

const AuthContext = createContext();

function AuthProvider({ children }) { // eslint-disable-line react/prop-types
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [accessExpiry, setAccessExpiry] = useState(null);
  const [refreshExpiry, setRefreshExpiry] = useState(null);

  const canRefresh = () => {
    if (!refreshToken) return false;
    const currentDatetime = new Date().getTime();
    return currentDatetime < refreshExpiry;
  };

  const refreshState = () => {
    if (!accessToken) {
      setAccessToken(null);
      setAccessExpiry(null);
      return { valid: false, message: 'Access token not found.' };
    }
    const currentDatetime = new Date().getTime();
    if (currentDatetime > accessExpiry) {
      setAccessToken(null);
      setAccessExpiry(null);
      return { valid: false, message: 'Access token expired.' };
    }
    return { valid: true, message: 'Access token valid.' };
  };

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedAccessExpiry = localStorage.getItem('accessExpiry');
    const storedRefreshExpiry = localStorage.getItem('refreshExpiry');
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
    if (storedRefreshToken) {
      setRefreshToken(storedRefreshToken);
    }
    if (storedAccessExpiry) {
      setAccessExpiry(parseInt(storedAccessExpiry, 10));
    }
    if (storedRefreshExpiry) {
      setRefreshExpiry(parseInt(storedRefreshExpiry, 10));
    }
  }, []);

  const updateAccessToken = (token, expiresIn) => {
    setAccessToken(token);
    const currentDatetime = new Date().getTime();
    const expiryDatetime = currentDatetime + expiresIn * 1000;
    setAccessExpiry(expiryDatetime);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('accessExpiry', expiryDatetime);
  };

  const updateRefreshToken = (token, expiresIn) => {
    setRefreshToken(token);
    const currentDatetime = new Date().getTime();
    const expiryDatetime = currentDatetime + expiresIn * 1000;
    setRefreshExpiry(expiryDatetime);
    localStorage.setItem('refreshToken', token);
    localStorage.setItem('refreshExpiry', expiryDatetime);
  };

  const doRefresh = async () => {
    if (!canRefresh()) return { success: false, message: 'Refresh token expired.' };
    const { data, isError } = await postRefresh(refreshToken);
    if (isError) {
      return { success: false, message: data };
    }
    updateAccessToken(data.bearerToken.token, data.bearerToken.expires_in);
    updateRefreshToken(data.refreshToken.token, data.refreshToken.expires_in);
    return { success: true, message: 'Access token refreshed.' };
  };

  const doLogout = async () => {
    const { data, isError } = await postLogout(refreshToken);
    setAccessToken(null);
    setRefreshToken(null);
    setAccessExpiry(null);
    setRefreshExpiry(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessExpiry');
    localStorage.removeItem('refreshExpiry');
    if (isError) {
      return { success: false, message: data };
    }
    return { success: true, message: 'Logged out.' };
  };

  return (
    <AuthContext.Provider value={{ // eslint-disable-line react/jsx-no-constructed-context-values
      accessToken,
      refreshToken,
      accessExpiry,
      refreshExpiry,
      updateAccessToken,
      updateRefreshToken,
      refreshState,
      doRefresh,
      doLogout,
      canRefresh,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
