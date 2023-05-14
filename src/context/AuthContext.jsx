import React, {
  createContext, useState,
} from 'react';
import { postRefresh, postLogout } from '../api/auth';

const AuthContext = createContext();

function AuthProvider({ children }) { // eslint-disable-line react/prop-types
  const [tokenValid, setTokenValid] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [accessExpiry, setAccessExpiry] = useState(null);
  const [refreshExpiry, setRefreshExpiry] = useState(null);

  const updateAccessToken = (token, expiresIn) => {
    setAccessToken(token);
    const currentDatetime = new Date().getTime();
    const expiryDatetime = currentDatetime + expiresIn * 1000;
    setAccessExpiry(expiryDatetime);
    setTokenValid(true);
    console.log('Access token updated.', token, new Date(expiryDatetime).toString(), tokenValid);
  };

  const updateRefreshToken = (token, expiresIn) => {
    setRefreshToken(token);
    const currentDatetime = new Date().getTime();
    const expiryDatetime = currentDatetime + expiresIn * 1000;
    setRefreshExpiry(expiryDatetime);
    console.log('Refresh token updated.', token, new Date(expiryDatetime).toString(), tokenValid);
  };

  const canRefresh = () => {
    if (!refreshToken) return false;
    const currentDatetime = new Date().getTime();
    return currentDatetime < refreshExpiry;
  };

  const doRefresh = async () => {
    if (!accessToken) {
      setTokenValid(false);
      return { valid: false, message: 'Access token not found.' };
    }
    const currentDatetime = new Date().getTime();
    if (currentDatetime < accessExpiry) {
      setTokenValid(true);
      return { valid: true, message: 'Access token is valid.' };
    }
    if (canRefresh()) {
      const { data, isError } = await postRefresh(refreshToken);
      if (isError) {
        setTokenValid(false);
        return { valid: false, message: data };
      }
      setTokenValid(true);
      updateAccessToken(data.bearerToken.token, data.bearerToken.expires_in);
      updateRefreshToken(data.refreshToken.token, data.refreshToken.expires_in);
      return { valid: true, message: 'Access token refreshed.' };
    }
    setTokenValid(false);
    return { valid: false, message: 'Refresh token expired.' };
  };

  const doLogout = async () => {
    if (!tokenValid) return { success: true, message: 'Tokens invalid.' };
    const { data, isError } = await postLogout(refreshToken);
    if (isError) {
      return { success: false, message: data };
    }
    setTokenValid(false);
    setAccessToken(null);
    setRefreshToken(null);
    setAccessExpiry(null);
    setRefreshExpiry(null);
    return { success: true, message: 'Logged out.' };
  };

  return (
    <AuthContext.Provider value={{ // eslint-disable-line react/jsx-no-constructed-context-values
      accessToken,
      refreshToken,
      accessExpiry,
      refreshExpiry,
      tokenValid,
      updateAccessToken,
      updateRefreshToken,
      doRefresh,
      doLogout,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
