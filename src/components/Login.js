import React, { useState } from "react";
import { magic } from "../lib/magic.js";
import EmailOTP from "./EmailOTP.js";
import EmailForm from "./EmailForm.js";

export default function Login({ setUser }) {
  const [showUI, setShowUI] = useState(false);
  const [otpLogin, setOtpLogin] = useState();

  const handleEmailLoginCustom = async (email) => {
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
    <div className="login componentContainer">
      <h1>Please sign up or login</h1>
      {showUI ? (
        <EmailOTP login={otpLogin} />
      ) : (
        <EmailForm handleEmailLoginCustom={handleEmailLoginCustom} />
      )}
    </div>
  );
}
