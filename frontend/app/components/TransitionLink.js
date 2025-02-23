"use client";

import {useEffect} from "react";
import { usePathname, useRouter, useParams} from "next/navigation";
import { Button } from "@heroui/react";

export default function TransitionLink({children, href, ...props}) {
  
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function sleep(ms) { 
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const handleTransition = async (e) => {
    
    e.preventDefault();

    const body = document.querySelector("body");
    body?.classList.add("page-transition");
    await sleep(200);
    router.push(href);
  };

  useEffect(() => {
    const body = document.querySelector("body");
    body?.classList.remove("page-transition");
  }, [pathname, params]);

  return (
      <Button
        href = {href}
        {...props}
        onPointerDown={handleTransition}
      >
        {children}
      </Button>
  );
}
