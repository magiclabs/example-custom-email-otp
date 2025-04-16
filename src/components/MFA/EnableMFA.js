import React, { useContext, useState } from "react";
import { magic } from "../../lib/magic";
import { QRCode } from "react-qrcode-logo";
import authy from "../../SVG/Authy.svg";
import googleAuth from "../../SVG/GoogleAuthenticator.svg";
import EmojiSVGLogo from "../../SVG/EmojiSVGLogo.svg";
import Copy from "../../SVG/Copy.svg";
import UserContext from "../../context/UserContext";
import MFAOTPModal from "./MFAOTPModal";
import MFASettingsContext from "../../context/MFASettingsContext";

export default function EnableMFA({ setShowMFASettings }) {
  const { user, setUser } = useContext(UserContext);
  const { mfaSettings, setMFASettings } = useContext(MFASettingsContext);
  const [disabled, setDisabled] = useState(false);
  const [mfaKey, setMFAKey] = useState();
  const [mfaQR, setMFAQR] = useState();
  const [recoveryCode, setRecoveryCode] = useState("");
  const [mfaPage, setMFAPage] = useState(0);

  const handleCancel = () => {
    try {
      mfaSettings && mfaSettings.emit("cancel-mfa-setup");

      setDisabled(false);
      setShowMFASettings(false);
      setMFASettings(null);

      console.log("%cUser canceled MFA setup", "color: orange");
    } catch (err) {
      console.log("Error canceling MFA setup");
      console.error(err);
    }
  };

  const handleNext = async () => {
    if (mfaPage === 0) {
      handleEnableMFA();
      setMFAPage((current) => current + 1);
    } else if (mfaPage === 1) {
      setMFAPage((current) => current + 1);
    } else {
      setMFASettings(null);
      setShowMFASettings(false);

      // update user info now that user.isMFAEnabled is true
      const updatedUserInfo = await magic.user.getInfo();
      setUser(updatedUserInfo);
    }
  };

  const handleEnableMFA = async () => {
    try {
      const mfaSettings = magic.user.enableMFA({ showUI: false });
      setMFASettings(mfaSettings);

      mfaSettings
        .on("mfa-secret-generated", ({ QRCode, key }) => {
          console.log("mfa-secret-generated", QRCode, key);

          setMFAKey(key);
          setMFAQR(QRCode);
        })
        .on("mfa-recovery-codes", async ({ recoveryCode }) => {
          // MFA enabled successfully
          console.log("mfa-recovery-codes", recoveryCode);

          setRecoveryCode(recoveryCode);
          setMFAPage((currentPage) => currentPage + 1);
        })
        .on("error", (error) => {
          console.log("error configuring MFA");
          console.error(error);
        });
    } catch (error) {
      console.error(error);
      setShowMFASettings(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy to clipboard: ", err);
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
                <h1>You'll need an authenticator app</h1>
              </div>

              <div className="mfa-message">
                To enable multi-factor authentication, you will need to use an
                authenticator app like <a href="https://authy.com/">Authy</a> or{" "}
                <a href="https://apps.apple.com/us/app/google-authenticator/id388497605">
                  Google Authenticator
                </a>
                .
              </div>
            </>
          )}

          {mfaPage === 1 && (
            <div className="qr-code-key-container">
              {mfaKey && mfaQR ? (
                <div className="mfa-qr-wrapper">
                  <div className="mfa-qr">
                    <div className="qr-code-wrapper">
                      <QRCode
                        value={mfaQR}
                        bgColor="#BDD5EA"
                        qrStyle="dots"
                        eyeRadius={50}
                        ecLevel="M"
                        removeQrCodeBehindLogo={true}
                        logoPadding={5}
                        logoImage={EmojiSVGLogo}
                      />
                    </div>
                    <h2>Scan this QR code</h2>
                    <span>
                      Open your authenticator app and scan this QR code or enter
                      your setup key.
                    </span>
                  </div>
                  <br />
                  <div className="key-wrapper">
                    <div className="span-wrapper">
                      <span>Key:</span>
                    </div>
                    <code
                      className="key-code"
                      onClick={() => copyToClipboard(mfaKey)}
                    >
                      <div className="span-key-wrapper">{mfaKey} </div>
                      <img
                        src={Copy}
                        alt="Copy action symbol"
                        className="copy-symbol-svg"
                      />
                    </code>
                  </div>
                </div>
              ) : (
                "Loading..."
              )}
            </div>
          )}

          {mfaPage === 2 && <MFAOTPModal handleCancel={handleCancel} />}

          {mfaPage === 3 && (
            <div className="mfa-page-wrapper">
              <h1>Save your recovery code</h1>
              <div className="span-page3-wrapper">
                <span>
                  This code can be used to log in if you lose access to your
                  authenticator app. Store it some place safe.
                </span>
              </div>

              <div className="key-wrapper">
                <span className="span-recovery">Your recovery code</span>

                <code
                  className="key-code"
                  onClick={() => copyToClipboard(recoveryCode)}
                >
                  <div className="span-key-wrapper">{recoveryCode} </div>
                  <img
                    src={Copy}
                    alt="Copy action symbol"
                    className="copy-symbol-svg"
                  />
                </code>
              </div>
            </div>
          )}

          {mfaPage !== 2 && (
            <div className="mfa-buttons">
              <button
                className="cancel-button"
                onClick={handleCancel}
                disabled={disabled}
              >
                cancel
              </button>
              <button
                className="mfa-next-button ok-button"
                disabled={disabled}
                onClick={handleNext}
              >
                {mfaPage === 3 ? "Finish" : "Next"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
