import { createContext, useState } from "react";

// Create a context with a default value (optional)
const LoginContext = createContext(null);

export const LoginProvider = ({ children }) => {
  const [login, setLogin] = useState(undefined);

  return (
    <LoginContext.Provider value={{ login, setLogin }}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContext;
