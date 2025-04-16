import React, { useContext, useState } from "react";
import LoginContext from "../../context/LoginContext";
import MFASettingsContext from "../../context/MFASettingsContext";

export default function MFARecoveryModal({
  handleCancel,
  handleNext,
  setShowMFARecoveryModal,
}) {
  const [recoveryCode, setRecoveryCode] = useState("");
  const [lostRecoveryCode, setLostRecoveryCode] = useState(false);
  const [retries, setRetries] = useState(2);
  const [message, setMessage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const { login } = useContext(LoginContext);
  const { mfaSettings } = useContext(MFASettingsContext);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      // setIsLoading(true);
      setDisabled(true);
      setRetries((r) => r - 1);
      setRecoveryCode("");

      const handle = typeof login === "undefined" ? mfaSettings : login;

      console.log("handleSubmit - MFARecoveryModal", recoveryCode, handle);

      handle.emit("lost-device", recoveryCode);

      handle
        .on("recovery-code-sent-handle", () => {
          console.log("recovery-code-sent-handle");

          // Emit the recovery code to verify
          handle.emit("verify-recovery-code", recoveryCode);
        })
        .on("invalid-recovery-code", (err) => {
          // User entered invalid Recovery code
          console.log("invalid-recovery-code", recoveryCode, err);
          setDisabled(false);

          if (!retries) {
            setMessage("No more retries. Please try again later.");

            handleCancel();
          } else {
            // Prompt the user again for the Recovery code
            setMessage(
              `Incorrect code. Please enter Recovery code again. ${retries} ${
                retries === 1 ? "retry" : "retries"
              } left.`
            );
          }
        })
        .on("recovery-code-success", () => {
          console.log("recovery-code-success");

          if (handleNext) {
            handleNext();
          }
          setShowMFARecoveryModal(false);
        })
        .on("error", (err) => {
          console.error("Error event:", err);
        });
    } catch (err) {
      setDisabled(false);
      console.error(err);
    }
  };

  const handleLostRecoveryCode = () => {
    setLostRecoveryCode(true);
  };

  return (
    <div className="modal">
      {lostRecoveryCode ? (
        <>
          <h1>Lost your recovery code?</h1>
          <div className="lost-recovery-message-wrapper">
            <div>
              For help recovering your account, please contact our support team.
            </div>
          </div>
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
        </>
      ) : (
        <>
          <h1>Enter your recovery code to continue.</h1>

          {message && (
            <div className="message-wrapper">
              <code id="otp-message">{message}</code>
            </div>
          )}

          <form className="otp-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="recovery-code"
              id="recovery-code"
              className="passcode"
              placeholder="Enter 8-character code"
              value={recoveryCode}
              onChange={(e) => setRecoveryCode(e.target.value.replace(" ", ""))}
            />
          </form>

          <div className="lost-device" onClick={handleLostRecoveryCode}>
            😓 I lost my recovery code 😓
          </div>

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
        </>
      )}
    </div>
  );
}
