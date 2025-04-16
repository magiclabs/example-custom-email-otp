import React, { useContext, useState } from "react";
import { magic } from "../lib/magic.js";
import EmailOTPModal from "./EmailOTPModal.js";
import EmailForm from "./EmailForm.js";
import DeviceRegistration from "./DeviceRegistration.js";
import MFAOTPModal from "./MFA/MFAOTPModal.js";
import MFARecoveryModal from "./MFA/MFARecoveryModal.js";
import LoginContext from "../context/LoginContext.js";

export default function Login({ setUser }) {
  const [showEmailOTPModal, setShowEmailOTPModal] = useState(false);
  const [showMFAOTPModal, setShowMFAOTPModal] = useState(false);
  const [showMFARecoveryModal, setShowMFARecoveryModal] = useState(false);
  const [showDeviceRegistrationModal, setShowDeviceRegistrationModal] =
    useState(false);
  const { login, setLogin } = useContext(LoginContext);

  const handleEmailLoginCustom = async (email) => {
    try {
      setLogin();
      const login = magic.auth.loginWithEmailOTP({
        email,
        showUI: false,
        deviceCheckUI: false,
      });
      setLogin(login);

      login
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

          setShowEmailOTPModal(true);
        })
        .on("mfa-sent-handle", (mfaHandle) => {
          // Display the MFA OTP modal

          setShowEmailOTPModal(false);
          setShowMFAOTPModal(true);
        })
        .on("done", (result) => {
          handleGetMetadata();

          console.log(`DID Token: %c${result}`, "color: orange");
        })
        .catch((err) => {
          console.log("%cError caught during login:\n", "color: red");
          console.error(err);
          setLogin();
        })
        .on("settled", () => {
          setLogin();
          setShowEmailOTPModal(false);
          setShowMFAOTPModal(false);
          setShowMFARecoveryModal(false);
          setShowDeviceRegistrationModal(false);
        });
    } catch (err) {
      console.error(err);
    }
  };

  const handleGetMetadata = async () => {
    const metadata = await magic.user.getInfo();

    setUser(metadata);

    console.table(metadata);
  };

  const handleCancel = () => {
    try {
      login.emit("cancel");

      console.log("%cUser canceled login.", "color: orange");
    } catch (err) {
      console.log("Error canceling login:", err);
    }
  };

  return (
    <div className="login">
      {showDeviceRegistrationModal ? (
        <DeviceRegistration
          handleCancel={handleCancel}
          setShowDeviceRegistrationModal={setShowDeviceRegistrationModal}
        />
      ) : showEmailOTPModal ? (
        <EmailOTPModal handleCancel={handleCancel} />
      ) : showMFAOTPModal ? (
        <MFAOTPModal
          handleCancel={handleCancel}
          setShowMFAOTPModal={setShowMFAOTPModal}
          setShowMFARecoveryModal={setShowMFARecoveryModal}
        />
      ) : showMFARecoveryModal ? (
        <MFARecoveryModal
          handleCancel={handleCancel}
          setShowMFARecoveryModal={setShowMFARecoveryModal}
        />
      ) : (
        <EmailForm handleEmailLoginCustom={handleEmailLoginCustom} />
      )}
    </div>
  );
}
