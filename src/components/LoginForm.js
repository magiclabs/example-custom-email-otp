import React, { useState } from "react";
import { magic } from "../lib/magic.js";
import EmailOTP from "./EmailOTP.js";

export default function LoginForm({ setUser }) {
  const [email, setEmail] = useState("");
  const [showUI, setShowUI] = useState(false);
  const [otpLogin, setOtpLogin] = useState();

  const handleEmailLoginCustom = async () => {
    try {
      setOtpLogin();
      const otpLogin = magic.auth.loginWithEmailOTP({ email, showUI: false });

      /*
        type LoginWithEmailOTPEvents = {
          'email-otp-sent': () => void;
          'verify-email-otp': (otp: string) => void;
          'invalid-email-otp': () => void;
          cancel: () => void;
        };
      */

      otpLogin
        .on("email-otp-sent", () => {
          console.log("on email OTP sent!");

          setOtpLogin(otpLogin);
          setShowUI(true);
        })
        .on("done", (result) => {
          handleGetMetadata();

          console.log(`DID Token: %c${result}`, "color: orange");
        })
        .on("settled", () => {
          setOtpLogin();
          setShowUI(false);
          setEmail("");
        })
        .catch((err) => {
          console.log("%cError caught during login:\n", "color: orange");

          console.log(err);
        });
    } catch (err) {
      console.error(err);
    }
  };

  const handleGetMetadata = async () => {
    const metadata = await magic.user.getMetadata();

    setUser(metadata);

    console.table(metadata);
  };

  return (
    <div className="loginForm componentContainer">
      <h1>Please sign up or login</h1>
      <div>
        {showUI ? (
          <EmailOTP login={otpLogin} />
        ) : (
          <>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleEmailLoginCustom}>Login</button>
          </>
        )}
      </div>
    </div>
  );
}
