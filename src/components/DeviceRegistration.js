import React, { useState } from "react";

export default function DeviceRegistration({ login, handleCancel }) {
  const [message, setMessage] = useState();
  const [retry, setRetry] = useState(false);
  const [disabled, setDisabled] = useState(false);

  login
    .on("device-verification-email-sent", () => {
      // is called when the device verification email is sent

      setMessage("Device registration instructions have been emailed to you!");
    })
    .on("device-verification-link-expired", () => {
      // is called when the device verification link is expired

      setMessage("Device verification link expired! Please try again later.");

      // Retry device verification
      setRetry(true);
    });

  const handleRetry = async () => {
    try {
      login.emit("device-retry");
    } catch (err) {
      console.log("Error retrying device registration:");
      console.error(err);
    }
  };

  return (
    <div className="modal device-registration">
      <h1>Unrecognized Device</h1>
      <div className="message-wrapper">
        {message ? (
          <code id="device-reg-message">{message}</code>
        ) : (
          <code id="device-reg-message">
            <p>Your device requires registration.</p>
            <p>
              We sent an email to you with instructions to register this device.
            </p>
            <p className="small">
              This one-time approval keeps your account secure.
            </p>
          </code>
        )}
      </div>
      <div className="retry-cancel">
        {retry && (
          <button
            className="retry-button"
            onClick={handleRetry}
            disabled={disabled}
          >
            Retry?
          </button>
        )}
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
    </div>
  );
}
