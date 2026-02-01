"use client";

import React, { useEffect, useState } from "react";
import { generateQRCode, encodeContainerQR, encodeUserQR } from "@/lib/qr";
import { Button } from "@/components/ui/button";
import { Download, Wallet } from "lucide-react";

interface QRCodeDisplayProps {
  data: string;
  type: "container" | "user";
  size?: number;
  showDownload?: boolean;
  showWallet?: boolean;
  label?: string;
  className?: string;
}

export function QRCodeDisplay({
  data,
  type,
  size = 200,
  showDownload = false,
  showWallet = false,
  label,
  className = "",
}: QRCodeDisplayProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateQR = async () => {
      setIsLoading(true);
      try {
        const encodedData = type === "container"
          ? encodeContainerQR(data)
          : encodeUserQR(data);
        const qr = await generateQRCode(encodedData);
        setQrDataUrl(qr);
      } catch (error) {
        console.error("Failed to generate QR code:", error);
      }
      setIsLoading(false);
    };

    generateQR();
  }, [data, type]);

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `${type === "container" ? data : "my-qr-code"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddToWallet = () => {
    // In a real app, this would generate a .pkpass file
    // For demo, we'll show an alert
    alert("Apple Wallet integration coming soon! For now, download the QR code and add it to your photos.");
  };

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center bg-white rounded-lg ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="animate-pulse bg-gray-200 w-full h-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className="bg-white p-4 rounded-lg shadow-md"
        style={{ width: size + 32, height: size + 32 }}
      >
        {qrDataUrl && (
          <img
            src={qrDataUrl}
            alt={`QR Code for ${data}`}
            className="w-full h-full"
            style={{ imageRendering: "pixelated" }}
          />
        )}
      </div>

      {label && (
        <p className="mt-2 text-sm font-medium text-gray-700">{label}</p>
      )}

      {(showDownload || showWallet) && (
        <div className="flex gap-2 mt-3">
          {showDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          )}
          {showWallet && (
            <Button
              variant="default"
              size="sm"
              onClick={handleAddToWallet}
              className="flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              Add to Wallet
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
