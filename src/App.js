import { useContext, useEffect, useState } from "react";
import { magic } from "./lib/magic.js";

// components
import Header from "./components/Header.js";
import Loading from "./components/Loading.js";
import LoginForm from "./components/Login.js";
import Logout from "./components/Logout.js";
import UserInfo from "./components/UserInfo.js";
import Footer from "./components/Footer.js";
import ShowSettings from "./components/MFA/ShowSettings.js";
import EnableMFA from "./components/MFA/EnableMFA.js";
import UserContext from "./context/UserContext.js";
import DisableMFA from "./components/MFA/DisableMFA.js";

function App() {
  const { user, setUser } = useContext(UserContext);
  const [showMFASettings, setShowMFASettings] = useState(false);

  useEffect(() => {
    setUser({ loading: true });

    magic.user
      .isLoggedIn()
      .then((isLoggedIn) => {
        if (isLoggedIn) {
          magic.user.getInfo().then((userData) => {
            setUser(userData);
          });
        } else {
          setUser({ user: undefined });
        }
      })
      .catch((err) => {
        console.log("Error getting session status");
        console.error(err);
        magic.user.logout().then((isLoggedOut) => {
          console.log("User is logged out: ", isLoggedOut);
          setUser({ user: undefined });
        });
      });
  }, [setUser]);

  return (
    <>
      <Header />
      <main>
        {user?.loading ? (
          <Loading />
        ) : user?.issuer ? (
          <div className="user-container">
            <UserInfo userInfo={user} />
            <ShowSettings
              userInfo={user}
              setShowMFASettings={setShowMFASettings}
            />
            <Logout setUser={setUser} />
          </div>
        ) : (
          <LoginForm setUser={setUser} />
        )}

        {showMFASettings === true ? (
          user.isMfaEnabled ? (
            <DisableMFA setShowMFASettings={setShowMFASettings} />
          ) : (
            <EnableMFA setShowMFASettings={setShowMFASettings} />
          )
        ) : (
          ""
        )}
      </main>

      <Footer />
    </>
  );
}

export default App;
