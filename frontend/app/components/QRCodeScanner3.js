"use client";

import { useEffect, useState, } from "react";
import { Button, Image } from "@heroui/react";
import { useRouter } from "next/navigation";

import QRCodeScanner from 'react-qr-scanner';

export default function MyQrScanner() {
  const [result, setResult] = useState('No result');

  const handleScan = (data) => {
    if (data) {
      setResult(data);
      // Do something with the scanned data, e.g., navigate to a URL
      // window.location.href = data;
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div>
      <QRCodeScanner
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '50%' }}
      />
      <p>{result}</p>
    </div>
  );
}
