import React, { useState } from "react";

export default function EmailForm({ handleEmailLoginCustom }) {
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    handleEmailLoginCustom(email);
  }

  return (
    <>
      <h1>Please sign up or login</h1>

      <form className="email-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="ok-button" type="submit">
          Login
        </button>
      </form>
    </>
  );
}
