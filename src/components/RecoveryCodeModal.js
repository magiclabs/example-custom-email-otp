import React, { useState, useEffect } from "react";
import {
  LoginWithEmailOTPEventEmit,
  LoginWithEmailOTPEventOnReceived,
} from "magic-sdk";

export default function RecoveryCodeModal({ handle, handleCancel }) {
  const [recoveryCode, setRecoveryCode] = useState("");
  const [message, setMessage] = useState("");
  const [disabled, setDisabled] = useState(false);

  // Add listener for InvalidRecoveryCode event
  useEffect(() => {
    if (!handle) return;

    const invalidCodeListener = () => {
      console.log("Invalid recovery code received");
      setDisabled(false);
      setMessage("Invalid recovery code. Please try again.");
    };

    // Register listener for InvalidRecoveryCode event
    handle.on(
      LoginWithEmailOTPEventOnReceived.InvalidRecoveryCode,
      invalidCodeListener
    );

    // Clean up the listener when component unmounts
    return () => {
      handle.off(
        LoginWithEmailOTPEventOnReceived.InvalidRecoveryCode,
        invalidCodeListener
      );
    };
  }, [handle]);

  // This component is only shown after RecoveryCodeSentHandle event has been received,
  // so we can directly submit the recovery code when the user clicks Submit.

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!recoveryCode.trim()) {
      setMessage("Please enter your recovery code");
      return;
    }

    setDisabled(true);
    setMessage("Verifying recovery code...");

    try {
      // The lost device event has already been emitted and RecoveryCodeSentHandle
      // has already been received (that's why this modal is showing),
      // so we can directly submit the recovery code.
      console.log("Submitting recovery code for verification");
      handle.emit(LoginWithEmailOTPEventEmit.VerifyRecoveryCode, recoveryCode);

      // Reset the input field
      setRecoveryCode("");
    } catch (error) {
      console.error("Error submitting recovery code:", error);
      setDisabled(false);
      setMessage("Error submitting recovery code. Please try again.");
    }
  };

  return (
    <div className="modal">
      <h1>Enter your recovery code</h1>
      <p>Please enter the recovery code you received during MFA setup.</p>

      {message && (
        <div className="message-wrapper">
          <code id="recovery-message">{message}</code>
        </div>
      )}

      <form className="otp-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="recoveryCode"
          id="recoveryCode"
          placeholder="Enter recovery code"
          value={recoveryCode}
          onChange={(e) => setRecoveryCode(e.target.value.replace(/\s/g, ""))}
          disabled={disabled}
          autoFocus
        />
      </form>

      <div className="modal-footer">
        <button
          className="cancel-button"
          onClick={() => {
            handle.emit(LoginWithEmailOTPEventEmit.Cancel);
            handleCancel();
          }}
          disabled={disabled}
        >
          Cancel
        </button>
        <button
          className="ok-button recovery-submit"
          disabled={disabled}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
