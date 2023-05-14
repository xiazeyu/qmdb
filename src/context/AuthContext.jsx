import React, {
  createContext, useState, useEffect, useCallback, useMemo,
} from 'react';
import { postRefresh, postLogout } from '../api/auth';

const AuthContext = createContext();

function AuthProvider({ children }) { // eslint-disable-line react/prop-types
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [accessExpiry, setAccessExpiry] = useState(null);
  const [refreshExpiry, setRefreshExpiry] = useState(null);

  const canRefresh = useCallback(() => {
    if (!refreshToken) return false;
    const currentDatetime = new Date().getTime();
    return currentDatetime < refreshExpiry;
  }, [refreshToken, refreshExpiry]);

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

  const updateAccessToken = useCallback((token, expiresIn) => {
    setAccessToken(token);
    const currentDatetime = new Date().getTime();
    const expiryDatetime = currentDatetime + expiresIn * 1000;
    setAccessExpiry(expiryDatetime);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('accessExpiry', expiryDatetime);
  }, []);

  const updateRefreshToken = useCallback((token, expiresIn) => {
    setRefreshToken(token);
    const currentDatetime = new Date().getTime();
    const expiryDatetime = currentDatetime + expiresIn * 1000;
    setRefreshExpiry(expiryDatetime);
    localStorage.setItem('refreshToken', token);
    localStorage.setItem('refreshExpiry', expiryDatetime);
  }, []);

  const doLogout = useCallback(async () => {
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
  }, [refreshToken]);

  const doRefresh = useCallback(async () => {
    if (!canRefresh()) return { success: false, message: 'Refresh token expired.' };
    const { data, isError, needsRelogin } = await postRefresh(refreshToken);
    if (needsRelogin) {
      await doLogout();
      return { success: false, message: 'Please login again.' };
    }
    if (isError) {
      return { success: false, message: data };
    }
    updateAccessToken(data.bearerToken.token, data.bearerToken.expires_in);
    updateRefreshToken(data.refreshToken.token, data.refreshToken.expires_in);
    return { success: true, message: 'Access token refreshed.' };
  }, [canRefresh, refreshToken, updateAccessToken, updateRefreshToken, doLogout]);

  const values = useMemo(() => ({
    accessToken,
    refreshToken,
    accessExpiry,
    refreshExpiry,
    updateAccessToken,
    updateRefreshToken,
    doRefresh,
    doLogout,
    canRefresh,
  }), [accessToken,
    refreshToken,
    accessExpiry,
    refreshExpiry,
    updateAccessToken,
    updateRefreshToken,
    doRefresh,
    doLogout,
    canRefresh,
  ]);

  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
