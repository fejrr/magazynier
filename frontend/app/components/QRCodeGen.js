"use client";

import { useState } from "react";
import { Button, Image } from "@heroui/react";
import QRCode from "qrcode";

import { useRouter } from "next/navigation";

export default function QRCodeGen() {

  const { push } = useRouter();
  const [qr, setQR] = useState(null);

  const generateQR = async () => {

    let url = window.location.pathname
    // if (window.location.host === "magazynier.fejr-projekty.ovh") {
    //     url = window.location.href
    // }

    const qr = await QRCode.toDataURL(url);
    return qr;
  };

  return (
    <div className="w-full md:w-[304px]">
      {qr ? (
        <div className="flex flex-col gap-2">
          <Image src={qr} alt="QR" className="w-full" />
          <Button
            size="sm"
            color="warning"
            onPress={() => setQR(null)}
            className="w-full mt-1"
          >
            Ukryj kod QR
          </Button>
        </div>
      ) : (
        <Button
          size="sm"
          color="primary"
          onPress={async () => {
            const qr = await generateQR();
            setQR(qr);
          }}
          className="w-full md:w-[304px]"
        >
          Pokaż kod QR
        </Button>
      )}
    </div>
  );
}
