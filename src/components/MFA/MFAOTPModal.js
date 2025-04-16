import React, { useContext, useEffect, useState } from "react";
import LoginContext from "../../context/LoginContext";
import MFASettingsContext from "../../context/MFASettingsContext";
import UserContext from "../../context/UserContext";

export default function MFAOTPModal({
  handleNext,
  handleCancel,
  setShowMFAOTPModal,
  setShowMFARecoveryModal,
}) {
  const [passcode, setPasscode] = useState("");
  const [message, setMessage] = useState("");
  const [retries, setRetries] = useState(2);
  const [disabled, setDisabled] = useState(false);
  const [isMFAEnabled, setIsMFAEnabled] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const { login, setLogin } = useContext(LoginContext);
  const { mfaSettings, setMFASettings } = useContext(MFASettingsContext);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      setDisabled(true);
      setRetries((r) => r - 1);
      setPasscode("");

      const handle = typeof login === "undefined" ? mfaSettings : login;

      console.log("handleSubmit - MFAOTPModal", passcode, handle);

      // Send MFA OTP for verification
      handle.emit("verify-mfa-code", passcode);

      handle
        .on("invalid-mfa-otp", (res) => {
          if (res && res.errorCode) {
            console.log("Error code:", res.errorCode);
          }

          // User entered invalid MFA OTP
          setDisabled(false);

          if (!retries) {
            setMessage("No more retries. Please try again later.");

            handleCancel();
          } else {
            // Prompt the user again for the MFA OTP
            setMessage(
              `Incorrect code. Please enter MFA OTP again. ${retries} ${
                retries === 1 ? "retry" : "retries"
              } left.`
            );
          }
        })
        .on("error", (err) => {
          console.error(err);
        });
    } catch (err) {
      console.log("Error submitting MFA OTP");
      console.error(err);
    }
  };

  const handleSwitchToRecoveryCode = () => {
    console.log("User switching to recovery code login");
    if (setShowMFAOTPModal && setShowMFARecoveryModal) {
      setShowMFAOTPModal(false);
      setShowMFARecoveryModal(true);
    }
  };

  const handleLostDevice = () => {
    console.log("User lost device");
    if (mfaSettings && mfaSettings.emit) {
      console.log("mfaSettings.emit lost-device - before");
      mfaSettings.emit("lost-device");
      console.log("mfaSettings.emit lost-device - after");
    } else {
      console.error("mfaSettings or mfaSettings.emit is undefined");
    }

    if (handleNext) {
      handleNext();
    } else {
      setShowMFAOTPModal(false);
      setShowMFARecoveryModal(true);
    }
  };

  useEffect(() => {
    if (user && user.isMfaEnabled) {
      setIsMFAEnabled(user.isMfaEnabled);
      console.log("MFA is enabled for this user", user);
    }
  }, [user]);

  return (
    <div className="modal">
      <h1>Please enter the code from your authenticator app</h1>

      {message && (
        <div className="message-wrapper">
          <code id="otp-message">{message}</code>
        </div>
      )}

      <form className="otp-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="passcode"
          id="passcode"
          className="passcode"
          placeholder="Enter code"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value.replace(" ", ""))}
        />
      </form>

      <div className="lost-device" onClick={handleSwitchToRecoveryCode}>
        🔑 Use recovery code instead 🔑
      </div>

      {isMFAEnabled && (
        <div className="lost-device" onClick={handleLostDevice}>
          😔 I lost my device 😔
        </div>
      )}

      <div className="modal-footer">
        <button
          className="cancel-button"
          onClick={() => {
            handleCancel();
            setDisabled(false);
          }}
          disabled={disabled}
        >
          cancel
        </button>
        <button
          className="ok-button mfa-otp-submit"
          disabled={disabled}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
