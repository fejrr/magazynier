"use client";

import { Button } from "@nextui-org/react";
import { toast } from "react-toastify";

export default function Nav() {

  return (
    <>
    <div id="header" className={`py-6 px-2`}>
      <span className="text-white text-xl">
        Magazynier
      </span>
    </div>
    <div className={`border-b-2`}></div>
    </>
  );
}
