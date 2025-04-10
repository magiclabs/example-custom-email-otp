import React, { useState } from "react";
import { LoginWithEmailOTPEventEmit } from "magic-sdk";

export default function MFAOTPModal({ handle, handleCancel }) {
  const [passcode, setPasscode] = useState("");
  const [retries, setRetries] = useState(2);
  const [message, setMessage] = useState("");
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setDisabled(true);
    setRetries((r) => r - 1);
    setPasscode("");

    // Send MFA OTP for verification
    handle.emit("verify-mfa-code", passcode);

    handle.on("invalid-mfa-otp", (res) => {
      console.log("invalid-mfa-otp");

      if (res && res.errorCode) {
        console.log("Error code:", res.errorCode);
      }

      // User entered invalid MFA OTP
      setDisabled(false);

      if (!retries) {
        setMessage("No more retries. Please try recovery flow.");
        // Instead of canceling, offer recovery option
      } else {
        // Prompt the user again for the MFA OTP
        setMessage(
          `Incorrect code. Please enter MFA OTP again. ${retries} ${
            retries === 1 ? "retry" : "retries"
          } left.`
        );
      }
    });
  };

  const handleLostDevice = () => {
    // This is the key function that initiates the recovery flow
    console.log("Initiating recovery flow due to lost device");
    try {
      // Emit the LostDevice event to trigger the recovery flow
      console.log("Emitting LostDevice event");
      handle.emit(LoginWithEmailOTPEventEmit.LostDevice);

      // RecoveryCodeSentHandle event will be handled by the parent component
      // which will show the RecoveryCodeModal
      console.log("Waiting for RecoveryCodeSentHandle event");

      // Disable the UI while we wait
      setDisabled(true);
      setMessage("Initiating recovery flow... Please wait.");
    } catch (error) {
      console.error("Error initiating recovery flow:", error);
      setDisabled(false);
    }
  };

  return (
    <div className="modal">
      <h1>Enter the code from your authenticator app</h1>

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
          placeholder="Enter code"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value.replace(" ", ""))}
        />
      </form>

      <div className="modal-footer">
        <button
          className="cancel-button"
          onClick={() => {
            handleCancel();
            setDisabled(false);
          }}
          disabled={disabled}
        >
          Cancel
        </button>
        <button
          className="ok-button mfa-otp-submit"
          disabled={disabled}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>

      <div
        className="lost-device-container"
        style={{ marginTop: "20px", textAlign: "center" }}
      >
        <button
          className="text-button lost-device-button"
          onClick={handleLostDevice}
          disabled={disabled}
        >
          Lost your device? Use recovery code
        </button>
      </div>
    </div>
  );
}
