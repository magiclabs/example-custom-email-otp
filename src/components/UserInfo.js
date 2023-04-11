import React from "react";

export default function UserInfo({ userInfo }) {
  const userInfoKeys = Object.keys(userInfo);

  return (
    <div className="user-info">
      <h1>Hello {userInfo.email}</h1>
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
              <td>{typeof userInfo[key]}</td>
              <td>{`${userInfo[key]}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
