"use client";

import { useEffect } from "react";
import { Button, Image } from "@nextui-org/react";
import { Html5Qrcode } from "html5-qrcode";

import { useRouter } from "next/navigation";


export default function QRCodeScanner({ showScanner }) {
  
  const { push } = useRouter();
  let scanner = null;

  useEffect(() => {   

    if (scanner) {
      scanner.clear();
      return;
    }

    scanner = new Html5Qrcode("reader");

    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      
      push(decodedText);
      scanner.clear();
    }
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    Html5Qrcode.getCameras().then(devices => {

      console.log(devices)
      /**
       * devices would be an array of objects of type:
       * { id: "id", label: "label" }
       */
      if (devices && devices.length) {
        if (devices.length > 1) {
          // more than one camera is available
          // you can choose the appropriate camera by checking the label
          // and then use the id to start the scanner
          var cameraId = devices[1].id;
          scanner.start({ deviceId: { exact: cameraId } }, config, qrCodeSuccessCallback);

          return;
        } else {
          // only one camera is available
          var cameraId = devices[0].id;
          scanner.start({ deviceId: { exact: cameraId } }, config, qrCodeSuccessCallback);
          return;
        }

      }
    }).catch(err => {
      // handle err
    });

    return () => {
      scanner.clear();
    };

  }, []);


  if (!showScanner && scanner) {
    scanner.stop().then(() => {
      console.log("QR Code stopped");
    }
    ).catch((err) => {
      console.error(err);
    });

    return null;
  }

  return (
    <div className="w-full md:w-[304px]">
      <div id="reader"></div>
    </div>
  );
}
