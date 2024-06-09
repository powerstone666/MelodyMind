import React, { useState } from "react";
import useMediaQuery from "../useMedia";
import Topsongs from "./topsong";
import Newreleasemobile from "./newreleasemobile";
function Newrelease() {
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const time=new Date().getFullYear();
  return (
    <>
      {isAboveMedium ? (
        <Topsongs names={`${time}  songs`} />
      ) : (
        <Newreleasemobile names={"2024"} />
      )}
    </>
  );
}
export default Newrelease;
