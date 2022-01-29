import React from "react";

export default function Navbar({ onLogin, onLogout, onMint, currentUser }) {
  const navStyles = "flex items-center h-full px-1 sm:px-3 lg:px-5 hover:bg-gray-500 text-gray-300 font-semibold text-lg";
  const logIn = (
    <button onClick={onLogin} className={navStyles}>
      Log in
    </button>
  );
  const logOut = (
    <div key={0} className="flex justify-center h-full">
      <button onClick={onMint} className={navStyles + " mx-4 hover:bg-green-500 bg-green-600"}>
        Mint tokens
      </button>
      <button onClick={onLogout} className={navStyles}>
        Log out
      </button>
    </div>
  );
  const displayName = (
    <div key={1} className={navStyles}>
      {currentUser?.accountId}
    </div>
  );

  return (
    <nav className="bg-gray-800 z-50">
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex flex-row-reverse items-center justify-between h-16">{currentUser ? [logOut, displayName] : logIn}</div>
      </div>
    </nav>
  );
}
