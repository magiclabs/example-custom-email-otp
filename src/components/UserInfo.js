import React from "react";

export default function UserInfo({ userInfo }) {
  const userInfoKeys = Object.keys(userInfo);

  return (
    <div className="user-info">
      <h1>Hello {userInfo.email}</h1>

      {/* Desktop view */}
      <table>
        <caption>User Metadata</caption>

        <thead>
          <tr>
            <th>Key</th>
            <th>Type</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {userInfoKeys.map((key, index) => (
            <tr key={index}>
              <td>{key}</td>

              {Array.isArray(userInfo[key]) ? (
                <>
                  <td>array</td>
                  <td>{`${JSON.stringify(userInfo[key]) || []}`}</td>
                </>
              ) : (
                <>
                  <td>{typeof userInfo[key]}</td>
                  <td>{`${userInfo[key]}`}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile view */}
      <div className="mobile-user-meta">
        <h2>User Metadata</h2>

        <div>
          {userInfoKeys.map((key, index) => (
            <div key={index}>
              <div className="key-and-type">
                <div>{key}</div>
                <div>
                  {Array.isArray(userInfo[key])
                    ? "array"
                    : typeof userInfo[key]}
                </div>
              </div>
              <div className="value">{JSON.stringify(userInfo[key])}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
