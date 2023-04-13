import React from "react";
import { magic } from "../lib/magic";

export default function Logout({ setUser }) {
  const handleLogout = async () => {
    const loggedOut = await magic.user.logout();

    loggedOut && setUser({ user: null });

    console.log("user logged out:", loggedOut);
  };

  return (
    <button className="cancel-button" onClick={handleLogout}>
      Logout
    </button>
  );
}
