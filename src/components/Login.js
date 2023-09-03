import React, { useState } from "react";
import { magic } from "../lib/magic.js";
import OTPModal from "./OTPModal.js";
import EmailForm from "./EmailForm.js";

export default function Login({ setUser }) {
  const [showOTPModal, setShowOTPModal] = useState(false);
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
          setShowOTPModal(true);
        })
        .on("done", (result) => {
          handleGetMetadata();

          console.log(`DID Token: %c${result}`, "color: orange");
        })
        .catch((err) => {
          console.log("%cError caught during login:\n", "color: orange");

          console.log(err);
        })
        .on("settled", () => {
          setOtpLogin();
          setShowOTPModal(false);
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
    <div className="login">
      {showOTPModal ? (
        <OTPModal login={otpLogin} />
      ) : (
        <EmailForm handleEmailLoginCustom={handleEmailLoginCustom} />
      )}
    </div>
  );
}
