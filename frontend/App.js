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
  const [allTokens, setAllTokens] = useState(null);
  const [ownedTokensPagination, setOwnedTokensPagination] = useState({ page: 0, limit: 3, disabled: false });
  const [allTokensPagination, setAllTokensPagination] = useState({ page: 0, limit: 3, disabled: false });

  const updateOwnedTokens = async () => {
    if (!currentUser) return;
    const tokens = await contract.nft_tokens_for_owner({
      account_id: currentUser.accountId,
      from_index: (ownedTokensPagination.limit * ownedTokensPagination.page).toString(),
      limit: ownedTokensPagination.limit + 1,
    });

    let modifiedTokens = tokens.map((token) => {
      return {
        ...token.metadata,
        token_id: token.token_id,
        owner_id: token.owner_id,
      };
    });

    console.log(modifiedTokens);

    setOwnedTokens(modifiedTokens);
  };

  const updateAllTokens = async () => {
    const tokens = await contract.nft_tokens({
      from_index: (allTokensPagination.limit * allTokensPagination.page).toString(),
      limit: allTokensPagination.limit + 1,
    });

    let modifiedTokens = tokens.map((token) => {
      return {
        ...token.metadata,
        token_id: token.token_id,
        owner_id: token.owner_id,
      };
    });

    setAllTokens(modifiedTokens);
  };

  const paginateOwnedTokens = async (direction) => {
    setOwnedTokensPagination({
      ...ownedTokensPagination,
      page: ownedTokensPagination.page + direction,
      disabled: true,
    });
  };

  useEffect(async () => {
    await updateOwnedTokens();

    setOwnedTokensPagination({
      ...ownedTokensPagination,
      disabled: false,
    });
  }, [ownedTokensPagination.page]);

  const paginateAllTokens = async (direction) => {
    setAllTokensPagination({
      ...allTokensPagination,
      page: allTokensPagination.page + direction,
      disabled: true,
    });
  };

  useEffect(async () => {
    await updateAllTokens();

    setAllTokensPagination({
      ...allTokensPagination,
      disabled: false,
    });
  }, [allTokensPagination.page]);

  useEffect(async () => {
    updateOwnedTokens();
    updateAllTokens();
  }, [currentUser]);

  const onMint = async () => {
    let token_id = `token-${uuidv4()}`;
    await contract.nft_mint(
      {
        token_id,
        receiver_id: currentUser.accountId,
      },
      BOATLOAD_OF_GAS,
      MINTING_PRICE // This represents the amount of NEAR paid for minting the token.
    );

    updateOwnedTokens();
  };

  const signIn = () => {
    wallet.requestSignIn(nearConfig.contractName, "NEAR Status Message");
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  return (
    <div className="max-w-full">
      <Navbar onLogin={signIn} onLogout={signOut} onMint={onMint} currentUser={currentUser} />

      {ownedTokens && (
        <Tokens
          tokens={ownedTokens.slice(0, ownedTokensPagination.limit)}
          pagination={{
            disabled: ownedTokensPagination.disabled,
            nextOn: ownedTokens.length > ownedTokensPagination.limit,
            previousOn: ownedTokensPagination.page > 0,
            page: ownedTokensPagination.page + 1,
            previous: () => {
              paginateOwnedTokens(-1);
            },
            next: () => {
              paginateOwnedTokens(1);
            },
          }}
        >
          <div className="rounded-lg bg-zinc-500 text-3xl font-bold text-dark-white">Your tokens</div>
        </Tokens>
      )}
      {allTokens && (
        <Tokens
          tokens={allTokens.slice(0, allTokensPagination.limit)}
          pagination={{
            disabled: allTokensPagination.disabled,
            nextOn: allTokens.length > allTokensPagination.limit,
            previousOn: allTokensPagination.page > 0,
            page: allTokensPagination.page + 1,
            previous: () => {
              paginateAllTokens(-1);
            },
            next: () => {
              paginateAllTokens(1);
            },
          }}
          page={allTokensPagination.page + 1}
        >
          <div className="rounded-lg bg-zinc-500 text-3xl font-bold text-dark-white">All tokens</div>
        </Tokens>
      )}
    </div>
  );
};

export default App;
