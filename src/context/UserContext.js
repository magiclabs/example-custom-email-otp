import { createContext, useState } from "react";

// Create a context with a default value (optional)
const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  // You can manage state here (e.g., user info)
  const [user, setUser] = useState(undefined);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
