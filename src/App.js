import { useEffect, useState } from "react";
import Header from "./components/Header.js";
import Loading from "./components/Loading.js";
import LoginForm from "./components/LoginForm.js";
import Logout from "./components/Logout.js";
import UserInfo from "./components/UserInfo.js";
import { magic } from "./lib/magic.js";

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    setUser({ loading: true });

    magic.user
      .isLoggedIn()
      .then((isLoggedIn) => {
        if (isLoggedIn) {
          magic.user.getMetadata().then((userData) => {
            setUser(userData);
            // fetchBalance(userData.publicAddress);
          });
        } else {
          setUser({ user: null });
        }
      })
      .catch((err) => {
        console.log("Error, isLoggedIn():");
        console.error(err);
        magic.user.logout().then(console.log);
        setUser({ user: null });
      });
  }, []);

  return (
    <div className="App">
      <Header />

      {user?.loading ? (
        <Loading />
      ) : user?.issuer ? (
        <>
          <UserInfo userInfo={user} />
          <Logout setUser={setUser} />
        </>
      ) : (
        <LoginForm setUser={setUser} />
      )}
    </div>
  );
}

export default App;
