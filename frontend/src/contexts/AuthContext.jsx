import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, googleLogin as apiGoogleLogin, register as apiRegister, getProfile } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('mshop_token'));
  const [loading, setLoading] = useState(!!token);

  const logout = () => {
    localStorage.removeItem('mshop_token');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      setLoading(true);
      getProfile()
        .then(res => setUser(res.data))
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    }
  }, [token]);
  const login = async (email, password) => {
    const res = await apiLogin({ email, password });
    localStorage.setItem('mshop_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const loginWithGoogle = async (credential) => {
    const res = await apiGoogleLogin(credential);
    localStorage.setItem('mshop_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (data) => {
    const res = await apiRegister(data);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, loginWithGoogle, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
