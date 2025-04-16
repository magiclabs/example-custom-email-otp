import React, { useContext, useState } from "react";
import { magic } from "../../lib/magic";
import UserContext from "../../context/UserContext";
import MFAOTPModal from "./MFAOTPModal";
import authy from "../../SVG/Authy.svg";
import googleAuth from "../../SVG/GoogleAuthenticator.svg";
import MFASettingsContext from "../../context/MFASettingsContext";
import MFARecoveryModal from "./MFARecoveryModal";

export default function DisableMFA({ setShowMFASettings }) {
  const { setUser } = useContext(UserContext);
  const { mfaSettings, setMFASettings } = useContext(MFASettingsContext);

  const [setShowMFAOTPModal] = useState(false);
  const [setShowMFARecoveryModal] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [mfaPage, setMFAPage] = useState(0);

  const handleCancel = () => {
    try {
      mfaSettings && mfaSettings.emit("cancel-mfa-disable");
      setDisabled(false);
      setShowMFASettings(false);
      setMFASettings(undefined);
      console.log("%cUser canceled MFA setup", "color: orange");
    } catch (err) {
      console.log("Error canceling MFA setup");
      console.error(err);
    }
  };

  const handleNext = async () => {
    if (mfaPage === 0) {
      handleDisableMFA();
      setMFAPage((current) => current + 1);
    } else if (mfaPage === 1) {
      setMFAPage((current) => current + 2);
    } else if (mfaPage === 3) {
      setMFAPage(2);
    } else {
      setShowMFASettings(false);
      setMFASettings(undefined);

      // update user info now that user.isMFAEnabled is true
      const updatedUserInfo = await magic.user.getInfo();
      setUser(updatedUserInfo);
    }
  };

  const handleDisableMFA = () => {
    const mfaSettings = magic.user.disableMFA({ showUI: false });
    setMFASettings(mfaSettings);

    mfaSettings
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
        setMFASettings(undefined);
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
            <MFAOTPModal
              handle={mfaSettings}
              handleCancel={handleCancel}
              setShowMFAOTPModal={setShowMFAOTPModal}
              setShowMFARecoveryModal={setShowMFARecoveryModal}
              handleNext={handleNext}
            />
          )}

          {mfaPage === 2 && (
            <>
              <div className="mfa-page0-header">
                <h1>You disabled MFA!</h1>
                <div className="emoji-confirm">👍</div>
              </div>
            </>
          )}

          {mfaPage === 3 && (
            <div>
              <MFARecoveryModal
                handleCancel={handleCancel}
                handleNext={handleNext}
                setShowMFARecoveryModal={setShowMFARecoveryModal}
              />
            </div>
          )}

          {mfaPage !== 1 && mfaPage !== 3 && (
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
