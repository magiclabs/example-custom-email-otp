import React, { useState } from "react";

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
    });
  };

  return (
    <div className="modal">
      <h1>enter the code from your authenticator app</h1>

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
