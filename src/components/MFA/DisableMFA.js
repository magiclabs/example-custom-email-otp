import React, { useCallback, useContext, useState } from "react";
import { magic } from "../../lib/magic";
import UserContext from "../../context/UserContext";
import MFAOTPModal from "./MFAOTPModal";
import authy from "../../SVG/Authy.svg";
import googleAuth from "../../SVG/GoogleAuthenticator.svg";

export default function DisableMFA({ setShowMFASettings }) {
  const { user, setUser } = useContext(UserContext);
  const [disabled, setDisabled] = useState(false);
  const [mfaHandle, setMFAHandle] = useState(undefined);
  const [mfaPage, setMFAPage] = useState(0);

  const handleCancel = useCallback(() => {
    try {
      mfaHandle && mfaHandle.emit("cancel-mfa-disable");
      setDisabled(false);
      setShowMFASettings(false);
      setMFAHandle(undefined);
      console.log("%cUser canceled MFA setup", "color: orange");
    } catch (err) {
      console.log("Error canceling MFA setup");
      console.error(err);
    }
  }, [mfaHandle, setShowMFASettings]);

  const handleNext = async () => {
    if (mfaPage === 0) {
      handleDisableMFA();
      setMFAPage((current) => current + 1);
    } else {
      setShowMFASettings(false);
      setMFAHandle(undefined);

      // update user info now that user.isMFAEnabled is true
      const updatedUserInfo = await magic.user.getInfo();
      setUser(updatedUserInfo);
    }
  };

  const handleDisableMFA = () => {
    const mfaHandle = magic.user.disableMFA({ showUI: false });
    setMFAHandle(mfaHandle);
    mfaHandle
      .on("mfa-code-requested", () => {
        // Dispatched when the user starts the disable MFA process.
        console.log("mfa-code-requested");
      })
      .on("done", async () => {
        // MFA disabled successfully.
        console.log("MFA disabled successfully");
        setMFAPage((currentPage) => currentPage + 1);
      })
      .on("error", (error) => {
        console.log("error configuring MFA");
        console.error(error);
        setMFAHandle(undefined);
        setShowMFASettings(false);
      });
  };

  return (
    <div className="overlay-container">
      <div className="content-wrapper">
        <div className="enable-mfa">
          {mfaPage === 0 && (
            <>
              <div className="mfa-page0-header">
                <div className="authenticator-svg-logos-wrapper">
                  <img src={authy} alt="Authy logo" className="svg-logo" />
                  <img
                    src={googleAuth}
                    alt="Google Authenticator logo"
                    className="svg-logo"
                  />
                </div>
                <h1>You'll need your authenticator app</h1>
              </div>

              <div className="mfa-message">
                To disable multi-factor authentication, you will need to use the
                authenticator app you used to enable MFA, such as{" "}
                <a href="https://authy.com/">Authy</a> or{" "}
                <a href="https://apps.apple.com/us/app/google-authenticator/id388497605">
                  Google Authenticator
                </a>
                .
              </div>
            </>
          )}

          {mfaPage === 1 && (
            <MFAOTPModal handle={mfaHandle} handleCancel={handleCancel} />
          )}

          {mfaPage === 2 && (
            <>
              <div className="mfa-page0-header">
                <h1>You disabled MFA!</h1>
                <div className="emoji-confirm">👍</div>
              </div>
            </>
          )}

          {mfaPage !== 1 && (
            <div className="mfa-buttons">
              <button
                className="mfa-next-button ok-button"
                disabled={disabled}
                onClick={handleNext}
              >
                {mfaPage === 2 ? "Finish" : "Next"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
