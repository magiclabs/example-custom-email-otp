import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { UserProvider } from "./context/UserContext";
import { LoginProvider } from "./context/LoginContext";
import { MFASettingsProvider } from "./context/MFASettingsContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
      <LoginProvider>
        <MFASettingsProvider>
          <App />
        </MFASettingsProvider>
      </LoginProvider>
    </UserProvider>
  </React.StrictMode>
);
