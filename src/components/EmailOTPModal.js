import React, { useState } from "react";

export default function EmailOTPModal({ login, handleCancel }) {
  const [passcode, setPasscode] = useState("");
  const [retries, setRetries] = useState(2);
  const [message, setMessage] = useState();
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setDisabled(true);
    setRetries((r) => r - 1);
    setPasscode("");

    // Send OTP for verification
    login.emit("verify-email-otp", passcode);

    login.on("invalid-email-otp", () => {
      // User entered invalid OTP
      setDisabled(false);

      if (!retries) {
        setMessage("No more retries. Please try again later.");

        // Cancel the login
        login.emit("cancel");
      } else {
        // Prompt the user again for the OTP
        setMessage(
          `Incorrect code. Please enter OTP again. ${retries} ${
            retries === 1 ? "retry" : "retries"
          } left.`
        );
      }
    });
  };

  return (
    <div className="modal email-otp">
      <h1>enter the one-time passcode sent to your email</h1>
      
      <div className="message-wrapper">
        {message && <code id="otp-message">{message}</code>}
      </div>
      
      <form className="otp-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="passcode"
          id="passcode"
          placeholder="Enter code"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value.replace(" ", ""))}
        />
        <button className="ok-button" type="submit" disabled={disabled}>
          Submit
        </button>
      </form>
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
    </div>
  );
}
