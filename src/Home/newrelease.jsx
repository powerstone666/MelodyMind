import React, { useState } from "react";
import useMediaQuery from "../useMedia";
import Topsongs from "./topsong";
function Newrelease() {
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  return (
    <>
      {isAboveMedium ? (
        <Topsongs names={"hindi2024"} />
      ) : (
        <Topsongs names={"hindi2024"} />
      )}
    </>
  );
}
export default Newrelease;
