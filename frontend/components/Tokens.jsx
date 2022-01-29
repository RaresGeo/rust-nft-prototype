import React from "react";
import Token from "./Token";

export default function Tokens({ ownedTokens }) {
  return (
    <div className="mx-24 m-12 flex flex-wrap justify-evenly">
      {ownedTokens.map((token, index) => {
        return <Token key={index} metadata={JSON.parse(token.extra)} token_id={token.token_id} />;
      })}
    </div>
  );
}
