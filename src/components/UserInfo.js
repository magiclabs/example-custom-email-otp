import React from 'react'

export default function UserInfo({userInfo}) {
  const userInfoKeys = Object.keys(userInfo);

  return (
    <div className="userInfo componentContainer">
      <h1>Hello {userInfo.email}</h1>
      <h2>User Metadata</h2>
          <table>
            <thead>
              <tr>
                <th style={{ width: "20%" }}>Key</th>
                <th style={{ width: "20%" }}>Type</th>
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
  )
}
