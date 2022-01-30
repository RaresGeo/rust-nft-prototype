import React, { useEffect, useState } from "react";

export default function Token({ metadata, token_id, owner_id }) {
  const getColour = (object, index) => {
    const previousColour = Object.keys(object)[index - 1] ? object[Object.keys(object)[index - 1]] : 0;
    const currentColour = object[Object.keys(object)[index]];
    const nextColour = Object.keys(object)[index + 1] ? object[Object.keys(object)[index + 1]] : 0;

    return `rgb(${previousColour}, ${currentColour}, ${nextColour})`;
  };

  return (
    <div className="transition-all bg-black rounded-xl text-center text-dark-white w-64 p-2 my-4 text-bold flex flex-col justify-center items-center">
      {token_id}
      <div className="bg-gray-800 rounded-xl shadow-xl h-fit w-full flex flex-col items-center justify-center">
        {metadata &&
          Object.keys(metadata).map((key, index) => {
            return (
              <div
                key={index}
                className={`p-2 w-full text-white ${!index ? "rounded-t-xl" : index === Object.keys(metadata).length - 1 ? "rounded-b-xl" : ""}`}
                style={{ background: getColour(metadata, index), mixBlendMode: "difference", color: "white" }}
              >
                {key + ": " + metadata[key]}
              </div>
            );
          })}
      </div>
      {owner_id}
    </div>
  );
}
