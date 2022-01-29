import "regenerator-runtime/runtime";
import React, { useState, useEffect } from "react";
import Big from "big.js";
import Navbar from "./components/Navbar";
import Tokens from "./components/Tokens";
import { v4 as uuidv4 } from "uuid";

const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();

const MINTING_PRICE = Big(1)
  .times(10 ** 23) // One yNEAR is 10 ** 24 yoctoNEAR
  .toFixed();

const App = ({ contract, currentUser, nearConfig, wallet }) => {
  const [ownedTokens, setOwnedTokens] = useState(null);

  const updateTokens = async () => {
    const tokens = await contract.nft_tokens_for_owner({
      account_id: currentUser.accountId,
      limit: 100,
    });

    let modifiedTokens = tokens.map((token) => {
      return {
        ...token.metadata,
        token_id: token.token_id,
      };
    });

    console.log(modifiedTokens);

    setOwnedTokens(modifiedTokens);
  };

  useEffect(async () => {
    if (currentUser) {
      updateTokens();
    }
  }, [currentUser]);

  const onMint = async () => {
    let token_id = `token-${uuidv4()}`;
    console.log(token_id);
    await contract.nft_mint(
      {
        token_id,
        receiver_id: currentUser.accountId,
      },
      BOATLOAD_OF_GAS,
      MINTING_PRICE // This represents the amount of NEAR paid for minting the token.
    );

    updateTokens();
  };

  const signIn = () => {
    wallet.requestSignIn(nearConfig.contractName, "NEAR Status Message");
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  return (
    <div className="w-full h-full overflow-hidden">
      <Navbar onLogin={signIn} onLogout={signOut} onMint={onMint} currentUser={currentUser} />

      {ownedTokens && <Tokens ownedTokens={ownedTokens} />}
    </div>
  );
};

export default App;
