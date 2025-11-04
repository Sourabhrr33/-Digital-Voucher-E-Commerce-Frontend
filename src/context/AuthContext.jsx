import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = (user, token) => {
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/vouchers");
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
