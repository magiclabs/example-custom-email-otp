import React, { useState } from "react";
import { magic } from "../lib/magic.js";
import OTPModal from "./OTPModal.js";
import EmailForm from "./EmailForm.js";
import DeviceRegistration from "./DeviceRegistration.js";

export default function Login({ setUser }) {
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showDeviceRegistrationModal, setShowDeviceRegistrationModal] =
    useState(false);
  const [otpLogin, setOtpLogin] = useState();

  const handleEmailLoginCustom = async (email) => {
    try {
      setOtpLogin();
      const otpLogin = magic.auth.loginWithEmailOTP({
        email,
        showUI: false,
        deviceCheckUI: false,
      });
      setOtpLogin(otpLogin);

      /* EVENT HANDLING
      
        type LoginWithEmailOTPEventHandlers = {
          'email-otp-sent': () => void;
          'verify-email-otp': (otp: string) => void;
          'invalid-email-otp': () => void;
          cancel: () => void;
        };

        type DeviceVerificationEventHandlers = {
          'device-needs-approval`: () => void;
          'device-verification-email-sent`: () => void;
          'device-approved`: () => void;
          'device-verification-link-expired`: () => void;
          device-retry: () => void;
        }
      */

      otpLogin
        .on("device-needs-approval", () => {
          // is called when device is not recognized and requires approval

          setShowDeviceRegistrationModal(true);
        })
        .on("device-approved", () => {
          // is called when the device has been approved

          setShowDeviceRegistrationModal(false);
        })
        .on("email-otp-sent", () => {
          // The email has been sent to the user

          setShowOTPModal(true);
        })
        .on("done", (result) => {
          handleGetMetadata();

          console.log(`DID Token: %c${result}`, "color: orange");
        })
        .catch((err) => {
          console.log("%cError caught during login:\n", "color: orange");
          console.error(err);
        })
        .on("settled", () => {
          setOtpLogin();
          setShowOTPModal(false);
          setShowDeviceRegistrationModal(false);
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

  const handleCancel = () => {
    try {
      // otpLogin.emit("cancel");
      setShowOTPModal(false);

      console.log("%cUser canceled login.", "color: orange");
    } catch (err) {
      console.log("Error canceling login:", err);
    }
  };

  return (
    <div className="login">
      {showDeviceRegistrationModal ? (
        <DeviceRegistration
          login={otpLogin}
          handleCancel={handleCancel}
          setShowDeviceRegistrationModal={setShowDeviceRegistrationModal}
        />
      ) : showOTPModal ? (
        <OTPModal login={otpLogin} handleCancel={handleCancel}/>
      ) : (
        <EmailForm handleEmailLoginCustom={handleEmailLoginCustom}/>
      )}

      <div>
        <button className="ok-button" onClick={() => {
          magic.user.isLoggedIn().then((isLoggedIn) => {
            alert("isLoggedIn:" + isLoggedIn)
          });
        }}>
          is logged in
        </button>
      </div>
    </div>
  );
}
