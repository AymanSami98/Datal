// AuthContext.js

import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// Define PropTypes for the AuthProvider component
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
