"use client";

import { useEffect } from "react";
import { Button, Image } from "@heroui/react";
import { Html5QrcodeScanner } from "html5-qrcode";

import { useRouter } from "next/navigation";

export default function QRCodeScanner() {

  const { push } = useRouter();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
      aspectRatio: 1.0,
    });
    scanner.render(success, error);

    function success(result) {
      scanner.clear();
      push(result);
    }

    function error(error) {
      console.error(error);
    }

    return () => {
      scanner.clear();
    };
  }, []);

  return (
    <div className="w-full md:w-[304px]">
      <div id="reader"></div>
    </div>
  );
}
