import React, { useContext, useState } from "react";
import LoginContext from "../context/LoginContext";

export default function EmailOTPModal({ handleCancel }) {
  const [passcode, setPasscode] = useState("");
  const [retries, setRetries] = useState(2);
  const [message, setMessage] = useState();
  const [disabled, setDisabled] = useState(false);
  const { login, setLogin } = useContext(LoginContext);

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
    <div className="modal">
      <h1>enter the one-time passcode sent to your email</h1>

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
      <button
        type="submit"
        className="cancel-button"
        onClick={() => {
          handleCancel();
          setDisabled(false);
        }}
        disabled={disabled}
      >
        cancel
      </button>
      <button className="ok-button" disabled={disabled} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
