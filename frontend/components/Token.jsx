import React, { useEffect, useState } from "react";

export default function Token({ metadata, token_id }) {
  console.log(token_id);
  return (
    <div className="transition-all bg-black rounded-xl text-center text-dark-white w-64 p-2 my-4 text-bold flex flex-col justify-center items-center">
      {token_id}
      <div className="bg-gray-800 rounded-xl shadow-xl h-fit w-full flex flex-col items-center justify-center">
        {metadata &&
          Object.keys(metadata).map((key, index) => {
            return (
              <div key={index} className="p-2">
                {key + ": " + metadata[key]}
              </div>
            );
          })}
      </div>
    </div>
  );
}
