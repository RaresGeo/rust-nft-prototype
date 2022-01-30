import React from "react";
import Token from "./Token";

export default function Tokens({ tokens, pagination, children }) {
  const { previousOn, nextOn, previous, next, disabled } = pagination;

  const onPrevious = () => {
    if (previousOn && !disabled) previous();
  };

  const onNext = () => {
    if (nextOn) next();
  };

  return (
    <div className="flex flex-col items-center justify-center mx-12 my-6">
      {children}
      <div className="flex flex-wrap justify-evenly w-full p-4">
        {tokens.map((token, index) => {
          return <Token key={index} metadata={JSON.parse(token.extra)} token_id={token.token_id} owner_id={token.owner_id} />;
        })}
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <div
          onClick={onPrevious}
          className={`flex items-center px-4 py-2 text-gray-800 bg-gray-600 rounded-md ${
            previousOn && !disabled ? "hover:bg-blue-400 hover:text-white cursor-pointer" : "hover:bg-gray-400"
          }`}
        >
          Previous
        </div>
        <div className="px-4 py-2 mx-4 text-gray-700 bg-gray-500 rounded-md">{pagination.page}</div>
        <div
          onClick={onNext}
          className={`flex items-center px-4 py-2 text-gray-800 bg-gray-600 rounded-md ${
            nextOn && !disabled ? "hover:bg-blue-400 hover:text-white cursor-pointer" : "hover:bg-gray-400"
          }`}
        >
          Next
        </div>
      </div>
    </div>
  );
}
