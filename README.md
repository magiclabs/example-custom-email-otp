# Custom UI Email Login with Magic Dedicated Wallet and One-Time Password (OTP)

Magic is a passwordless authentication sdk that supports passwordless email login via one-time passwords (OTP). This app will walk through implementing logins via email with OTP using your own UI.

> 🌐 **Live Demo → https://b2gzt5.csb.app/**

# Quick Start Instructions

```
$ git clone git@github.com:magiclabs/example-custom-email-otp.git
$ cd example-custom-email-otp
$ yarn install
$ yarn start
```

> app starts on http://localhost:3000

## Environment Variables

Replace the API keys in `.env` with your own:

```
REACT_APP_MAGIC_PUBLISHABLE_KEY=pk_live_123...
```

## Event Handling

There are two flows demonstrated in this app for which events must be handled to successfully authenticate a user. The main flow is the login flow, the other is the device verification flow.

## Events

**Email OTP**

| Event Name          | Definition                                                                      |
| ------------------- | ------------------------------------------------------------------------------- |
| `email-otp-sent`    | Dispatched when the OTP email has been successfully sent from the Magic server. |
| `verify-email-otp`  | Emit along with the OTP to verify the code from user.                           |
| `invalid-email-otp` | Dispatched when the OTP sent fails verification.                                |
| `cancel`            | Emit to cancel the login request.                                               |

**Device Verification**

| Event Name                         | Definition                                                             |
| ---------------------------------- | ---------------------------------------------------------------------- |
| `device-needs-approval`            | Dispatched when the device is unrecognized and requires user approval. |
| `device-verification-email-sent`   | Dispatched when the device verification email is sent.                 |
| `device-approved`                  | Dispatched when the user has approved the unrecongized device.         |
| `device-verification-link-expired` | Dispatched when the email verification email has expired.              |
| `device-retry`                     | Emit to restart the device registration flow.                          |
