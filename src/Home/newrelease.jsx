import React, { useState } from "react";
import useMediaQuery from "../useMedia";
import Topsongs from "./topsong";
function Newrelease() {
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const time=new Date().getFullYear();
  return (
    <>
      {isAboveMedium ? (
        <Topsongs names={`${time}  songs`} />
      ) : (
        <Topsongs names={"2024"} />
      )}
    </>
  );
}
export default Newrelease;
